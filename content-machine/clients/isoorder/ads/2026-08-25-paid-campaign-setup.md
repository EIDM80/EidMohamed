# ISO Order Portal — Paid Awareness Campaign Setup (2026-08-25)

Status: **Meta side fully built and PAUSED, awaiting final approval to activate.**
TikTok side: **no ad-creation tool available in this session — brief below is ready to paste into TikTok Ads Manager manually.**

---

## 1. Cleanup of old campaigns (Meta Ads account: ISO Order Portal, act_230169338334021)

All 3 previously-scheduled campaigns were found and **paused** (the connector used here does not allow a hard delete — it force-converts any delete request into PAUSED as a safety guardrail). This stopped all spend, including the one campaign that was actively running.

| Old campaign | Status before | Status now |
|---|---|---|
| ISO Order Portal - Traffic - LPV - UAE (20 AED/day) | ACTIVE, spending | PAUSED |
| ISO Order Portal - Per-Ad Budget - UAE (7 ad sets, 15 AED/day each) | PAUSED | PAUSED (unchanged) |
| ISO Order Portal - Sales - LPV - UAE (20 AED/day) | PAUSED | PAUSED (unchanged) |

If you want these fully removed from the account (not just paused), that has to be done manually from Ads Manager — Meta's API through this connector won't hard-delete.

---

## 2. New creative assets (reused from the existing video library — no new generation)

| Persona | Source video | Notes |
|---|---|---|
| Arabic female | `ar-emirati-fixed-final.mp4` | Emirati woman, hijab, business blazer, Dubai skyline (Burj Khalifa) behind her — premium/aspirational |
| Arabic male | `review-office-ar-v1-final.mp4` | Professional office, pointing at an actual Arabic-language certificate on his desk |
| English female | `eng-walk-office-final.mp4` | Professional woman, navy blazer, modern open-plan office with colleagues visible |

All 720x1280 vertical, 8–9.6s, uploaded to the Meta ad account video library.

## Ad copy (all 3, high-end register, CTA = Learn More, link = isoorder.com)

**Arabic female:**
- Headline: اعتماد أيزو دولي في 5 أيام فقط
- Primary text: لأن ثقة عملائك تبدأ من شهادة معتمدة. نمنح شركتك اعتماد الأيزو الدولي — معتمد ومُوثّق على IAF CertSearch، بسعر ثابت، خلال 5 أيام تقريباً، و100% أونلاين. انضم إلى مئات الشركات التي اختارت ISO Order Portal لتسريع نموها وثقة أسواقها.
- Description: معتمد على IAF CertSearch. 100% أونلاين.

**Arabic male:**
- Headline: شهادتك الدولية جاهزة خلال أيام
- Primary text: من التقديم إلى الاعتماد — أصبحت شركتي معتمدة دولياً بشهادة أيزو حقيقية، موثقة على IAF CertSearch. بدون تعقيد، بسعر ثابت، وخلال أيام معدودة. إذا كانت شركتك تستهدف عقوداً وعملاء أكبر، هذا هو الوقت المناسب للاعتماد.
- Description: سعر ثابت. اعتماد حقيقي وموثّق.

**English female:**
- Headline: Get ISO Certified in 5 Days
- Primary text: Win bigger contracts. Build lasting trust. Get internationally accredited. ISO Order Portal gets your company ISO-certified — accredited and verified on IAF CertSearch, at a fixed price, in about 5 days, 100% online. Join the companies across the UAE, Saudi Arabia and Oman who chose certification without the paperwork chaos.
- Description: Accredited. Verified. 100% online.

---

## 3. Meta campaign structure (all objects created PAUSED)

Objective: **OUTCOME_AWARENESS**, optimization goal **THRUPLAY** (video views), CBO daily budget **55 AED (~$15 USD @ 3.6725 peg)** per campaign, placements restricted to **Facebook + Instagram only** (no Audience Network / Messenger / Threads), targeting: broad Advantage+ Audience, ages 25–55 (suggestion, not hard cap), country-only geo (no interest/behavior narrowing — no valid Meta interest IDs were available in this session; can be added later in Ads Manager for tighter B2B/firmographic targeting).

