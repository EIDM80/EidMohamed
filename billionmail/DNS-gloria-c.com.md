# DNS plan for gloria-c.com

Current DNS, checked 2026-10-26:

| Record | Current value | Meaning |
|---|---|---|
| NS | `daisy` / `dilbert.ns.cloudflare.com` | DNS is managed in **Cloudflare** |
| MX `@` | `mx.zoho.com` (10), `mx2` (20), `mx3` (50) | Your inbox is **Zoho Mail**. Keep it. |
| A `mail` | Cloudflare proxy IPs (orange cloud) | Must change: mail can't pass through the Cloudflare proxy |
| TXT `@` | `v=spf1 +a +mx +ip4:51.210.149.70 include:zohomail.com ~all` | Allows Zoho and an OVH server (`vps-6618f419.vps.ovh.net`) |
| TXT `default._domainkey` | existing DKIM key | Probably from that OVH server. **Don't overwrite it.** |
| TXT `_dmarc` | `v=DMARC1; p=none;` | Monitoring only |

## Plan

- **Server name:** `mail.gloria-c.com` (the new BillionMail VPS)
- **Campaign sending domain:** `news.gloria-c.com`. Campaigns go out as e.g. `hello@news.gloria-c.com`.
  - Zoho keeps receiving everything for `@gloria-c.com`.
  - A campaign reputation problem can't hurt your main domain.
  - There's no clash with the existing `default._domainkey.gloria-c.com` key.
- **Replies:** set the campaign *Reply-To* to your Zoho address (e.g. `info@gloria-c.com`) so replies land in your normal inbox.

## Records to add in Cloudflare

Replace `NEW_SERVER_IP` with the VPS IPv4. Every record below must be **DNS only (grey cloud)**.

| Type | Name | Content | Notes |
|---|---|---|---|
| A | `mail` | `NEW_SERVER_IP` | **Edit** the existing record: change the IP and switch the cloud to grey |
| MX | `news` | `mail.gloria-c.com`, priority 10 | Bounces and unsubscribe replies come back to BillionMail |
| TXT | `news` | `v=spf1 a:mail.gloria-c.com -all` | |
| TXT | `_dmarc.news` | `v=DMARC1; p=none; rua=mailto:postmaster@news.gloria-c.com` | Change to `p=quarantine` after a clean first week |
| TXT | `default._domainkey.news` | copy from the BillionMail panel | Available after you add `news.gloria-c.com` in **Domain** |

**In the VPS provider's panel:** set reverse DNS (PTR) of `NEW_SERVER_IP` to `mail.gloria-c.com`.

**Leave unchanged:** the root `MX` (Zoho), `default._domainkey`, `_dmarc`, `www` and the website records.

**Root SPF:** if the OVH server `51.210.149.70` is retired, remove `+ip4:51.210.149.70` from the root SPF.
Leave it if that server still sends mail.

## Commands

On the new VPS:

```bash
git clone -b claude/dazzling-bardeen-4oz5xd https://github.com/eidm80/eidmohamed.git /opt/billionmail-kit
cd /opt/billionmail-kit/billionmail
sudo bash deploy.sh --hostname mail.gloria-c.com --tz Africa/Cairo
```

Then in the panel: **Domain → Add** `news.gloria-c.com`, then copy its DKIM record into Cloudflare, then apply the
Let's Encrypt SSL. Create mailboxes `postmaster@news.gloria-c.com` and `abuse@news.gloria-c.com`.

Check DNS until everything is OK:

```bash
bash check-dns.sh news.gloria-c.com mail.gloria-c.com
```

Then send a test to <https://www.mail-tester.com> and follow README sections 5-6 (testing and warm-up).
