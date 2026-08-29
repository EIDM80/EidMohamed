---
name: ai-history-vlog
description: "Produce a 'Chloe vs History'-style AI history vlog end-to-end via the Arcads MCP — a first-person time-traveller who explores a real historical era, talks to locals, and teaches history, in the user's own face and voice. Use when the user wants to make a history vlog / time-travel documentary / 'I time-travelled to X' episode, recreate the Chloe vs History format, or turn a face + voice + a historical topic into a finished ~3-minute HD episode. Covers research → story/script → character sheet → location plates → Seedance 2.5 shots (face + voice attached) → assembly with fact cards. Requires the arcads MCP tools (the `arcads_*` tool family; the exact prefix — e.g. `mcp__arcads__` or `arcads:` — depends on how the MCP is registered in your client). Do NOT use for generic single video clips (use the video tools directly) or for non-Arcads pipelines."
---

# AI History Vlog (Arcads)

Turn **a face photo + a voice sample + a historical topic** into a finished ~3-minute
first-person history documentary — the *Chloe vs History* format: one host time-travels into a real
era, explores it, talks to locals, and teaches genuinely surprising history, all in the user's own
face and (optionally) voice. Iterate everything cheaply at **480p**, then render the final at 720p or
1080p — video is the biggest line item, so decide with eyes open (see **Cost & resolution** below).

This skill is the playbook. Read `references/arcads-mechanics.md` before generating (the Arcads
upload flow has hard gotchas), and hand the user `references/voice-sample-script.md` to record their
voice.

> ⭐️ **The script is the product.** Everything else is table stakes; interesting storytelling is what
> makes an episode go viral vs. get scrolled past. Before writing a single scene, read
> **`references/scriptcraft.md`** and write to that bar — the single biggest lever on quality. Do not
> generate until the script genuinely rips and the user has signed off.

---

## What the user provides (the only inputs)

1. **Face** — one clean, front-facing, high-res photo (neutral expression, even light, no
   sunglasses/hat). Straighten it first (phone HEICs often store pixels rotated with no EXIF flag).
2. **Voice** — a 20–30s clean speech clip. **Give them `references/voice-sample-script.md` to read.**
   Trim to ≤24s before use (Seedance's reference-audio is capped ~30s). Optional — if skipped, use a
   natural Arcads stock voice or Seedance's native per-clip voice.
3. **History topic** — the era/event. If they don't have one, **research and recommend** (Claude does
   the history; see Step 1). Score candidates on: visual spectacle, ticking-clock drama, a meetable
   figure, dramatic irony, fish-out-of-water, search demand, costume arc.
4. **Length** — default **~3 min = 7 continuous ~28s takes**. Shorter = fewer takes.
5. **B-roll — with or without** — a FEW (0–2) short cinematic cutaways, and they must *teach* (a
   bustling market = the economy; a painted temple hall = "it was all colour and gold"), not be
   filler. Generate as **image-to-video from your own location plates** with "smooth stabilized
   drone/crane, no shake" (also dodges the copyright filter that kills pure-monument text-to-video).

## The non-negotiable style (why it reads as this genre)

- **Selfie-vlog POV**: wide-angle front camera, mild barrel distortion, arm extended, handheld sway.
- **16:9**, ambient-diegetic audio only (no music), documentary tone: natural light, film grain,
  real skin texture, living-moment staging.
- **The script is king.** Teaching-first, immersive first-person. Dialogue must sound like a real
  person reacting in the moment — fragments, interruptions, real surprise. **Ban AI tells:** no
  "here's the crazy part," no "basically," no "the richest city on Earth" hyperbole openers, no tidy
  symmetrical sentences. Facts land as things he's *realizing*, not stating. One awe beat, one
  micro-joke, natural local interactions (a vendor, a baker, a scribe — they act/speak a beat, he
  reacts). Close on a **dramatic-irony** line + white **fact-cards**.

## Pipeline

**Step 1 — Research & story (THE make-or-break step — see `references/scriptcraft.md`).** Research the
era for what's genuinely surprising and *corrects the myth* (temples painted & gilded, not bare stone;
no coins — paid in bread & beer). Mine it for the 5 story ingredients (myth-corrections, the one human
at the center, the dramatic irony, 3–5 shareable "wait, WHAT?" facts cross-checked vs. 2 sources, the
sensory texture). Then write a scene-by-scene script (7 × ~28s) built on the 6 laws of scriptcraft: one
spine question, a hook that drops mid-reaction, teach-through-friction, the surprising beats, an
emotional wave, and a dramatic-irony close — in a real messy human voice (ban the AI tells). Read it
aloud; if any line sounds like a narrator, cut it. **Do NOT generate until it rips and the user signs off.**

