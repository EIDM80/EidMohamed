#!/usr/bin/env bash
# Deploy BillionMail on a fresh Ubuntu/Debian VPS.
#
#   sudo bash deploy.sh --hostname mail.yourdomain.com [--tz Africa/Cairo] [--no-firewall]
#
# Safe to re-run: an existing .env (and its passwords) is never overwritten.
# shellcheck disable=SC2154  # ADMIN_*, SafePath, HTTP(S)_PORT come from the sourced .env
set -euo pipefail

BM_REPO="${BM_REPO:-https://github.com/Billionmail/BillionMail.git}"
BM_REF="${BM_REF:-fc36c76c050c3775c5e899faf7403cf0262d2744}"   # tested 2026-10-25 (core 4.9.3)
BM_DIR="${BM_DIR:-/opt/billionmail}"
CRED_FILE="${CRED_FILE:-/root/billionmail-credentials.txt}"

HOSTNAME_FQDN=""
TZ_NAME="Etc/UTC"
FIREWALL=1

die()  { echo -e "\e[31mERROR:\e[0m $*" >&2; exit 1; }
info() { echo -e "\e[32m==>\e[0m $*"; }
warn() { echo -e "\e[33mWARN:\e[0m $*"; }
rand() { LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c "$1" || true; }
set_env() { sed -i "s|^$1=.*|$1=$2|" .env; }

while [ $# -gt 0 ]; do
  case "$1" in
    --hostname)    HOSTNAME_FQDN="$2"; shift 2 ;;
    --tz)          TZ_NAME="$2"; shift 2 ;;
    --no-firewall) FIREWALL=0; shift ;;
    -h|--help)     sed -n '2,6p' "$0"; exit 0 ;;
    *)             die "unknown option: $1" ;;
  esac
done

[ "$(id -u)" -eq 0 ] || die "run as root (sudo bash $0 ...)"
[ -n "$HOSTNAME_FQDN" ] || die "--hostname is required, e.g. --hostname mail.yourdomain.com"
[[ "$HOSTNAME_FQDN" =~ ^[a-z0-9-]+(\.[a-z0-9-]+)+$ ]] || die "invalid hostname: $HOSTNAME_FQDN (use lowercase, e.g. mail.yourdomain.com)"

# --- 1. Prerequisites -------------------------------------------------------
info "Installing prerequisites"
if command -v apt-get >/dev/null; then
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -qq
  apt-get install -y -qq git curl openssl ca-certificates dnsutils >/dev/null
  [ "$FIREWALL" -eq 1 ] && apt-get install -y -qq ufw >/dev/null
else
  warn "apt-get not found; make sure git, curl, openssl and dig are installed"
fi

if ! command -v docker >/dev/null; then
  info "Installing Docker"
  curl -fsSL https://get.docker.com | sh
fi
command -v systemctl >/dev/null && systemctl enable --now docker >/dev/null 2>&1 || true
docker info >/dev/null 2>&1 || die "Docker daemon is not running (try: systemctl start docker)"
docker compose version >/dev/null 2>&1 || die "docker compose plugin is missing"

# --- 2. Outbound port 25 check ----------------------------------------------
info "Checking outbound SMTP (port 25)"
if timeout 8 bash -c 'exec 3<>/dev/tcp/gmail-smtp-in.l.google.com/25' 2>/dev/null; then
  info "Outbound port 25 is open"
else
  warn "Outbound port 25 looks BLOCKED. You can install, but you cannot deliver mail"
  warn "until your provider unblocks it (see README: 'Choose a server')."
fi

# --- 3. Get BillionMail -----------------------------------------------------
if [ -d "$BM_DIR/.git" ]; then
  info "Using existing checkout in $BM_DIR"
else
  info "Cloning BillionMail into $BM_DIR"
  git clone -q "$BM_REPO" "$BM_DIR"
  git -C "$BM_DIR" checkout -q "$BM_REF"
fi
cd "$BM_DIR"

# --- 4. Configuration (.env) ------------------------------------------------
if [ -s .env ]; then
  info ".env already exists, keeping current passwords"
else
  info "Generating .env with random secrets"
  cp env_init .env
  chmod 600 .env
  set_env ADMIN_USERNAME "admin$(rand 4 | tr 'A-Z' 'a-z')"
  set_env ADMIN_PASSWORD "$(rand 20)"
  set_env SafePath       "$(rand 12)"
  set_env DBPASS         "$(rand 32)"
  set_env REDISPASS      "$(rand 32)"
  set_env BILLIONMAIL_HOSTNAME "$HOSTNAME_FQDN"
  set_env TZ             "$TZ_NAME"
  set_env HTTP_PORT      80
  set_env HTTPS_PORT     443
  set_env FAIL2BAN_INIT  y
fi
# shellcheck disable=SC1091
. ./.env

# --- 5. Temporary self-signed certificate (replace in the panel) -------------
if [ ! -s ssl-self-signed/cert.pem ]; then
  info "Creating temporary self-signed certificate"
  mkdir -p ssl-self-signed
  openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 3650 \
    -keyout ssl-self-signed/key.pem -out ssl-self-signed/cert.pem \
    -subj "/CN=${BILLIONMAIL_HOSTNAME}" 2>/dev/null
fi
mkdir -p ssl
for f in ssl-self-signed/*; do [ -e "ssl/$(basename "$f")" ] || cp "$f" ssl/; done

# --- 6. Firewall ------------------------------------------------------------
if [ "$FIREWALL" -eq 1 ] && command -v ufw >/dev/null; then
  info "Configuring ufw"
  ufw allow 22/tcp >/dev/null      # keep SSH open before enabling
  for p in 25 465 587 143 993 110 995 "$HTTP_PORT" "$HTTPS_PORT"; do ufw allow "$p/tcp" >/dev/null; done
  ufw --force enable >/dev/null
  warn "Also open the same ports in your cloud provider's firewall / security group."
fi

# --- 7. Start ---------------------------------------------------------------
info "Pulling images (retries on Docker Hub rate limits)"
for i in 1 2 3 4; do
  docker compose pull -q && break
  warn "pull failed (attempt $i), retrying in $((i * 20))s"; sleep $((i * 20))
done
info "Starting containers"
docker compose up -d

echo "$BM_DIR" > /opt/PWD-Billion-Mail.txt   # used by upstream bm.sh
chmod +x bm.sh && ln -sf "$BM_DIR/bm.sh" /usr/bin/bm

sleep 20
docker compose ps --format 'table {{.Service}}\t{{.Status}}'

# --- 8. Credentials ---------------------------------------------------------
IP=$(curl -4 -fsS --max-time 10 https://ifconfig.me || echo YOUR_SERVER_IP)
PORT_SUFFIX=""; [ "$HTTPS_PORT" = "443" ] || PORT_SUFFIX=":$HTTPS_PORT"
cat > "$CRED_FILE" <<EOF
BillionMail admin panel
  URL:      https://${BILLIONMAIL_HOSTNAME}${PORT_SUFFIX}/${SafePath}
            (before DNS works: https://${IP}${PORT_SUFFIX}/${SafePath})
  Username: ${ADMIN_USERNAME}
  Password: ${ADMIN_PASSWORD}
Webmail:    https://${BILLIONMAIL_HOSTNAME}${PORT_SUFFIX}/roundcube/
Install dir: ${BM_DIR}   (secrets in ${BM_DIR}/.env)
EOF
chmod 600 "$CRED_FILE"
echo
cat "$CRED_FILE"
echo
info "Saved to $CRED_FILE. Next: add DNS records and run check-dns.sh (see README)."
