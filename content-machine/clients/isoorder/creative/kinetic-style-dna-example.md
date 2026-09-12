```
STYLE DNA ANALYSIS
==================
Source: ISO Order Portal's own established brand system (theme.ts, Layers.tsx,
endcard-base.png) — used instead of fresh Pinterest references, since this
identity is already proven across 90+ published videos and posts. Pulling in
an unrelated Pinterest mood board would fight brand consistency rather than
serve it.

COLOR PALETTE
- Background: #0A0A0A (near-black), #161616 (alt panel)
- Primary/hero: #D7FF3F (acid lime) — reserved, max one hero element per frame
- Secondary accent: #9AE6FF (soft cyan) — background blooms only, never text
- Text: #FFFFFF (full), #9A9A9A (dim/secondary)
- Glow: rgba(215,255,63,0.45)

TYPOGRAPHY
- Arabic display: Noto Kufi Arabic, weight 700, tight letter-spacing
- Latin display: Gloock (serif display) for wordmark/endcard
- Mono accent: Geist Mono — used for numerals/stats/tech labels only
- Rule: exactly one weight (700) in captions; no italics; no light weights

COMPOSITION
- Centered/top-anchored caption block, ~7% from top
- Glass pill: rgba(0,0,0,0.30) + 6px blur backdrop, 20px radius
- Generous negative space; captions never exceed 3 words visible at once
- Radial mesh glow blooms anchored to corners, not center

MOTION LANGUAGE
- Springs only: snappy (damping 14/stiffness 160/mass 0.6) for word pops,
  smooth (damping 20/stiffness 90/mass 1) for large elements,
  bouncy (damping 11/stiffness 170/mass 0.7) for playful accents
- Easing: easeOutExpo for entrances, easeInOutQuint for moves, easeIn only
  on exits — linear is forbidden
- Constant grain (4.5% opacity, overlay blend) + vignette + soft-light
  color-grade wash on every frame

GRAPHIC ELEMENTS
- Circular icon badges with radial glow halo + 1.5px lime ring
- Corner brackets (L-shaped, 46px, mirrored 4 corners)
- Dot-grid texture at 6% opacity for depth
- Checkmark/shield iconography for trust/credibility beats

SHAPE LANGUAGE
- Circles (badges), rounded rects 16-20px radius (pills), 1-2px hairline
  strokes — no sharp corners on UI chrome, sharp corners reserved for
  brackets only

━━━━━━━━━━━━━━━━━━━━━━━━━━
WORD CATEGORIZATION — test dialogue (ar-saudi-final, 26 words / 7.85s)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Dialogue: "معظم أصحاب الأعمال يعتقدون أن شهادة الأيزو تحتاج أشهر من الأوراق.
هذا غير صحيح. معتمدة ومُوثقة على IAF CertSearch. سعر ثابت. حوالي 5 أيام.
100% أونلاين."

HERO WORDS (lime #D7FF3F, scale 1.3x, glow burst, held +2 frames)
- "الأيزو" (0.6-2.21s) — the core subject
- "معتمدة" (4.14-4.49s) — trust claim, paired with badge-icon pop
- "5" (6.71-6.84s) — mono font, stat-callout scale
- "100%" (7.15-7.41s) — mono font, finale bloom

PUNCH WORDS (white, heavy stroke, fast scale-bounce 0.85→1.15→1, no lime)
- "أشهر" (2.52-2.78s) — the false pain point being set up
- "هذا" (3.39-3.61s) — pivot word
- "غير" (3.61-3.83s) — negation beat 1
- "صحيح." (3.83-4.14s) — negation beat 2, paired with full-frame flash + checkmark
- "ثابت." (6.1-6.41s) — short punchy claim

SUPPORTING WORDS — everything else: standard spring reveal, white/dim, no
special treatment (معظم أصحاب الأعمال يعتقدون أن شهادة تحتاج من الأوراق.
ومُوثقة على IAF CertSearch. سعر حوالي أيام. أونلاين.)

━━━━━━━━━━━━━━━━━━━━━━━━━━
STORYBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENE 1 — 0.0s-1.56s
Spoken: "معظم أصحاب الأعمال يعتقدون أن"
Visual: locked UGC talking-head clip, subtle Ken Burns zoom begins (1.00→1.04
  over full clip, easeInOutQuint)
On-screen text: 3-word caption pages, standard spring reveal
Typography animation: snappy spring pop, translateY 26→0px
Graphic elements: none yet — establishing shot
Camera movement: micro zoom-in only (overlay motion graphics on fixed source,
  no literal camera cuts)
Transition: none
Sync notes: baseline pacing, sets rhythm for later punch beats

SCENE 2 — 1.56s-2.96s
Spoken: "شهادة الأيزو تحتاج أشهر من"
Visual: HERO pop on "الأيزو" — scale 1.3x, lime fill, glow burst radius
  animates 0→40px over 6 frames
On-screen text: "الأيزو" isolated visually via scale/color jump from
  neighbors
Typography animation: hero words hold 2 extra frames past their spoken end
  before fading, letting the eye register them
Graphic elements: faint corner-bracket flicker-in (12% opacity) to frame the
  hero moment
Camera: zoom continues
Transition: none
Sync: hero glow timed exactly to word.start, not page start

SCENE 3 — 2.96s-4.14s  ⚡ MYTH-BUST BEAT (new visual event)
Spoken: "الأوراق. هذا غير صحيح."
Visual: PUNCH treatment on "أشهر" (bounce), then on "هذا غير صحيح." —
  2-frame full-frame white flash (12% peak opacity) at 3.61s, followed by a
  checkmark-shield icon (from SectorIcon system) bursting in top-center,
  scaling 0→1 with bouncy spring, holding 8 frames, fading out
On-screen text: "غير" "صحيح." punch-scale in rapid succession (no lime —
  deliberately white/stark to read as correction, not celebration)
Typography animation: scale-bounce 0.85→1.15→1.0 over 5 frames per punch word
Graphic elements: full-frame flash + checkmark icon — the biggest single
  visual event in the piece, placed at the myth-correction moment
Camera: brief 1-frame hold (zoom pauses) during the flash for impact
Transition: hard flash cut, not a fade
Sync: flash frame = exact frame of "صحيح." word.start

SCENE 4 — 4.14s-5.32s
Spoken: "معتمدة ومُوثقة على IAF CertSearch."
Visual: HERO pop on "معتمدة" paired with a small circular badge-icon
  (checkmark) popping in beside the caption block, glow halo matching the
  AdPost icon-badge treatment
On-screen text: "معتمدة" scale 1.3x lime, rest standard
Typography animation: badge icon uses bouncy spring, word uses snappy spring
Graphic elements: corner brackets flash in fully (46px, mirrored 4 corners),
  reinforcing "credentialed/verified" framing
Camera: zoom continues
Transition: none
Sync: badge appears 2 frames before "معتمدة" starts (anticipation)

SCENE 5 — 5.32s-6.84s
Spoken: "سعر ثابت. حوالي 5"
Visual: PUNCH on "ثابت." (quick bounce), then HERO stat-callout on "5" —
  mono font (Geist Mono), larger scale than other hero words (1.5x), styled
  like a countdown/stat digit
On-screen text: "5" rendered oversized and isolated on its own beat
Typography animation: digit gets its own dedicated micro-scene (not
  sharing a caption page with neighbors) to maximize legibility
Graphic elements: thin lime underline draws in beneath "5" (0→100% width,
  4 frames)
Camera: zoom continues
Transition: none
Sync: underline draw synced to word.end, not word.start

SCENE 6 — 6.84s-7.85s (finale)
Spoken: "أيام. 100% أونلاين."
Visual: HERO finale on "100%" — mono font, scale 1.5x, radial glow bloom
  expands behind the entire caption block (not just the word), intensity
  ramping over the final 15 frames
On-screen text: caption holds through to endcard cut
Typography animation: final hero word gets the longest hold (matches
  ENDCARD_FRAMES handoff) so it doesn't feel cut off
Graphic elements: glow bloom crescendo, Ken Burns zoom reaches its 1.04x peak
  exactly on the last frame
Camera: zoom peak
Transition: hard cut to branded EndCard (existing component, unchanged)
Sync: bloom ramp starts at "100%" word.start, peaks at clip end
```
