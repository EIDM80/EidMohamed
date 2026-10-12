#!/usr/bin/env sh
# Dump the gateway database, keeping the last N days.
#
# The gateway's database is the only copy of who your customers are, what they
# are entitled to, and what they owe. Dify can be rebuilt from its own backups;
# this cannot be reconstructed from anything.
#
#   ./scripts/backup.sh /var/backups/gateway
#   0 3 * * *  /srv/gateway/scripts/backup.sh /var/backups/gateway
set -eu

DEST="${1:-./backups}"
KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$DEST"

if [ -z "${GATEWAY_DATABASE_URL:-}" ]; then
  echo "GATEWAY_DATABASE_URL is not set" >&2
  exit 1
fi

case "$GATEWAY_DATABASE_URL" in
  postgresql*)
    # pg_dump reads the URL directly; strip the SQLAlchemy driver suffix.
    URL=$(printf '%s' "$GATEWAY_DATABASE_URL" | sed 's|+psycopg||; s|+psycopg2||')
    OUT="$DEST/gateway-$STAMP.sql.gz"
    pg_dump "$URL" | gzip -9 > "$OUT"
    ;;
  sqlite*)
    FILE=$(printf '%s' "$GATEWAY_DATABASE_URL" | sed 's|.*:///||')
    OUT="$DEST/gateway-$STAMP.db"
    # .backup is safe on a live database; copying the file is not.
    sqlite3 "$FILE" ".backup '$OUT'"
    gzip -9 "$OUT"
    OUT="$OUT.gz"
    ;;
  *)
    echo "unsupported database URL" >&2
    exit 1
    ;;
esac

chmod 600 "$OUT"
echo "wrote $OUT"

# Prune old dumps only after the new one succeeded, so a failing backup never
# leaves you with nothing.
find "$DEST" -name 'gateway-*' -type f -mtime "+$KEEP_DAYS" -delete
echo "pruned dumps older than $KEEP_DAYS days"
