# Arcads mechanics & hard-won gotchas

The Arcads MCP tools work, but several non-obvious behaviours will waste time/credits if you don't
know them. All learned producing Episode 01 **on one macOS machine with one MCP setup** — so a few of
these are environment-dependent (where the MCP runs, your ffmpeg build, which tools your client
exposes). Each such item says how to check for *your* setup rather than assuming. Verify, don't cargo-cult.

## Getting a local face/voice/plate into a reference — depends on WHERE the MCP runs
`referenceImages` / `referenceAudios` accept **local paths, HTTP/HTTPS URLs, and S3 paths** (current
schemas; several tools auto-upload local paths and URLs). *Which* of those actually reaches the model
depends on where the Arcads MCP process runs relative to your files — determine this first, it decides
the whole upload dance:

- **MCP runs locally (same machine as your files):** just pass the **local path** (or a public URL).
  Nothing else needed — skip the presigned ritual below.
- **MCP runs remotely / hosted (can't see your disk):** pass a **public HTTP/HTTPS URL** (the tools
  fetch it), or use **`arcads_upload_media`** for a URL-fetchable file, or — for a purely local file
  with no URL — use the presigned upload:
  1. `arcads_get_upload_url({mimeType})` → `presignedUrl` + `filePath` (an S3 key).
  2. HTTP `PUT` the raw bytes to `presignedUrl` (curl `-T`, header `Content-Type: <mime>`). Watch for
     stray spaces in the long signed URL — a space → curl code `000`.
  3. Pass the returned `filePath` in `referenceImages` / `referenceAudios`.

**Observed gotcha (Episode 01 — verify, may be fixed server-side):** the presigned temp path behaved as
**single-use** — firing two parallel gens with the same temp path failed the 2nd with
`INVALID_REFERENCE_IMAGES`, and `arcads_register_image` assetIds were rejected by `referenceImages/Audios`
(only live temp paths worked). If you hit that, re-upload the face/voice/plate per call (batch: N
`get_upload_url` → N PUTs → N gens; 7 scenes × 3 refs = 21 uploads). **If a single upload now serves
several parallel calls in your setup, this workaround is obsolete — don't cargo-cult it.**

## Image gen — nano-banana-2
`arcads_generate_image_nano_banana({model:'nano-banana-2', aspectRatio:'16:9', nbGenerations, prompt,
referenceImages})`. `nano-banana-2` supports up to 14 reference images; ~1 min; returns pending asset
ids (product auto-selected). Use for character sheets & location plates.

## Character sheet method (identity that Seedance won't drift)
- **ONE clean front-facing photo only.** Multiple photos (different angle/light) CONFUSE the model —
  resemblance gets worse. Straighten iPhone HEICs first (pixels may be stored rotated, EXIF orientation
  often `<nil>` → rotate 90° and verify visually).
- **2-panel layout:** LEFT = a sharp front-facing face close-up matching the photo exactly (say "do NOT
  beautify, slim, or idealize"); RIGHT = full-body front + back views with the person's real hair kept,
  but the **face covered by a plain flat circle** on the front view (hide the small low-res face so the
  model reads identity only from the left panel; the back view shows the back of the head normally).
- Neutral mid-gray studio, even lighting, **no color grading, no mood, no props, no makeup.**
- Generate `nbGenerations: 5`; build a montage next to the reference photo; **let the user pick** the
  best likeness. Crop the LEFT face close-up → that crop is the identity reference for all shots.

## Video gen — Seedance 2.5
`arcads_generate_video_seedance_25({prompt, aspectRatio:'16:9', resolution, duration, audioEnabled:true,
referenceImages, referenceAudios})`.
- **Duration up to 30s** single clip (the only model that long). `resolution` scales cost hard:
  `480p` (~150 cr — cheapest/fastest, **iterate here**), `720p` (~1,160–1,250 cr for 28–30s; + upscale to
  1080p for a much cheaper final), `1080p` (**≈ 2,900–3,120 cr for 28–30s, ~11 min render** — schema notes
  1080p ≈ 2.5× 720p). See SKILL.md §Cost & resolution before committing to a final res.
- `referenceImages` up to 9 — pass **[face-crop, location-plate]** (subject + scene). `referenceAudios`
  up to 3, **≤~30s combined** — pass the **≤24s voice clip**; the actor then speaks the PROMPT's quoted
  dialogue in that voice (it does NOT lip-sync the sample's words). Delivery can be a touch stiff; the
  model's own native voice is more natural but not the user's — user's call.
- Timecoded multi-beat prompts work (2–3 beats per clip). Repeat the full character description each beat.
- **Fire all scenes in parallel** (one message, many calls) → wall-clock ≈ one clip's render, not the sum.
- **Failures are auto-refunded.** Two real false-positives: (a) pure architectural b-roll of a famous
  monument (Karnak) → "potential copyright violation" — reword to a generic temple / avoid the iconic
  monument / use image-to-video from your own plate; (b) the face reference occasionally trips
  "likenesses of real people" — just re-fire (probabilistic).

## Polling results
`arcads_get_asset({assetId})` → `status` (`pending`→`generated`/`failed`) and, when generated,
`downloadUrl`. **Use `arcads_get_asset` to poll.** If an `arcads_watch_asset` tool exists in your setup
it's **widget-only — don't call it** (in some setups it isn't exposed at all). To wait: fire a background
`sleep` (`run_in_background`) sized to the render (~11 min for 1080p/28s) and poll on wake; re-sleep if
still pending (occasionally a clip sits in a slow queue ~15+ min — say so honestly, or deliver the ready
pieces and swap the straggler in later).

## Voice tools (if unifying instead of attaching)
`arcads_list_voices`, `arcads_text_to_speech`, `arcads_change_voice`, `arcads_speech_to_speech` all take
a **workspace `voiceId`** (stock or a pre-existing clone) — they do NOT clone a fresh voice from a file.
So "use my voice" = either a workspace clone's voiceId, or (what worked) attach the sample via Seedance
`referenceAudios`.

## Assembly (ffmpeg)
- **Fact-cards — check your ffmpeg build FIRST:** `ffmpeg -hide_banner -filters | grep drawtext`. If
  present, render cards with `drawtext` directly. **If absent** (some builds ship without it — the one
  used for Episode 01 did), fall back to **PIL** (dark scrim over a location plate + centered serif
  text), then `ffmpeg -loop 1 -i card.png ... -t 3.6` per card. Don't assume either way.
- **Long re-encodes can exceed a foreground command timeout** (e.g. Claude Code's default ~2-min shell
  limit) → normalize with a fast preset (`-preset veryfast -crf 20`) and run the whole assembly as a
  **background job**.
- Concat: normalize every piece to identical spec — `scale=1920:1080,setsar=1,fps=30,format=yuv420p`,
  `-c:v libx264 -c:a aac -ar 48000 -ac 2 -b:a 192k` — then `ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4`
  (copy-concat is instant once pieces match).
- Review clips by extracting a filmstrip: `ffmpeg -i clip.mp4 -vf "fps=N/DUR,scale=320:-1,tile=4x3" -frames:v 1 strip.jpg`.
- Deliver: keep the finished mp4 alone in a `00_FINAL_VIDEO/` folder and give the absolute path. To open
  it, use the OS opener — `open FILE` (macOS), `xdg-open FILE` (Linux), `start FILE` (Windows).
