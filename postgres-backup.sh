#!/usr/bin/env bash

set -Eeuo pipefail
umask 077

BACKUP_DIR="/opt/thinkz-ai/backups"
TIMESTAMP="$(date -u +%Y-%m-%d_%H-%M-%S)"
BACKUP_NAME="thinkz_ai_${TIMESTAMP}.dump"
FINAL_BACKUP="${BACKUP_DIR}/${BACKUP_NAME}"
TEMP_BACKUP="${FINAL_BACKUP}.tmp"
S3_BUCKET="thinkz-ai-rk-backups-114757333589"
S3_PREFIX="postgresql-backups"

cleanup() {
    rm -f "$TEMP_BACKUP"
}

trap cleanup EXIT

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

if ! docker inspect thinkz_postgres \
    --format '{{.State.Status}}' 2>/dev/null |
    grep -qx "running"; then
    echo "ERROR: PostgreSQL container is not running" >&2
    exit 1
fi

docker exec thinkz_postgres \
    pg_dump \
    -U thinkz_user \
    -d thinkz_ai \
    -Fc > "$TEMP_BACKUP"

if [ ! -s "$TEMP_BACKUP" ]; then
    echo "ERROR: Backup file is empty" >&2
    exit 1
fi

docker run --rm \
    -v "$BACKUP_DIR:/backup:ro" \
    postgres:16-alpine \
    pg_restore --list "/backup/${BACKUP_NAME}.tmp" \
    >/dev/null

mv "$TEMP_BACKUP" "$FINAL_BACKUP"

(
    cd "$BACKUP_DIR"
    sha256sum "$BACKUP_NAME" > "${BACKUP_NAME}.sha256"
)

aws s3 cp "$FINAL_BACKUP" "s3://${S3_BUCKET}/${S3_PREFIX}/${BACKUP_NAME}" --sse AES256
aws s3 cp "${FINAL_BACKUP}.sha256" "s3://${S3_BUCKET}/${S3_PREFIX}/${BACKUP_NAME}.sha256" --sse AES256

find "$BACKUP_DIR" \
    -type f \
    \( -name 'thinkz_ai_*.dump' -o -name 'thinkz_ai_*.dump.sha256' \) \
    -mtime +7 \
    -delete

BACKUP_SIZE="$(du -h "$FINAL_BACKUP" | cut -f1)"

echo "SUCCESS: PostgreSQL backup completed"
echo "Backup: $FINAL_BACKUP"
echo "Size: $BACKUP_SIZE"
echo "Checksum: ${FINAL_BACKUP}.sha256"
