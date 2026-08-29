# Pitfalls

Every entry cost real time at least once. Symptom → cause → fix.

## 1. Tooling

**`tool_search` keeps returning the same cluster; the tool "doesn't exist".**
Cause: a low `limit`. At `limit: 2–4` the ranker starves and returns the same top results
forever. Fix: **always call `tool_search` with `limit: 20`.** If it doesn't surface at 20,
then it's absent. Do not reword the query five times at limit 3 — that was the actual
failure, and each miss dumps the whole schema back into context.

**Generated clips cannot be downloaded from the sandbox.**
`curl` on an S3 asset URL → `403`, `x-deny-reason: host_not_allowed`. The egress allowlist
covers `mcp.maxfusion.ai`, not the bucket. `maxfusion_download_flow_*` doesn't help — it
returns S3 URLs too, and only serves image/video assets anyway.
Consequence: **ask the user to attach each generated MP4** when you need to measure it. Say
this up front so it isn't a surprise. Never assert a clean seam you couldn't measure.

## 2. Canvas

- `update_flow` is a **full replacement** — always send the complete node + edge graph.
- `maxfusion_validate_flow` is free, pure, stateless. It's the arbiter when docs contradict
  each other, and they do. Use it instead of guessing.
- **Docs vs reality:** the flow-builder skill lists only `adItem` / `tiktokItem` /
  `flowGroup` as `contentAnalyzer` sources. That's an *examples list, not an allowlist*. The
  Handle Compatibility table is the contract: `video-out → media-in` and `image-out →
  media-in` both work, so a plain `videoInput`/`imageInput` feeds an analyzer fine. When an
  example list and a type table disagree, trust the type table and confirm with the validator.
- `adItem` **silently drops** `start_frame_filename` / `end_frame_filename` on save.

## 3. Content analyzer

- **The default master prompts are excellent — don't rewrite them.** Send `""` for both and
  the backend hydrates forensic transcribers with a banned-adjective list and a hard
  no-fabrication rule.
- They're only discoverable by sending `""` and reading the save response back.
- **Override only for a transcript.** The default video prompt buries the voiceover inside a
  per-beat field. For a clean timestamped script:

```
Transcribe the spoken audio of this video verbatim. Output ONLY the transcript.
Format: one line per utterance, prefixed with the start timestamp as [MM:SS.mmm].
Preserve filler words, false starts, stutters and repetitions exactly as spoken.
Transcribe any burned-in on-screen text on its own line, prefixed with [TEXT MM:SS].
Do NOT summarize. Do NOT interpret. Do NOT describe visuals, camera work, editing or
pacing. Do NOT comment on ad structure, hook, angle or CTA. Do NOT add preamble.
If there is no speech, output exactly: NO SPEECH
```
The "do not analyze" clauses matter — a multimodal model handed an ad will editorialize
unless fenced hard.

- Analyzer text lives **only** at `runtime_state.node_outputs[node][0].items[].analysis_text`
  (via `maxfusion_get_flow`). `download_flow_node_outputs` → `FLOW_NODE_OUTPUTS_NOT_FOUND`.
  Note `get_flow` drags the full canvas back, including ~6k tokens of master prompt per
  analyzer node. Budget for it; poll sparingly.

## 4. Research data

- **`days_running` is age, not runtime.** A dead 2022 ad reports a huge number. Check
  `raw.is_active`.
- There's no "longest running" sort. Use `started_before` (~2 years back) — still-active ads
  that started long ago *are* the survivors.
- TikTok `count` has an **enum floor of 10**. You cannot request 5.
- **Rank organic by save rate, not views.** A 4.8% save rate means people are bookmarking a
  way out. That's the emotional target.

## 5. Video models

Verified against `maxfusion_list_video_models`:

