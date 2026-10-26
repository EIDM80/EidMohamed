#!/usr/bin/env bash
# Check the DNS records BillionMail needs for good deliverability.
#
#   bash check-dns.sh yourdomain.com [mail.yourdomain.com] [server-ip]
set -uo pipefail

DOMAIN="${1:?usage: $0 yourdomain.com [mail-hostname] [server-ip]}"
MAILHOST="${2:-mail.$DOMAIN}"
IP="${3:-$(curl -4 -fsS --max-time 10 https://ifconfig.me 2>/dev/null)}"
command -v dig >/dev/null || { echo "dig not found: apt-get install -y dnsutils"; exit 1; }

FAILS=0
ok()   { echo -e "  \e[32mOK\e[0m    $*"; }
bad()  { echo -e "  \e[31mFAIL\e[0m  $*"; FAILS=$((FAILS + 1)); }
q()    { dig +short "$@" @1.1.1.1 | sed 's/"//g' | tr '\n' ' '; }

echo "Domain: $DOMAIN   Mail host: $MAILHOST   Server IP: ${IP:-unknown}"

a=$(q A "$MAILHOST")
[[ " $a" == *" $IP "* ]] && ok "A     $MAILHOST -> $IP" || bad "A     $MAILHOST should point to $IP (found: ${a:-none})"

mx=$(q MX "$DOMAIN")
[[ "$mx" == *"$MAILHOST."* ]] && ok "MX    $DOMAIN -> $MAILHOST" || bad "MX    $DOMAIN should be '10 $MAILHOST' (found: ${mx:-none})"

spf=$(dig +short TXT "$DOMAIN" @1.1.1.1 | sed 's/"//g' | grep 'v=spf1' | head -1)
if [ -z "$spf" ]; then bad "SPF   missing TXT on $DOMAIN, e.g. v=spf1 a mx ip4:$IP -all"
elif [[ "$spf" == *"$IP"* || "$spf" == *" mx"* || "$spf" == *"+mx"* ]]; then ok "SPF   $spf"
else bad "SPF   does not cover $IP: $spf"; fi

dkim=$(q TXT "default._domainkey.$DOMAIN")
[[ "$dkim" == *"v=DKIM1"* ]] && ok "DKIM  default._domainkey.$DOMAIN present" || bad "DKIM  missing TXT default._domainkey.$DOMAIN (copy it from the panel: Domain > DNS records)"

dmarc=$(q TXT "_dmarc.$DOMAIN")
[[ "$dmarc" == *"v=DMARC1"* ]] && ok "DMARC $dmarc" || bad "DMARC missing TXT _dmarc.$DOMAIN, e.g. v=DMARC1; p=quarantine; rua=mailto:postmaster@$DOMAIN"

if [ -n "$IP" ]; then
  ptr=$(dig +short -x "$IP" @1.1.1.1 | sed 's/\.$//')
  [ "$ptr" = "$MAILHOST" ] && ok "PTR   $IP -> $MAILHOST" || bad "PTR   $IP should reverse to $MAILHOST (found: ${ptr:-none}); set it in your VPS provider's panel"
fi

echo
[ "$FAILS" -eq 0 ] && echo "All records look good." || echo "$FAILS record(s) need attention. DNS changes can take up to a few hours."
exit "$FAILS"
