---
format: 1080x1920
duration: 60.181s
message: "Wi-Fi isn't magic — it's radio waves carrying digital data between your device and a router"
arc: concept-explainer
audience: general tech-curious viewers
mode: autonomous
music: none
---

## Video direction

- **Palette** — Cobalt Grid preset: warm cream paper ground, electric cobalt as the only ink/accent, permanent graph-paper grid as ambient background texture at low opacity. No other colors invented.
- **Motion grammar + reveal model** — `power3` long-tail eases throughout (smooth, no bounce). Every frame reveals its pieces on the spoken cue that names them — nothing enters before the VO reaches it. Camera stays mostly static; motion lives in the invented elements (type, waves, diagrams), not in continuous drift.
- **Rhythm** — Frame 1 (hook) and Frame 7 (landing) are the held/breather beats — short, calm, resolve fast and hold. Frames 3–6 are the body: each builds cumulatively across its full duration, ending on a settled read, never a continuing animation.
- **Negative list** — no stock bokeh / purple-blue "AI" gradients, no fake UI chrome, no front-load-then-freeze (nothing dumped at t=0), no ambient screensaver drift during holds (subtle jitter only).

## Frame 1 — Hook

- scene: A single bold rhetorical question fills the frame, nothing else
- voiceover: "Ever wonder what's actually happening when you connect to Wi-Fi?"
- duration: 3.84s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Rhetorical question
- beat: curiosity
- blueprint: kinetic-type-beats (Reproduce)
- focal: the question line
- roles: question text = foreground subject · graph-paper grid = background (dim ~35%)

narrativeRole: Opens the cognitive gap — the viewer uses Wi-Fi daily but has never pictured the mechanism.
keyMessage: There's a real, physical thing happening — not magic.

Scene 1 (0.0–3.84s): the question assembles via per-word staggered reveal, timed to the VO naming each phrase — "Ever wonder" / "what's actually happening" / "when you connect to Wi-Fi?" — centered, ~55% of frame, cobalt ink on the cream grid ground. Holds still on the last word; no further motion.

## Frame 2 — Name the concept

- scene: The word "WI-FI" hard-cuts in place to "RADIO WAVES" — same shot, one word becomes the other
- voiceover: "It's not magic. It's radio waves — the same physics as an FM station, tuned differently."
- duration: 6.379s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-concept.html
- type: product_intro
- persuasion: Analogy / metaphor
- beat: clarity and orientation
- blueprint: kinetic-type-beats (Adapt)
- focal: the WI-FI → RADIO WAVES token swap
- roles: wordmark = foreground subject · grid = background

Adapt: keep the hard-cut token-swap signature move; the "token" here is the whole concept name, not a numeric slot.

narrativeRole: Names the real mechanism and anchors it to something already familiar (FM radio).
keyMessage: Wi-Fi is literally a radio signal, not a special invisible internet substance.

Scene 1 (0.0–1.8s): "WI-FI" centered, full-bleed bold display type, dim grid behind — held one beat as the VO says "It's not magic."
Scene 2 (1.8–3.6s): on "It's radio waves," hard-cut token-swap in place — "WI-FI" is instantly replaced by "RADIO WAVES," same position and scale.
Scene 3 (3.6–6.379s): on "the same physics as an FM station, tuned differently," a subline per-word-reveals beneath the wordmark; holds still on the final word.

## Frame 3 — Two bands, two tradeoffs

- scene: Two labeled wave lanes, stacked top/bottom — "2.4 GHz" (long, slow wave reaching far) and "5 GHz" (short, fast wave, shorter reach)
- voiceover: "Your router broadcasts on two bands. 2.4 gigahertz — travels far, goes slow. 5 gigahertz — fast, but it doesn't go as far."
- duration: 9.493s
- transition_in: push-slide RIGHT
- status: outline
- src: compositions/frames/03-bands.html
- type: feature_showcase
- persuasion: Comparison of two options
- beat: comprehension
- blueprint: comparison-split (Reproduce, stacked for portrait)
- focal: the two labeled wave lanes
- roles: 2.4 GHz lane = top card · 5 GHz lane = bottom card · grid = background

narrativeRole: Establishes the first mechanism layer — the router operates on two physical frequency bands with a real tradeoff.
keyMessage: 2.4GHz trades speed for range; 5GHz trades range for speed.

Scene 1 (0.0–2.3s): "Your router broadcasts on two bands" types on top of frame; two empty card outlines split-tilt in from top and bottom edges (mirrored tilt, portrait-stacked), unlabeled.
Scene 2 (2.3–5.7s): on "2.4 gigahertz — travels far, goes slow," the top card reveals its label and a long, slow wave animates stretching across the card's full width; a small pill badge "far · slow" spring-pops beside it.
Scene 3 (5.7–9.493s): on "5 gigahertz — fast, but it doesn't go as far," the bottom card reveals its label and a short, fast wave ripples tightly across the card; a pill badge "fast · shorter range" pops. Both cards hold, settled, side by side top/bottom.

## Frame 4 — Encoding the invisible wave

- scene: A smooth wave line rapidly ripples and reshapes as a stream of 1s and 0s flows out of it
- voiceover: "That wave gets twisted — in amplitude, phase, frequency — thousands of times a second. Each twist carries a bit. That's how a signal in thin air becomes your video call."
- duration: 11.584s
- transition_in: push-slide RIGHT
- status: outline
- src: compositions/frames/04-encoding.html
- type: feature_showcase
- persuasion: Demonstration (show the mechanism running)
- beat: "aha" and fascination
- blueprint: dataviz-countup (Adapt)
- focal: the modulating wave + bit-stream readout
- roles: wave = foreground subject · bit stream (1/0 ticker) = supporting readout · grid = background

