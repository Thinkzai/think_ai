#!/usr/bin/env bash
set -Eeuo pipefail

TAG="${1:?Usage: deploy-ecr.sh IMAGE_TAG}"

AWS_REGION="ap-south-2"
ECR_REGISTRY="114757333589.dkr.ecr.ap-south-2.amazonaws.com"
PROJECT_DIR="/opt/thinkz-ai"

BACKEND_IMAGE="${ECR_REGISTRY}/thinkz-ai-backend:${TAG}"
SWITCH_SCRIPT="${PROJECT_DIR}/scripts/switch-backend-upstream.sh"
UPSTREAM_FILE="${PROJECT_DIR}/infra/nginx/runtime/backend-active.conf"

GREEN_CONTAINER="thinkz_backend_green"
GREEN_ALIAS="backend_green"
NETWORK="thinkz-ai_default"

cd "$PROJECT_DIR"

echo "===== BLUE-GREEN ECR DEPLOYMENT ====="
echo "Tag: $TAG"
echo "Backend image: $BACKEND_IMAGE"

echo
echo "===== 1. PRE-FLIGHT CHECKS ====="

[ -x "$SWITCH_SCRIPT" ] || {
    echo "ERROR: Switch script missing or not executable"
    exit 1
}

[ -f "$UPSTREAM_FILE" ] || {
    echo "ERROR: Runtime upstream file missing"
    exit 1
}

[ -f backend/.env ] || {
    echo "ERROR: backend/.env missing"
    exit 1
}

CURRENT="$(
    awk '
      /server (backend|backend_green):5000;/ {
        value=$2
        sub(":5000;", "", value)
        print value
        exit
      }
    ' "$UPSTREAM_FILE"
)"

echo "Currently active backend: $CURRENT"

if [ "$CURRENT" != "backend" ]; then
    echo "SAFETY STOP:"
    echo "This deployment version expects BLUE/backend to be active."
    echo "Current active backend is: $CURRENT"
    exit 1
fi

docker inspect thinkz_backend >/dev/null 2>&1 || {
    echo "ERROR: BLUE backend container missing"
    exit 1
}

docker inspect thinkz_frontend >/dev/null 2>&1 || {
    echo "ERROR: Production frontend missing"
    exit 1
}

curl -fsS http://localhost/ >/dev/null || {
    echo "ERROR: Production frontend pre-check failed"
    exit 1
}

curl -fsS http://localhost/api/courses >/dev/null || {
    echo "ERROR: Production API pre-check failed"
    exit 1
}

echo "Pre-flight production checks: PASS"

echo
echo "===== 2. ECR LOGIN ====="

aws ecr get-login-password \
    --region "$AWS_REGION" |
docker login \
    --username AWS \
    --password-stdin "$ECR_REGISTRY"

echo
echo "===== 3. PULL CANDIDATE BACKEND ====="

docker pull "$BACKEND_IMAGE"

echo
echo "===== 4. REMOVE OLD INACTIVE GREEN ====="

if docker inspect "$GREEN_CONTAINER" >/dev/null 2>&1; then
    docker rm -f "$GREEN_CONTAINER"
fi

echo
echo "===== 5. START NEW GREEN ====="

docker run -d \
    --name "$GREEN_CONTAINER" \
    --network "$NETWORK" \
    --network-alias "$GREEN_ALIAS" \
    --env-file backend/.env \
    --restart no \
    --health-cmd='wget -q -O /dev/null http://127.0.0.1:5000/health || exit 1' \
    --health-interval=10s \
    --health-timeout=5s \
    --health-retries=3 \
    --health-start-period=10s \
    "$BACKEND_IMAGE"

echo
echo "===== 6. WAIT FOR GREEN HEALTH ====="

GREEN_OK=false

for attempt in $(seq 1 12); do
    GREEN_STATUS="$(
        docker inspect "$GREEN_CONTAINER" \
          --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}'
    )"

    echo "Attempt ${attempt}/12: green=${GREEN_STATUS}"

    if [ "$GREEN_STATUS" = "healthy" ]; then
        GREEN_OK=true
        break
    fi

    sleep 5
done

if [ "$GREEN_OK" != true ]; then
    echo "ERROR: GREEN candidate did not become healthy"
    docker logs --tail 100 "$GREEN_CONTAINER" || true
    exit 1
fi

echo "GREEN Docker health: PASS"

echo
echo "===== 7. PRIVATE GREEN SMOKE TEST ====="

docker run --rm \
    --network "$NETWORK" \
    curlimages/curl:8.12.1 \
    -fsS \
    "http://${GREEN_ALIAS}:5000/health"

echo

GREEN_API_CODE="$(
    docker run --rm \
      --network "$NETWORK" \
      curlimages/curl:8.12.1 \
      -sS \
      -o /dev/null \
      -w '%{http_code}' \
      "http://${GREEN_ALIAS}:5000/api/courses"
)"

if [ "$GREEN_API_CODE" != "200" ]; then
    echo "ERROR: GREEN API returned HTTP ${GREEN_API_CODE}"
    exit 1
fi

echo "GREEN API: HTTP 200"

echo
echo "===== 8. SWITCH PRODUCTION BLUE -> GREEN ====="

"$SWITCH_SCRIPT" backend_green

echo
echo "===== 9. POST-SWITCH VERIFICATION ====="

grep -q 'server backend_green:5000;' "$UPSTREAM_FILE" || {
    echo "ERROR: GREEN is not active after switch"
    "$SWITCH_SCRIPT" backend || true
    exit 1
}

if ! curl -fsS http://localhost/ >/dev/null; then
    echo "ERROR: Production frontend failed after switch"
    "$SWITCH_SCRIPT" backend || true
    exit 1
fi

if ! curl -fsS http://localhost/api/courses >/dev/null; then
    echo "ERROR: Production API failed after switch"
    "$SWITCH_SCRIPT" backend || true
    exit 1
fi

GREEN_HEALTH="$(
    docker inspect "$GREEN_CONTAINER" \
      --format '{{.State.Health.Status}}'
)"

if [ "$GREEN_HEALTH" != "healthy" ]; then
    echo "ERROR: GREEN became unhealthy after switch"
    "$SWITCH_SCRIPT" backend || true
    exit 1
fi

echo
echo "===== DEPLOYMENT SUCCESS ====="
echo "Tag: $TAG"
echo "Active backend: backend_green"
echo "Green health: $GREEN_HEALTH"
echo "Production frontend: PASS"
echo "Production API: PASS"
echo
echo "BLUE remains running and available for rollback."
