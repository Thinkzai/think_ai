#!/usr/bin/env bash
set -Eeuo pipefail

TAG="${1:?Usage: deploy-ecr.sh IMAGE_TAG}"
AWS_REGION="ap-south-2"
ECR_REGISTRY="114757333589.dkr.ecr.ap-south-2.amazonaws.com"
PROJECT_DIR="/opt/thinkz-ai"

BACKEND_IMAGE="${ECR_REGISTRY}/thinkz-ai-backend:${TAG}"
FRONTEND_IMAGE="${ECR_REGISTRY}/thinkz-ai-frontend:${TAG}"

cd "$PROJECT_DIR"

OLD_BACKEND="$(docker inspect thinkz_backend --format '{{.Config.Image}}')"
OLD_FRONTEND="$(docker inspect thinkz_frontend --format '{{.Config.Image}}')"
DEPLOYMENT_STARTED=false

rollback() {
  trap - ERR

  if [ "$DEPLOYMENT_STARTED" = true ]; then
    echo "Deployment failed. Restoring previous images."

    BACKEND_IMAGE="$OLD_BACKEND" \
    FRONTEND_IMAGE="$OLD_FRONTEND" \
    docker compose up -d --no-deps --force-recreate backend frontend
  fi
}

trap rollback ERR

aws ecr get-login-password --region "$AWS_REGION" |
docker login --username AWS --password-stdin "$ECR_REGISTRY"

docker pull "$BACKEND_IMAGE"
docker pull "$FRONTEND_IMAGE"

DEPLOYMENT_STARTED=true

BACKEND_IMAGE="$BACKEND_IMAGE" \
FRONTEND_IMAGE="$FRONTEND_IMAGE" \
docker compose up -d --no-deps --force-recreate backend frontend

for attempt in $(seq 1 12); do
  BACKEND_HEALTH="$(docker inspect thinkz_backend --format '{{.State.Health.Status}}')"
  FRONTEND_HEALTH="$(docker inspect thinkz_frontend --format '{{.State.Health.Status}}')"

  if [ "$BACKEND_HEALTH" = "healthy" ] &&
     [ "$FRONTEND_HEALTH" = "healthy" ] &&
     curl -fsS http://localhost/ > /dev/null &&
     curl -fsS http://localhost/api/courses > /dev/null; then
    trap - ERR
    echo "DEPLOYMENT_SUCCESS: $TAG"
    exit 0
  fi

  echo "Waiting for services: attempt ${attempt}/12"
  sleep 5
done

echo "Health verification failed."
false
