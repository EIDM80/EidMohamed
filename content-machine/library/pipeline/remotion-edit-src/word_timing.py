"""Heuristic word-level timing: no ASR/forced-alignment tool is available in
this environment, so we derive approximate per-word timestamps by detecting
speech-vs-silence regions in the narration audio (short-time RMS energy) and
distributing the given script's words proportionally (by character count)
across the detected speech time, in order. Not a perfect forced alignment,
but keeps captions synced to when the person is actually talking rather than
naively spreading words across the whole clip including silent lead-in/out.
"""
import numpy as np
import wave


def _read_wav_mono16(path):
    with wave.open(path, "rb") as wf:
        n = wf.getnframes()
        sr = wf.getframerate()
        raw = wf.readframes(n)
    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    return audio, sr


def _speech_regions(audio, sr, frame_ms=30, hop_ms=15, energy_ratio=0.15):
    frame_len = int(sr * frame_ms / 1000)
    hop_len = int(sr * hop_ms / 1000)
    if frame_len <= 0 or hop_len <= 0 or len(audio) < frame_len:
        return [(0.0, len(audio) / sr)]

    n_frames = 1 + (len(audio) - frame_len) // hop_len
    energies = np.zeros(n_frames)
    for i in range(n_frames):
        start = i * hop_len
        chunk = audio[start:start + frame_len]
        energies[i] = np.sqrt(np.mean(chunk ** 2) + 1e-12)

    peak = np.max(energies) if len(energies) else 0
    threshold = peak * energy_ratio
    is_speech = energies > threshold

    # Smooth: fill short gaps, drop very short blips.
    min_gap_frames = int(300 / hop_ms)
    min_run_frames = int(60 / hop_ms)

    regions = []
    start_idx = None
    for i, v in enumerate(is_speech):
        if v and start_idx is None:
            start_idx = i
        elif not v and start_idx is not None:
            regions.append((start_idx, i))
            start_idx = None
    if start_idx is not None:
        regions.append((start_idx, len(is_speech)))

    merged = []
    for r in regions:
        if merged and r[0] - merged[-1][1] <= min_gap_frames:
            merged[-1] = (merged[-1][0], r[1])
        else:
            merged.append(list(r))

    merged = [tuple(r) for r in merged if r[1] - r[0] >= min_run_frames]

    if not merged:
        return [(0.0, len(audio) / sr)]

    return [
        (start_i * hop_ms / 1000, min(len(audio) / sr, end_i * hop_ms / 1000 + frame_ms / 1000))
        for start_i, end_i in merged
    ]


def word_timings_seconds(wav_path, script_text):
    """Returns list of (word, start_sec, end_sec) for each word in script_text,
    distributed proportionally (by char length) across detected speech time."""
    words = [w for w in script_text.split() if w.strip()]
    if not words:
        return []

    audio, sr = _read_wav_mono16(wav_path)
    total_dur = len(audio) / sr
    regions = _speech_regions(audio, sr)

    speech_total = sum(e - s for s, e in regions)
    if speech_total <= 0:
        speech_total = total_dur
        regions = [(0.0, total_dur)]

    weights = [len(w) + 1 for w in words]
    total_weight = sum(weights)

    # Walk the speech regions, consuming word-durations proportional to
    # character weight out of the total speech time.
    out = []
    region_idx = 0
    cursor = regions[0][0]
    region_end = regions[0][1]
    remaining_in_region = region_end - cursor

    for word, w in zip(words, weights):
        dur = speech_total * (w / total_weight)
        start = cursor
        remaining = dur
        while remaining > remaining_in_region and region_idx < len(regions) - 1:
            remaining -= remaining_in_region
            region_idx += 1
            cursor = regions[region_idx][0]
            region_end = regions[region_idx][1]
            remaining_in_region = region_end - cursor
        end = min(cursor + remaining, region_end)
        cursor = end
        remaining_in_region = region_end - cursor
        out.append((word, start, max(end, start + 0.05)))

    return out