| Campaign (country) | Campaign ID | Ad set ID | Ads (3 each) |
|---|---|---|---|
| UAE | 120249783208420061 | 120249783213620061 | 120249783223330061 (AR-F), 120249783237420061 (AR-M), 120249783238520061 (EN-F) |
| Saudi Arabia | 120249783208630061 | 120249783217000061 | 120249783242270061 (AR-F), 120249783246510061 (AR-M), 120249783247390061 (EN-F) |
| Oman | 120249783208950061 | 120249783220720061 | 120249783248260061 (AR-F), 120249783251040061 (AR-M), 120249783251840061 (EN-F) |

**⚠️ Known gap before going live:** the Facebook Page linked to this ad account ("ISO 9001:2015 Certification", page_id 681315091887886) has **no Instagram account attached** — confirmed via Graph API. The actual @isoordercom Instagram account (used for all organic posting) is linked to a *different* Page ("Isoorderdotcom") that isn't currently authorized on this ad account. Result: **these 9 ads will currently only deliver on Facebook, not Instagram**, even though the ad sets are configured for both. To fix before activating:
- Either link the @isoordercom Instagram Business account to the "ISO 9001:2015 Certification" Page (Meta Business Suite → Settings → Linked Accounts), **or**
- Grant this ad account access to the "Isoorderdotcom" Page (which already has @isoordercom linked) via Business Manager → Ad Account → Assign Assets, and I'll rebuild the creatives against that Page/IG pair.

Total committed spend across the 3 Meta campaigns once activated: **165 AED/day (~$45/day, ~$1,350/month)**.

---

## 4. TikTok Ads — manual setup brief (no creation tool available here)

No TikTok Ads Manager creation tool is connected in this environment (only pause/enable/budget-adjust on *existing* campaigns is available). Use this brief to build it manually in TikTok Ads Manager (business.tiktok.com), or share TikTok Business Center access and I can revisit.

**Campaign**
- Name: ISO Order Portal - Awareness - GCC
- Objective: Reach / Video Views (Awareness)
- Budget: $15/day (campaign or split across ad groups as you prefer)

**Ad groups** (mirror the Meta structure — one per country, or one combined GCC group if TikTok's minimum budgets make 3 separate groups impractical at $15/day):
- UAE, Saudi Arabia, Oman — placements: TikTok only (deselect Pangle/News Feed app family unless wanted)
- Targeting: Age 25–55, all genders, Interests/Behaviors: Business & Finance, Entrepreneurship (closest TikTok equivalents to Meta's business audience)

**3 Ads** (same video assets + same copy as Meta, shortened for TikTok's caption limits):
1. Arabic Female — `ar-emirati-fixed-final.mp4` — caption: "اعتماد أيزو دولي في 5 أيام فقط. معتمدة على IAF CertSearch. isoorder.com"
2. Arabic Male — `review-office-ar-v1-final.mp4` — caption: "شهادتك الدولية جاهزة خلال أيام. سعر ثابت. isoorder.com"
3. English Female — `eng-walk-office-final.mp4` — caption: "Get ISO Certified in 5 Days. Accredited & verified. isoorder.com"

Video files (raw, ready to download and re-upload to TikTok Ads Manager):
- https://raw.githubusercontent.com/EIDM80/EidMohamed/claude/inspect-deploy-local-9l1858/iso-cert-portal/public/marketing/ads/video/ig/ar-emirati-fixed-final.mp4
- https://raw.githubusercontent.com/EIDM80/EidMohamed/claude/inspect-deploy-local-9l1858/iso-cert-portal/public/marketing/ads/video/ig/review-office-ar-v1-final.mp4
- https://raw.githubusercontent.com/EIDM80/EidMohamed/claude/inspect-deploy-local-9l1858/iso-cert-portal/public/marketing/ads/video/ig/eng-walk-office-final.mp4

Destination URL for all: https://isoorder.com

---

## 5. What's left before this goes live

1. **Your approval to activate** (per your instruction — nothing above is spending yet, all PAUSED).
2. Fix the Instagram-linkage gap (section 3) if you want true FB+IG delivery, not just Facebook.
3. TikTok: someone with TikTok Ads Manager access needs to build the 3 ads from the brief in section 4 (or share access and I'll do it).