| model | durations | speech | modes |
|---|---|---|---|
| `gemini-omni-flash` | 3–10 | **yes** | `ingredients` **only** |
| `seedance-2.0` | 4–15 | not advertised | `frames` + `ingredients` |
| `veo-3.1` | **4, 6, 8** | no | `frames` + `ingredients` |
| `sora-2-pro` | **4, 8, 12, 16, 20** | — | `ingredients` |
| `kling-3.0-pro` | 3–15 | — | `frames` |

- **Omni is the only model that talks AND does 10s.** That's why it's locked.
- Omni has **no `frames` mode** → no `start_frame_file_id`. Wiring `end-image-out →
  start-frame-in` into an Omni `videoGenerator` fails with `frame_input_unsupported`.
  Confirmed against the validator, not assumed.
- Veo and Sora cannot do 10s. Don't plan around them for this format.

## 6. Chaining & trimming

**The frozen opening frame is a feature.** Omni holds its ingredient for ~8–10 frames, then
hard-cuts into the generated scene (interframe delta spikes ~50/255 at the boundary). Seed
it with clip 1's last frame and that becomes an invisible join. Measured on a real run:
first-frame difference **3.21/255**, head-delta spike gone (max 3.55 vs 51.5 before).

**Trim clip 1 BEFORE extracting the seed.** This is the ordering bug that will bite you.
Clip 1 has dead air too (1.2s on a real run). Trim it afterwards and clip 2 is chained to a
frame that no longer exists in the final cut — the measured seam degraded from 3.31 to 8.53
doing exactly this. `scripts/adkit.py seed` enforces the correct order.

**Never hardcode trim points.** They're data. On one clip the artifact ended at 0.375s and
speech began at 0.560s — a 0.185s window. Reusing that number on another clip decapitates
the first word. Measure the RMS envelope every time; `adkit.py` does.

**Never trim a chained clip 2's head.** Those held frames *are* the seam.

**`trimMedia` is a tools node — it must RUN to exist.**
Symptom: a clip is wired to the video editor but doesn't appear in the editor's input list
at all. Cause: `trimMedia` doesn't *hold* media, it *produces* it by executing. Until it
runs it has no `video-out`, so the editor has nothing to place. `imageInput`/`videoInput`
show up because they carry an S3 asset directly. Tell: `runtime_state.node_statuses` is `{}`.
Fix: **trim locally before upload and wire a plain `videoInput`.** Zero credits, appears
instantly.

## 7. Video editor

**Dragging a layer in the UI resets its `order` and `transform` to defaults.** Observed: a
clip came back at `order: 0` — *below* the full-bleed background, therefore invisible — with
its transform reset to a centre-fit that ignored the placeholder entirely. Author the
composition by PATCH and don't drag. If it looks wrong after a drag, re-PATCH.

**Butt-join on the backend's `durationSeconds`**, not on rounded numbers. `clip2.start` must
equal `clip1.end` exactly. A 5 ms gap is a one-frame black flash.

**There is no crop, no volume, no transitions.** A composition is a plain cut of stacked,
timed rectangles (`x/y/width/height`, `order`, `timing`). So fit-to-aspect rather than fill —
a 6% horizontal stretch on a face is visible, a few px of border is not. `template_spec.json`
already has the fitted rects.

## 8. If the render backend is down

`adkit.py finish` renders the whole composite locally with ffmpeg from the same numbers. The
deliverable is never blocked by a platform outage. Keep the canvas saved and diff against the
local render when the backend returns.

---

## 9. Failures found in production (added after a full three-ad run)

**Writing scripts off metadata.**
Symptom: research feels done, the thesis is sharp, the transcripts later contradict it. Cause:
skipping the canvas teardown and reasoning from ad copy, page names and engagement counts. Those
support a confident, plausible, *wrong* story. Fix: **the script step consumes `analysis_text`.
No analyzer output, no script.** See the HARD GATE in SKILL.md step 4.

