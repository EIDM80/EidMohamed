# BillionMail: cloud deployment kit

Scripts and a step-by-step guide for running [BillionMail](https://github.com/Billionmail/BillionMail)
(self-hosted email marketing and mail server) on a cloud VPS.

| File | What it does |
|---|---|
| `deploy.sh` | Installs Docker, clones BillionMail (pinned, tested version), generates random secrets, opens the firewall, starts the stack and prints your login. Safe to re-run. |
| `check-dns.sh` | Checks A, MX, SPF, DKIM, DMARC and reverse DNS (PTR) for your domain. |
| `backup.sh` | Dumps the database and archives mailboxes, DKIM keys, config and `.env`. Keeps the last 7. |
| `.env.example` | Reference for every setting. `deploy.sh` writes the real one for you. |

Tested on 2026-10-25 against BillionMail commit `fc36c76` (core 4.9.3): all 7 containers start,
admin login works, SMTP 25/465/587, IMAP 143/993, POP3 110/995 and webmail respond.

---

## 1. Choose a server

**Port 25 decides everything.** Without outbound port 25 the panel installs fine but cannot deliver a single email.

- Avoid Google Cloud (port 25 permanently blocked) and AWS/Azure (blocked, unblock by request, often refused for marketing mail).
- Hetzner, DigitalOcean, Vultr, Linode and OVH block port 25 on new accounts but usually open it on request
  once the account is verified. Ask support *before* you pay for a long term, and say the use is
  opt-in newsletters with your own domain.
- `deploy.sh` tests outbound port 25 and warns you if it is blocked.

**Size:** 2 vCPU, 4 GB RAM, 40 GB SSD, Ubuntu 22.04/24.04 or Debian 12, with a **dedicated IPv4**.
The stack idles at about 0.6 GB RAM and 3.2 GB of images. Rspamd and bulk sends need the headroom.

**Use a server only for this.** The BillionMail core container controls Docker on the host (root-equivalent),
so don't share it with your website or other apps.

**Check the IP is clean** before going further: paste it into <https://mxtoolbox.com/blacklists.aspx>.
If it is listed, ask the provider for a different IP.

## 2. Point DNS at the server (part 1)

In your domain's DNS panel (replace `yourdomain.com` and `SERVER_IP`):

| Type | Name | Value |
|---|---|---|
| A | `mail` | `SERVER_IP` |
| MX | `@` | `mail.yourdomain.com` (priority 10) |
| TXT | `@` | `v=spf1 a mx ip4:SERVER_IP -all` |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@yourdomain.com` |

If you use Cloudflare, set the `mail` record to **DNS only (grey cloud)**. Proxied records break mail.

Already have mail on this domain (Google Workspace, Zoho)? **Don't change the MX.** Use a subdomain for
campaigns instead, e.g. `news.yourdomain.com`, and do the table above for that subdomain.

**Reverse DNS (PTR):** in your VPS provider's panel, set the server IP's reverse DNS to `mail.yourdomain.com`.
Gmail and Outlook reject or spam-folder mail without it.

## 3. Install

SSH into the server as root:

```bash
git clone https://github.com/eidm80/eidmohamed.git /opt/billionmail-kit
cd /opt/billionmail-kit/billionmail
sudo bash deploy.sh --hostname mail.yourdomain.com --tz Africa/Cairo
```

> Until this kit is merged into `main`, add `-b claude/dazzling-bardeen-4oz5xd` to the `git clone` command.

It takes about 5 minutes. At the end it prints your panel URL, username and password, and saves them to
`/root/billionmail-credentials.txt` (readable by root only). The panel lives at a secret path:
`https://mail.yourdomain.com/<SafePath>`. Opening the bare address shows a 404 on purpose.

`deploy.sh` also opens ports 22, 25, 80, 443, 465, 587, 143, 993, 110 and 995 in `ufw`.
**Open the same ports in your provider's cloud firewall / security group** if it has one.

## 4. Set up in the panel

1. **Log in** and change the password (top-right profile menu).
2. **Domain → Add domain** `yourdomain.com`. The panel generates the DKIM key and shows the records it wants.
3. **Add the DKIM record** it shows: TXT `default._domainkey` → `v=DKIM1; k=rsa; p=...` (one line).
4. **SSL:** in the domain's SSL settings, apply a Let's Encrypt certificate. It needs port 80 open and
   the `mail` A record already pointing here. It renews automatically.
5. **Mailboxes:** create `postmaster@`, `abuse@` and a real reply-to address. Read them in webmail at
   `https://mail.yourdomain.com/roundcube/`.
6. **Run the DNS check** until everything is OK:
   ```bash
   bash /opt/billionmail-kit/billionmail/check-dns.sh yourdomain.com
   ```

## 5. Test deliverability before any campaign

1. Send one email to the address shown at <https://www.mail-tester.com>. Aim for **9/10 or better**.
   It tells you exactly what's missing.
2. Send to your own Gmail and Outlook. In Gmail use **Show original**: SPF, DKIM and DMARC should all say `PASS`.
3. Once both look good, tighten DMARC to `p=quarantine`.

## 6. Go live gradually (warm-up)

A new IP that suddenly sends thousands of emails gets blocked. Use BillionMail's **warmup** feature, or ramp manually:

| Days | Max emails/day |
|---|---|
| 1-3 | 50 |
| 4-7 | 200 |
| 8-14 | 1,000 |
| 15-30 | double every few days while bounces stay under 2% and complaints under 0.1% |

Only mail people who opted in, keep the unsubscribe link, and remove bounced addresses. Register the domain at
[Google Postmaster Tools](https://postmaster.google.com) to watch your reputation with Gmail.

## 7. Day-to-day operations

```bash
cd /opt/billionmail
docker compose ps                          # status of all 7 services
docker compose logs -f --tail 100 postfix-billionmail   # watch sending
bm                                         # upstream helper: show login, add domain/mailbox, ...
bash update.sh                             # upgrade BillionMail (take a backup first)
```

**Backups:** run nightly and copy them off the server:
```bash
crontab -e
0 3 * * * bash /opt/billionmail-kit/billionmail/backup.sh >/var/log/bm-backup.log 2>&1
```
To restore on a new server, run `deploy.sh`, stop the stack, untar the files archive into `/opt/billionmail`,
start Postgres and `pg_restore --clean --if-exists -U billionmail -d billionmail` the dump, then `docker compose up -d`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Panel URL gives 404 | Use the full `https://host/<SafePath>` from the credentials file. |
| Login API says "access denied" | Same cause: open the SafePath URL first, it sets the session cookie. |
| `docker compose pull` fails with `429 Too Many Requests` | Docker Hub rate limit. Wait a few minutes and re-run `deploy.sh`. |
| Mail stuck in queue / "connection timed out" to port 25 | Provider blocks outbound 25. Open a support ticket. |
| Mail lands in spam | Run `check-dns.sh` and mail-tester. Usually a missing PTR, DKIM or a too-fast warm-up. |
| Dovecot restarts with `Address family not supported` | Host has no IPv6. In `/opt/billionmail/conf/dovecot/dovecot.conf` set `listen = *`, then `docker compose restart dovecot-billionmail`. |
| Dovecot fails with `error setting rlimit` | Host (LXC/OpenVZ) can't raise limits. Use a KVM VPS, or lower `ulimits` in a `docker-compose.override.yml`. |

## Security checklist

- [ ] Admin password and `SafePath` are random (deploy.sh does this) and stored in a password manager
- [ ] `/root/billionmail-credentials.txt` deleted after you saved the login elsewhere
- [ ] SSH uses keys, password login disabled (`PasswordAuthentication no`)
- [ ] Postgres (25432) and Redis (26379) stay bound to `127.0.0.1` (default)
- [ ] Nightly backups copied off the server
- [ ] Unattended security updates: `apt install unattended-upgrades`
