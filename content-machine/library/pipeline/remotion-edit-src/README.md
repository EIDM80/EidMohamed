# Remotion editing pipeline — durable backup (rebuilt 2026-08-30)

The live pipeline lives at `/tmp/.../scratchpad/remotion-edit` (session
scratchpad), which does **not** survive a container/session restart. It was
wiped once already (around 2026-08-28), causing a ~3 day outage across all
four platform-posting automations while the queue files and pipeline were
unrecoverable. This directory is a full source backup so a rebuild after any
future wipe is a restore, not a from-scratch re-engineering job.

## What this is

Everything needed to reconstruct the scratchpad `remotion-edit/` project
except `node_modules/` (reinstall via `npm install`) and the music asset
(separately backed up at `content-machine/library/assets/audio/bg-music-corporate-v1.mp3`,
restore instructions in that directory's own README).

- `package.json`, `tsconfig.json` — Remotion 4.0.286 + React 18.3.1 project config.
- `src/index.ts`, `src/Root.tsx` — registers the `AdSceneDynamic` composition
  (1080x1920, 30fps, `calculateMetadata` derives duration from the
  `clipFrames` prop + `ENDCARD_FRAMES`).
- `src/scenes/AdScene.tsx` — the composition itself: video + grade/vignette/
  grain/captions, background music bed, then a branded end card sequence.
- `src/components/Captions.tsx` — word-synced caption pages (`WordTiming`,
  `buildCaptionPages`). **Known subtle bug fixed here**: inside a nested
  `<Sequence from={page.from}>`, `useCurrentFrame()` already returns the
  frame *relative to that sequence's start* — do not subtract `page.from`
  again, or every opacity/pop interpolation clamps to its start value and
  captions render fully transparent (this exact bug shipped once during the
  rebuild and was caught by rendering a still frame and inspecting it).
- `src/components/Layers.tsx` — `Grade`, `Vignette`, `Grain` overlays.
- `src/components/EndCard.tsx` — "ISO Order Portal" branded outro with a
  pulsing `isoorder.com` CTA.
- `word_timing.py` — heuristic word-level timing. **There is no ASR/forced-
  alignment tool available in this environment**, so timing is derived by
  detecting speech-vs-silence regions in the narration audio (short-time RMS
  energy via numpy) and distributing the given script's words proportionally
  (by character count) across the detected speech time. This is an
  approximation, not true forced alignment — if a real transcription/
  alignment tool ever becomes available, swap this module out for it.
- `edit_and_push.py` — orchestration script, same CLI contract as before:
  `edit_and_push.py <name> <video_url> <spoken_text> <lang>`. Downloads the
  source video, extracts audio, computes word timings, renders via
  `npx remotion render`, copies the output into
  `iso-cert-portal/public/marketing/ads/video/ig/remotion-edit/<name>-remotion.mp4`
  in this repo, commits and pushes (self-healing fetch+reset+recommit retry
  on a concurrent-push rejection), and prints `RAW_URL=<raw.githubusercontent.com url>`.
  Invoke via `uv run --with opencv-python-headless --with numpy --with imageio-ffmpeg python3 edit_and_push.py ...`.
  Uses `/home/user/EidMohamed` as the git working copy (confirmed push access
  in this session) rather than the original `/workspace/eidmohamed` path,
  which does not exist in this container.

## To restore after a future pipeline wipe

1. `mkdir -p <scratchpad>/remotion-edit && cd <scratchpad>/remotion-edit`
2. Copy everything from this directory in: `cp -r <this-dir>/* <this-dir>/.[!.]* <scratchpad>/remotion-edit/` (or just re-copy `package.json`, `tsconfig.json`, `src/`, `word_timing.py`, `edit_and_push.py`).
3. `npm install`
4. Restore the music bed: `mkdir -p public/music && cp content-machine/library/assets/audio/bg-music-corporate-v1.mp3 public/music/bg-music.mp3`
5. Confirm the headless browser path still exists: `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` (pre-installed in this environment; if missing, check `PLAYWRIGHT_BROWSERS_PATH`).
6. Confirm `ffmpeg` is available: `python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"` — `pip install imageio-ffmpeg` if the import fails.
7. Test with one video end-to-end before resuming any live queue firing —
   render a still frame mid-clip (`npx remotion still ... --frame=N`) and
   visually confirm captions actually appear (see the known bug above).

## Verified (2026-08-30 rebuild)

Rendered and visually inspected both an English clip and an Arabic (RTL)
clip: word-synced captions display and highlight the active word correctly,
grade/vignette/grain overlay is present, background music mixes under
narration (measured mean_volume -18dB / max_volume -0.7dB, consistent with
the original mix), and the branded Arabic/English end card renders with
correct RTL text shaping. Not a byte-for-byit reproduction of the original
(that source was never in git) — a fresh implementation matching the same
described behavior, rebuilt because the original scratchpad was wiped and a
~3 day automation outage made waiting no longer the reasonable choice.
