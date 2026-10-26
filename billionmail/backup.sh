#!/usr/bin/env bash
# Back up BillionMail: database dump + mailboxes, DKIM keys, config, SSL and .env.
#
#   sudo bash backup.sh                 # writes to /root/billionmail-backups, keeps 7
#   cron:  0 3 * * * bash /opt/billionmail-kit/backup.sh >/var/log/bm-backup.log 2>&1
set -euo pipefail

BM_DIR="${BM_DIR:-/opt/billionmail}"
OUT_DIR="${OUT_DIR:-/root/billionmail-backups}"
KEEP="${KEEP:-7}"
STAMP=$(date +%Y%m%d-%H%M%S)

cd "$BM_DIR"
# shellcheck disable=SC1091
. ./.env
mkdir -p "$OUT_DIR"
chmod 700 "$OUT_DIR"

echo "Dumping database"
docker compose exec -T pgsql-billionmail pg_dump -U "$DBUSER" -d "$DBNAME" -Fc > "$OUT_DIR/db-$STAMP.dump"

echo "Archiving files"
tar -czf "$OUT_DIR/files-$STAMP.tar.gz" .env conf ssl ssl-self-signed vmail-data rspamd-data core-data 2>/dev/null || true

ls -1t "$OUT_DIR"/db-*.dump    | tail -n +"$((KEEP + 1))" | xargs -r rm -f
ls -1t "$OUT_DIR"/files-*.tar.gz | tail -n +"$((KEEP + 1))" | xargs -r rm -f

echo "Done: $OUT_DIR/db-$STAMP.dump, $OUT_DIR/files-$STAMP.tar.gz"
echo "Copy these off the server (another provider, S3, Google Drive) - a backup on the same disk is not a backup."
