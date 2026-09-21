#!/usr/bin/env bash
set -Eeuo pipefail

TARGET="${1:?Usage: switch-backend-upstream.sh backend|backend_green [frontend-container] [smoke-base-url]}"
FRONTEND_CONTAINER="${2:-thinkz_frontend}"
SMOKE_BASE_URL="${3:-http://localhost}"

PROJECT_DIR="/opt/thinkz-ai"
UPSTREAM_DIR="${PROJECT_DIR}/infra/nginx/runtime"
UPSTREAM_FILE="${UPSTREAM_DIR}/backend-active.conf"
BACKUP_FILE="$(mktemp /tmp/thinkz-upstream-backup.XXXXXX)"
SMOKE_FILE="$(mktemp /tmp/thinkz-bluegreen-smoke.XXXXXX)"

case "$TARGET" in
  backend)
    TARGET_CONTAINER="thinkz_backend"
    ;;
  backend_green)
    TARGET_CONTAINER="thinkz_backend_green"
    ;;
  *)
    echo "ERROR: Target must be backend or backend_green"
    exit 1
    ;;
esac

cleanup() {
  rm -f "$BACKUP_FILE" "$SMOKE_FILE"
}

trap cleanup EXIT

if ! docker inspect "$FRONTEND_CONTAINER" >/dev/null 2>&1; then
  echo "ERROR: Frontend container not found: $FRONTEND_CONTAINER"
  exit 1
fi

if ! docker inspect "$TARGET_CONTAINER" >/dev/null 2>&1; then
  echo "ERROR: Backend container not found: $TARGET_CONTAINER"
  exit 1
fi

TARGET_RUNNING="$(
  docker inspect "$TARGET_CONTAINER" \
    --format '{{.State.Running}}'
)"

if [ "$TARGET_RUNNING" != "true" ]; then
  echo "ERROR: Backend container is not running: $TARGET_CONTAINER"
  exit 1
fi

if [ ! -f "$UPSTREAM_FILE" ]; then
  echo "ERROR: Upstream file not found: $UPSTREAM_FILE"
  exit 1
fi

cp "$UPSTREAM_FILE" "$BACKUP_FILE"

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

if [ -z "$CURRENT" ]; then
  echo "ERROR: Could not determine current backend"
  exit 1
fi

echo "Current backend: $CURRENT"
echo "Requested backend: $TARGET"
echo "Target container: $TARGET_CONTAINER"

rollback() {
  echo "ROLLBACK: Restoring backend $CURRENT"
  cp "$BACKUP_FILE" "$UPSTREAM_FILE"

  if docker exec "$FRONTEND_CONTAINER" nginx -t; then
    docker exec "$FRONTEND_CONTAINER" nginx -s reload
    echo "ROLLBACK_SUCCESS: Restored $CURRENT"
  else
    echo "CRITICAL: Restored Nginx configuration failed validation"
  fi
}

if [ "$CURRENT" = "$TARGET" ]; then
  echo "NO_CHANGE: $TARGET is already active"
  exit 0
fi

TEMP_FILE="${UPSTREAM_DIR}/backend-active.conf.next"

printf '%s\n' \
  'upstream thinkz_backend_active {' \
  "    server ${TARGET}:5000;" \
  '    keepalive 32;' \
  '}' \
  > "$TEMP_FILE"

mv "$TEMP_FILE" "$UPSTREAM_FILE"

if ! docker exec "$FRONTEND_CONTAINER" nginx -t; then
  echo "ERROR: New Nginx configuration failed"
  rollback
  exit 1
fi

docker exec "$FRONTEND_CONTAINER" nginx -s reload

for attempt in $(seq 1 10); do
  HTTP_CODE="$(
    curl -sS \
      -o "$SMOKE_FILE" \
      -w '%{http_code}' \
      "${SMOKE_BASE_URL}/api/courses" \
      2>/dev/null || true
  )"

  if [ "$HTTP_CODE" = "200" ]; then
    echo "PASS: API smoke test returned HTTP 200"
    echo "SWITCH_SUCCESS: $CURRENT -> $TARGET"
    exit 0
  fi

  echo "Waiting for API: attempt ${attempt}/10 HTTP=${HTTP_CODE}"
  sleep 1
done

echo "ERROR: API smoke test failed after switch"
rollback
exit 1
