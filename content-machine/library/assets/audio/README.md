# Background music (2026-08-26)

Standing rule added 2026-08-26 per user request: **every ad video from now on gets a background music bed mixed under the narration**, in addition to the existing captions/color-grade/end-card pipeline.

## What changed

- `bg-music-corporate-v1.mp3` — 30s instrumental track generated via ElevenLabs Music (`eleven_music_v2`): warm corporate piano/synth bed, no vocals, loopable, ~100-110 BPM. Backed up here since the live Remotion pipeline lives only in the session scratchpad (`/tmp/.../scratchpad/remotion-edit`), which does not survive a container/session restart.
- `AdScene.tsx.reference` — the patched version of `src/scenes/AdScene.tsx` in the Remotion pipeline. Adds an `<Audio>` node spanning the whole composition (clip + end card), volume-ducked to `0.13` with a 20-frame fade in/out so the voiceover always reads clearly on top.

## To restore after a pipeline rebuild

1. Copy `bg-music-corporate-v1.mp3` to `<remotion-edit>/public/music/bg-music.mp3`.
2. Copy `AdScene.tsx.reference` over `<remotion-edit>/src/scenes/AdScene.tsx` (or reapply the `<Audio>` block if the file has since diverged).
3. No other changes needed — `edit_and_push.py` and the `AdSceneDynamic` composition pick this up automatically since the music lives inside `AdScene`, which every rendered ad already uses.

## Verified

Test-rendered against `angle-car-saudi` on 2026-08-26: mixed track measured mean_volume -23.7dB / max_volume -0.0dB (narration peak untouched, music sits underneath). Sample sent to user for approval before rolling out to the live queues.