**Step 2 — Character sheet (identity lock).** See `references/arcads-mechanics.md` §character-sheet.
One front photo → 2-panel sheet (accurate face close-up left; full-body front/back with the FACE
covered by a flat circle, hair kept, right), neutral gray studio, no makeup/mood/props. Generate 5
variants (`nano-banana-2`), user picks the best likeness. Crop the left face close-up = the identity
reference for every shot.

**Step 3 — Location plates.** One `nano-banana-2` image per environment (16:9). Myth-corrected,
period-accurate, no modern elements. These become both the video scene reference AND the b-roll source.

**Step 4 — Shots (parallel).** For each scene, fire `arcads_generate_video_seedance_25`:
`referenceImages = [face-crop, location-plate]`, `referenceAudios = [voice ≤24s]` (for the user's
voice), `duration: 28`, `aspectRatio: 16:9`, `audioEnabled: true`, and the natural dialogue in the
prompt. **Resolution is a ladder, not a constant:** iterate at **`480p`** (cheap/fast) until the setup —
face-lock, framing, dialogue, no anachronisms — actually works, THEN re-fire the locked prompts at the
final resolution (`720p`, or `1080p` if the budget's approved — see **Cost & resolution**). **Fire all
scenes at once** (one message, many calls) → wall-clock ≈ one clip's render, not the sum (~11 min at 1080p).

**Step 5 — Review & targeted fixes.** Download each clip, build a filmstrip (`ffmpeg fps+tile`), view
for face-lock + issues; open the mp4 so the user can hear the voice. Fix issues **one scene at a time**
(re-roll just that shot with a corrected prompt, then swap it in). See the issue checklist below.

**Step 6 — Assemble.** Normalize all clips + b-roll to one spec and concat; add fact-cards at the end.
See `references/arcads-mechanics.md` §assembly — run long re-encodes as a **background job**, and render
fact-cards with ffmpeg `drawtext` **if your build has it**, else fall back to **PIL** (check first — some
ffmpeg builds ship without `drawtext`; don't assume either way).

**Step 7 — Organize & deliver.** Keep the finished file alone in a clearly named folder and give the
exact absolute path. Offer to open it with the OS opener — `open` (macOS), `xdg-open` (Linux), `start`
(Windows); don't assume macOS.

## Per-scene issue checklist (what to watch for on review, and the fix)

- **Anachronisms** (sunglasses, tomatoes, modern items) → "empty hands, no modern objects."
- **Makeup / heavy kohl reads feminine** → "natural bare face, NO makeup, NO eyeliner, NO kohl."
- **Objects merging** (fish sunk into grain) → "separate stalls; X is NOT mixed into Y."
- **Empty throne / missing figure** → "a SMALL BOY clearly seated on the throne, NOT empty."
- **Crowd morphing / facing wrong way** → "crowd stays kneeling, no one appears/disappears; all bow
  FACING INWARD toward the king." (Facing direction is only partly controllable — flag honestly.)
- **Eyeline drifting** → "keeps his eyes ON the [subject], following it with his gaze."
- **Weird background audio** → re-roll; "clean natural ambient only, no strange/distorted sounds."
- **CG / video-game vista** → use a **grounded, eye-level plate** (rooftop parapet + foreground props)
  and "photoreal, real lens, NOT a CG render, NOT a sweeping aerial vista."
- **Content-policy fail** (refunded): pure famous-monument b-roll or a face-likeness false-positive →
  reword to generic subject / just re-fire.

## Recommended per-episode folder structure
Create a fresh folder per episode (named for the topic) with: `00_FINAL_VIDEO/` (the finished file,
alone), `01_scenes/` (per-scene clips), `02_scripts/` (script + prompts), `03_source-assets/` (face,
voice, character sheet, location plates). Keep a short `START_HERE.md` at the root noting the topic, the
locked character-sheet variant, and the voice file. (This structure is a suggestion, not a dependency —
the skill needs no pre-existing files on disk.)

## Cost & resolution (run this BEFORE firing the shots)
Video is by far the biggest line item and scales hard with resolution. Ballpark for a 7-scene, ~3-min
episode of Seedance 2.5 (28–30s clips), *before* character sheets / plates / b-roll and re-rolls:

| Resolution | ~Credits/clip (28–30s) | 7 scenes | Notes |
|---|---|---|---|
| 480p | ~150 | ~1,050 | **iterate here** — validate every setup |
| 720p | ~1,160–1,250 | ~8,100–8,750 | + upscale to 1080p ≈ this total; ~2.5× cheaper than native 1080p |
| 1080p | ~2,900–3,120 | ~20,300–21,840 | native final |

Re-rolls are the rule, not the exception (the per-scene checklist above lists 9 common failure modes) —
**budget 1.3–1.5×**, so a finished native-1080p episode is realistically **~26,000–33,000 credits**.
So: (1) do ALL iteration at 480p; (2) decide **720p + upscale** (much cheaper) vs **native 1080p** with
the user — in credits *and* their own EUR/credit rate; (3) only then render the final. Never silently
default to 1080p — put the number in front of the user first.