Adapt: keep the count-up signature, but what counts up is a rapid 1/0 bit ticker driven by the wave's own distortions, not a static number.

narrativeRole: Reveals the second mechanism layer — how digital bits actually ride on an analog wave.
keyMessage: Data is encoded as rapid, deliberate distortions of the radio wave itself.

Scene 1 (0.0–2.8s): a calm cobalt sine wave spans frame center as the VO says "That wave gets twisted."
Scene 2 (2.8–6.5s): on "in amplitude, phase, frequency," the wave visibly deforms through three named variations in sequence — a bulge (amplitude), a shift (phase), a squeeze (frequency) — each cued exactly to its spoken word.
Scene 3 (6.5–9.3s): on "thousands of times a second. Each twist carries a bit," a bit-stream of 1s and 0s rapidly ticks beneath the wave, a small counter climbing (value-scaled counter) in sync with each visible twist.
Scene 4 (9.3–11.584s): on "that's how a signal in thin air becomes your video call," wave and bit stream settle and hold; subtle jitter only, no further motion.

## Frame 5 — Why walls kill your signal

- scene: A radio wave radiating from a router loses strength crossing a drywall band, then nearly vanishes through a concrete/metal band
- voiceover: "That wave loses energy as it spreads out — and loses more passing through walls. Concrete and metal eat the signal. Drywall barely touches it."
- duration: 9.621s
- transition_in: push-slide RIGHT
- status: outline
- src: compositions/frames/05-attenuation.html
- type: feature_showcase
- persuasion: Causal chain (A → B → C)
- beat: comprehension and recognition
- blueprint: dataviz-countup (Compose — SVG ring expansion rather than a number)
- focal: the expanding, fading wave ring crossing two material bands
- roles: router icon = foreground subject (anchors left/top third) · expanding wave ring = supporting · wall-material bands = background

narrativeRole: Explains the most relatable pain point — why moving one room over kills the connection — via the physics, not folklore.
keyMessage: Signal loss through materials (attenuation) is why walls and distance matter.

Scene 1 (0.0–2.3s): a router icon anchors the upper third; as the VO says "That wave loses energy as it spreads out," a wave ring self-draws and expands outward from it, opacity fading as its radius grows.
Scene 2 (2.3–5.0s): on "and loses more passing through walls," a pale, thin band (drywall) crosses the frame mid-height; the ring passes through it, dimming only slightly on the far side.
Scene 3 (5.0–7.5s): on "Concrete and metal eat the signal," a dense, dark-cobalt band (concrete) appears lower in frame; the same ring crossing it drops to near-zero opacity — a steep, visible cut.
Scene 4 (7.5–9.621s): on "Drywall barely touches it," the two bands hold side by side with their contrasting ring-opacity result visible at once — direct visual proof, settled, no further motion.

## Frame 6 — Interference, not just "weak signal"

- scene: Multiple overlapping wave rings from several nearby devices collide into jittered static, then resolve into a small spinning buffering icon
- voiceover: "And it's not just distance. Your neighbor's router, a microwave, a baby monitor — they all compete for the same frequency. Collisions mean retransmits. That's the real cause of lag."
- duration: 12.587s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-interference.html
- type: social_proof
- persuasion: Counterexample (here is when it breaks)
- beat: recognition and "aha"
- blueprint: overwhelm-surround (Adapt)
- focal: the colliding wave rings
- roles: own router ring = foreground subject (center) · neighboring-device rings = supporting, entering from edges · buffering icon = supporting payoff

Adapt: keep the signature closing-in-from-all-sides accumulation, but it resolves into a labeled collision point rather than an avatar.

narrativeRole: Corrects a common misconception — buffering usually isn't "weak signal," it's spectrum contention.
keyMessage: Shared spectrum means your Wi-Fi fights for airtime with every nearby device on the same band.

Scene 1 (0.0–2.5s): one calm ring (your router) pulses center frame as the VO says "And it's not just distance."
Scene 2 (2.5–6.0s): on "Your neighbor's router, a microwave, a baby monitor," three more labeled icon-rings pop in from the frame's edges, one exactly as each device is named, closing in toward center.
Scene 3 (6.0–9.5s): on "they all compete for the same frequency," all four rings overlap at center and visibly scramble into jittered static at the intersection point.
Scene 4 (9.5–12.587s): on "Collisions mean retransmits. That's the real cause of lag," a small spinning buffering icon pops at the collision point (live SVG internals) and holds, settled.

## Frame 7 — Landing

- scene: A device icon and a router icon settle top/bottom with one calm pulse traveling between them; the thesis line reveals beneath
- voiceover: "So next time it drops — it's not magic failing. It's a radio conversation, bumping into physics."
- duration: 6.677s
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-landing.html
- type: branding
- persuasion: Distillation (compress to one line)
- beat: clarity and satisfaction
- blueprint: titlecard-reveal (Reproduce)
- focal: the device↔router pulse + the thesis line
- roles: device + router icons and connecting pulse = foreground subject · grid = background

narrativeRole: Lands the thesis as a generalizable principle the viewer can carry into any "why is my Wi-Fi bad" moment.
keyMessage: Wi-Fi is a constant radio negotiation bound by the same physical limits as any radio signal.

Scene 1 (0.0–3.0s): on "So next time it drops — it's not magic failing," a device icon and a router icon settle at top and bottom of frame (portrait stack), calm, a single pulse travels once between them.
Scene 2 (3.0–6.677s): on "It's a radio conversation, bumping into physics," the thesis line reveals beneath in the pack's display type with a slide-up crossfade (titlecard signature move), then holds completely still.
