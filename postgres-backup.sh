#!/bin/bash

BACKUP_DIR="/opt/thinkz-ai/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

mkdir -p "$BACKUP_DIR"

docker exec thinkz_postgres \
pg_dump -U thinkz_user -d thinkz_ai \
-Fc > "$BACKUP_DIR/thinkz_ai_$DATE.dump"

find "$BACKUP_DIR" -type f \
-name "thinkz_ai_*.dump" \
-mtime +7 -delete

echo "$(date): PostgreSQL backup completed: thinkz_ai_$DATE.dump"