**Meta keyword search matches ad COPY, not category.**
Symptom: you search the obvious category term and get supplements, mattresses and political ads.
Cause: full-text match across ad copy and page names — so the category word finds everyone who
*mentions* the problem, which is DTC supplement copy, not app copy. Fix: query feature nouns, not
problem nouns; 2–3 words; check `page_name`/`page_categories` hit rate before importing; dedupe by
`page_id` (the same advertiser ships the same ad under a second name and language).

**The hook is not the pitch.**
Symptom: a confident thesis about what competitors sell, which the transcripts contradict. Cause:
reading `body.text` (the *product*) instead of the first three seconds (the *hook*). Observed:
every paid ad sold measurement in the body while three of five opened on a prohibition. Fix:
extract the first-beat VO separately and compare hooks to hooks.

**The actor comes out plastic.**
Symptom: evenly-poreless skin, stamped pore overlay, "rendered" not "captured". Cause: wrong
model. Four rounds of prompt tuning on `nanobanana-pro` failed; `gpt-image-2` fixed it first try
with the same prompt. Fix: **change the model before you change the prompt.** The skill names
`gpt-image-2` — that is not a suggestion.

**`banana_clone` makes things worse the harder you push.**
Symptom: you add cant/grade/texture instructions and the output degrades. Cause: it
reverse-prompts the source into text **you never see**, then blends yours into it. Two prompts
fight, one invisible. Fix: never use it for casting. `generate_image` + your own prompt = one
prompt you can read.

**Passing the photo in `references` clones the real person.**
Symptom: the output is a 1:1 likeness of the human in the reference photo. Cause: `references` is
an image-conditioning input, not a style hint. Fix: casting is **text-to-image**. The photo is a
brief you read with your eyes. `references` is only for when the user explicitly needs that face.

**"The light changes mid-video."**
Not a bug. Omni holds the reference still for ~8–10 frames then dissolves into the generated
scene. A daylit still + a prompted dark room means **the dissolve IS the light change**. Fix:
prompt the scene the still is already lit for, or generate the still in the target light, and lock
it: *"this light is identical in the first frame and the last frame."*

**Omni ignores the seed frame (seam 33/255 instead of 3).**
Cause: clip 2's prompt re-described the face, crop, camera geometry and background — all of which
are already in the seed pixels. A text-only route to a face is a route Omni takes. Fix: make the
reference frame the **premise**, delete every visual fact it already carries, and write only
voice/delivery/beats. 33.07 → 3.57 on the identical script.

**Omni quietly straightens an unusual camera angle.**
Symptom: a canted low selfie drifts to a centred level talking head by second six. Cause: Omni's
prior is a normal talking head. Fix: state positively what **stays true** for all ten seconds; a
prohibition ("don't lift the phone") renders the thing you named.

**Accent drift.**
"A natural young-adult American voice" came back Australian, twice. Naming the country again did
not fix it. Fix: **mechanics** — rhoticity (the actual discriminator), vowel shape, terminal
pitch, and a **city** not a country. Fallback: TTS + `rizz`/`omnihuman-1.5`, accent by
construction.

**The delivery is technically perfect and still reads as a robot.**
Cause: disfluencies were *choreographed* ("creak on the word 'day'", "inhale at 00:03"). Omni
performs cues. Fix: give the **state**, not the choreography, and put **no emotion words** in the
delivery block. See `references/delivery.md`.

**Safety block on an otherwise clean prompt.**
An explicit child's age near "bedtime story" over a close-up face trips a classifier — reasonably.
Fix: the child was never load-bearing. *"like I'm stupid"* carries more contempt than *"like I'm
four"* and does not trip anything. Do not argue with the filter; find the line that was doing the
work.

**Asserting instead of looking.**
Symptom: the operator says "wrong", you produce a second, *more confident* wrong answer. Cause:
re-reasoning instead of re-observing. Fix: **crop, enlarge, and `view` the image.** When corrected,
re-open the file — do not re-argue. And change **one variable at a time**: a "too much crying" note
answered with a whole-paragraph rewrite produced *zero* crying.
