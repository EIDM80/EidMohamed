# Omni beat-prompting

How to write the `gemini-omni-flash` prompt so the ad lands, and how to vary the visual lane
so a batch doesn't look like one ad five times.

## Locked structure

```
[1. Identity / continuity block]
[2. Delivery + pacing block]
[3. Style-world paragraph]

The video follows this exact timeline, beat for beat:

**[00:00–00:0X]** The speaker says: "<exact phrase>" — [what is ON SCREEN during this phrase.
Anchor every visual event to an exact spoken word: "Exactly on the word X, …"]

…one block per phrase, no gaps…

[4. Closing paragraph: the thread carried from first frame to last]
```

### 1. Identity / continuity

**Clip 1** (seeded from the actor still):
> "The young woman in the reference image is the speaker: her face, bone structure, skin
> texture, and hair stay exactly as in the reference image from the first frame to the last."

**Clip 2** (seeded from clip 1's trimmed last frame) — this exact framing produces the seam:
> "The reference image is the exact first frame of this video. The video opens on precisely
> that frame — the same face, the same lighting, the same framing, the same head position —
> and motion continues forward from that instant, as one unbroken continuation of a shot
> already in progress."

### 2. Delivery + pacing

This is where the user's chosen tone gets encoded. It changes the performance, so write it in
concrete physical terms, not as an adjective.

| tone | write it as |
|---|---|
| yapping / fast | "speaking quickly and without pauses, words tumbling over each other, barely breathing between sentences, like she's venting to a friend who already agrees" |
| agitated / fed up | "clipped, tense delivery, jaw tight, biting off the ends of words, the pace speeding up as she gets more wound up" |
| excited / hyped | "bright, fast, rising intonation, leaning into the lens, half-laughing through the words" |
| calm, honest, direct | "slow and level, unhurried, small pauses between phrases, looking straight down the lens like she's telling you something true" |

Always also name the voice: age-appropriate, accent, register.
*e.g. "a natural young-adult American voice — flat, tired, faintly stunned."*

### 3. Positive language only

**Never write a negation inside a generation prompt.** No "no captions", "avoid text",
"don't show" — the model latches onto the noun and renders it. State a clean frame positively:

> "The frame stays purely visual throughout — the speaker, her environment, and wordless
> illustrated graphics are the only things on screen."

### 4. Keep text out of the frame

Omni hallucinates garbled lettering onto anything that looks like it should carry text. Do
the work with **illustration, background, light and motion graphics** instead. If an element
would naturally carry numerals (clock, phone screen, UI panel), describe it *without* them —
"a clock face with a single sweeping hand", never "a clock reading 9:00".

### 5. Anchor every event to an exact word

> "Exactly on the word **willpower**, a heavy hand-drawn barbell presses down into frame
> above her head, its chalk lines buckling, then snapping clean in half."

The key word — product name, mechanism, emotional peak — gets the **biggest** event: a
crash-zoom, a detonation, a total colour flip.

> **⚠ SUPERSEDED IN PART — read the Addenda at the end of this file before using this.** The
> **product name must get the SMALLEST event**, never the biggest. The emotional peak takes the
> big one.

### 6. The final beat always says how it ends

Hold, slow push, lock. Otherwise the model drifts and leaves dead air.

---

## The four visual lanes

Pick one per ad. **Varying the lane across the batch is the diversity axis** — it's what makes
two ads look like different creative rather than one ad revoiced.

### A — Hand-drawn illustration
Thin white marker-line 2D drawings floating around the speaker, "like sketches on a pane of
glass". They multiply, crumble to ash, dissolve. Suits overwhelm/anxiety pain.
> *"a dense swarm of small hand-drawn app icons and notification bubbles blooms outward from
> behind her head in a slow silent cloud, thin white marker lines multiplying until they crowd
> the space around her hair."*

### B — Bold solid colour + arrows
One flat saturated colour per phrase; **hard-cut the whole background** on each key point. Big
drawn arrows point at her face, at the thing she's naming. High energy, native to the feed.
> *"On 'but' the entire frame hard-cuts to a flat electric-blue background, and a thick
> hand-drawn red arrow snaps into frame pointing directly at her face."*

### C — Motion graphics
Shapes, rings, bars, particles, speed lines, halftone bursts — elements that *animate*: a
ring expanding from her chest, a bar draining, envelopes raining, a shockwave on the key word.
> *"a single soft ring of warm golden light expands slowly outward from the centre of her
> chest, washing the cold blue off her skin as it passes over her."*

### D — Environment & light
No graphics at all. The arc is carried entirely by the **room and the light**: cold blue
phone-glow and dark for the pain, warm daylight flooding in on the solution. Quietest, most
"real". Pairs with a calm, honest delivery.

**Mixing:** one dominant lane, at most one accent from another. Two lanes fighting in one 10s
clip reads as noise.

---

## Design the two clips as one arc

Clip 2 is seeded from clip 1's final frame, so **clip 1's ending state IS clip 2's opening
state.**

- Clip 1 ends in the pain state — dark, cold, cluttered, loud.
- Clip 2 opens in exactly that state and **turns** — light floods, clutter dissolves, colour
  returns, the frame empties.

Write clip 1's final beat knowing it's the seed. A clean, centred, well-lit final frame chains
well. A motion-blurred or mid-blink final frame chains badly.

---

## Addenda from production

### The delivery block is the whole ballgame — see `references/delivery.md`

Two rules, and they override any tone adjective:

**Give the STATE, never the choreography.** "Creak on the word *day*" is a cue, and Omni performs
cues — you get an actor doing a stumble. "She runs out of air toward the end of a phrase, so her
voice sags into a creak on its own, without her intending it" is a condition, and conditions get
inhabited.

**No emotion words in the delivery block.** This file's tone table is a starting point, not the
delivery. "She is fed up" hands her an emotion to play. Write the body: jaw tighter than it needs
to be, words crowding, more push behind the breath than the volume needs.

### The VOICE BLOCK is written once and pasted verbatim into both clips

Rewriting it between clips is how the actor changes person mid-ad. It must name: a **city** (not a
country), **rhoticity** (*"fully rhotic — she lands the R at the end of 'there' and 'years'"* — the
actual American/Australian discriminator), **vowel shape**, **terminal pitch direction**, volume
and register. A flat request for "a natural young-adult American voice" came back **Australian,
twice**.

### The key word is the emotional peak — NEVER the product name

This corrects the rule above. The brand name gets the **smallest** event, not the biggest: it is
the one word that can out the whole thing as an ad. Throw it away mid-sentence, unstressed, with a
shrug. Put the big event on the honest beat instead.

### Clip 2: do not re-describe what is already in the seed frame

Re-specifying the face, crop, camera geometry or background in clip 2's prompt gives Omni a
text-only route to a face, and it takes it — the ingredient is ignored and the seam fails
(**33/255** observed, against a gate of 5). Make the reference frame the **premise**, state once
that every visual fact carries on unchanged from it, and then write **nothing but** voice,
delivery and beats. That change alone took the seam to **3.57**.

### Hold an unusual framing positively

Omni's prior is a centred, level talking head, and over ten seconds it will quietly "fix" a canted
or low-angle shot. Write what **stays true** for the whole clip — *"the frame stays canted, the
underside of her nose stays visible for all ten seconds, she keeps the phone where it is because
she cannot be bothered to lift it"* — never a prohibition. Negations render the thing you named.

### The speech may trail off. The camera never does.

A humanized script ends on an unresolved half-thought — that is the script's job. The **prompt's**
final beat must still say how the shot lands (hold, lock, stop), or Omni hears an unfinished
sentence and invents an ending. That beat is also the seed frame, so it must be clean: still, eyes
open, mouth closed, camera locked.

### Lane zero — no graphics — is a legitimate and often better default

Her face, the room, the light. Offered the choice between a motion-graphics take and a plain one,
the operator killed the graphics: *"I don't want any effects. Just the talk to the camera, because
it's so good."* The graphics were the only thing making an honest performance read as advertising.
When you are in lane zero, the diversity axis across the batch is **the angle and the pain**, not
the decoration — which is the axis that matters anyway.
