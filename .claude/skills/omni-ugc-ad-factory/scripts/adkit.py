#!/usr/bin/env python3
"""
adkit.py — the deterministic half of the UGC ad factory.

Two phases, in this order. The order is not optional: clip 1 must be trimmed BEFORE its
seed frame is extracted, or clip 2 will be chained to a frame that no longer exists in the
final cut and the seam will break.

  PHASE A  (after clip 1 is generated)
      python adkit.py seed --clip1 c1.mp4 --workdir ad1/
    -> measures clip 1's speech, trims its dead-air tail, extracts the LAST FRAME OF THE
       TRIMMED CLIP. Upload that frame and pass it as clip 2's ref_image_file_ids.

  PHASE B  (after clip 2 is generated)
      python adkit.py finish --clip2 c2.mp4 --workdir ad1/ --out ad1/ad_final_9x16.mp4
    -> verifies the seam (refuses to continue on FAIL), trims clip 2's tail (never its
       head — the held frames ARE the seam), and stitches the two trimmed clips into the
       single seamless 9:16 MP4 that is the deliverable.

Trim points are MEASURED, never hardcoded. Omni routinely leaves 1-2s of dead air and the
amount differs every single generation.
"""
import argparse, json, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np
from PIL import Image

TAIL_PAD = 0.45  # seconds of hold after the last word — lands the expression, no dead air


def run(cmd):
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        sys.exit(f"ffmpeg/ffprobe failed:\n{' '.join(map(str, cmd))}\n{p.stderr[:800]}")
    return p


def duration(path):
    p = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", str(path)])
    return float(p.stdout.strip())


def speech_bounds(path, thresh_frac=0.10):
    """(first_speech, last_speech) in seconds via a 20ms RMS envelope."""
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "a.wav"
        run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", "16000",
             "-f", "wav", str(wav), "-y"])
        w = wave.open(str(wav))
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
        sr = w.getframerate()
    win = int(sr * 0.02)
    env = np.array([np.sqrt((a[i:i + win] ** 2).mean()) for i in range(0, len(a) - win, win)])
    t = np.arange(len(env)) * 0.02
    hits = np.where(env > env.max() * thresh_frac)[0]
    if len(hits) == 0:
        return None, None
    return float(t[hits[0]]), float(t[hits[-1]])


def cut_point(path, pad=TAIL_PAD):
    first, last = speech_bounds(path)
    dur = duration(path)
    if last is None:
        return dur, first, last, dur
    return min(last + pad, dur), first, last, dur


def trim(src, dst, end):
    run(["ffmpeg", "-v", "error", "-i", str(src), "-t", f"{end:.3f}",
         "-c:v", "libx264", "-crf", "18", "-preset", "medium",
         "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", str(dst), "-y"])
    return dst


def frame_at(path, ts, size=(180, 320)):
    with tempfile.TemporaryDirectory() as td:
        f = Path(td) / "f.png"
        run(["ffmpeg", "-v", "error", "-ss", str(ts), "-i", str(path),
             "-frames:v", "1", "-q:v", "1", str(f), "-y"])
        return np.array(Image.open(f).convert("RGB").resize(size)).astype(float)


# ----------------------------------------------------------------- PHASE A
def phase_seed(a):
    wd = Path(a.workdir); wd.mkdir(parents=True, exist_ok=True)
    cut, first, last, dur = cut_point(a.clip1, a.tail_pad)

    print("=" * 64)
    print("PHASE A — trim clip 1, then extract its seed frame")
    print(f"  speech        : {first:.3f}s -> {last:.3f}s")
    print(f"  source length : {dur:.3f}s   (dead air {dur - last:.3f}s)")
    print(f"  tail cut at   : {cut:.3f}s")

    c1t = wd / "clip1_trimmed.mp4"
    trim(a.clip1, c1t, cut)
    d1 = duration(c1t)

    seed = wd / "clip1_seed_lastframe.png"
    run(["ffmpeg", "-v", "error", "-sseof", "-0.05", "-i", str(c1t),
         "-update", "1", "-q:v", "1", str(seed), "-y"])

    json.dump({"clip1_trimmed": str(c1t), "clip1_duration": d1, "seed_frame": str(seed)},
              open(wd / "state.json", "w"), indent=2)

    print(f"\n  trimmed clip1 : {c1t}   ({d1:.3f}s)  <- upload this as the canvas clip1")
    print(f"  SEED FRAME    : {seed}                <- upload, use as clip 2's")
    print( "                                            ref_image_file_ids (ingredients)")
    print("\n  Clip 2's prompt MUST open with:")
    print('    "The reference image is the exact first frame of this video. The video opens')
    print('     on precisely that frame — same face, same lighting, same framing, same head')
    print('     position — and motion continues forward from that instant, as one unbroken')
    print('     continuation of a shot already in progress."')
    print("=" * 64)


# ----------------------------------------------------------------- PHASE B
def phase_finish(a):
    wd = Path(a.workdir)
    st = json.load(open(wd / "state.json"))
    c1, d1 = st["clip1_trimmed"], st["clip1_duration"]

    print("=" * 64)
    print("PHASE B — verify seam, trim clip 2, stitch the 9:16 deliverable")

    seed = np.array(Image.open(st["seed_frame"]).convert("RGB").resize((180, 320))).astype(float)
    seam = float(np.abs(seed - frame_at(a.clip2, 0.0)).mean())
    verdict = "PASS" if seam < 5 else ("MARGINAL" if seam < 15 else "FAIL")
    print(f"\n  SEAM  clip1 end vs clip2 frame0 : {seam:.2f} / 255  -> {verdict}")
    if verdict == "FAIL":
        print("  ! Clip 2 was not seeded from the trimmed clip 1's last frame.")
        print("    Regenerate clip 2. Do not paper over this in the edit.")
        sys.exit(1)

    cut, first, last, dur = cut_point(a.clip2, a.tail_pad)
    print(f"\n  clip2 speech : {first:.3f}s -> {last:.3f}s  (source {dur:.3f}s, "
          f"dead air {dur - last:.3f}s)")
    print(f"  tail cut at  : {cut:.3f}s   (head untouched — it IS the seam)")
    c2 = wd / "clip2_trimmed.mp4"
    trim(a.clip2, c2, cut)
    d2 = duration(c2)
    total = round(d1 + d2, 3)

    # Both trimmed clips share identical encode params, so the concat demuxer
    # butt-joins them without re-encoding — no gap, no black flash.
    lst = wd / "concat.txt"
    lst.write_text(f"file '{Path(c1).resolve()}'\nfile '{c2.resolve()}'\n")
    run(["ffmpeg", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
         "-c", "copy", "-movflags", "+faststart", a.out, "-y"])

    df = duration(a.out)
    print(f"\n  DELIVERABLE  : {a.out}   ({df:.3f}s expected {total:.3f}s, 9:16)")
    print( "  Recommend to the user: a room-tone bed ~15dB under the voice makes it sound")
    print( "  recorded; offer to mix one in if they supply an ambience file.")
    print("=" * 64)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("seed", help="PHASE A: trim clip1, extract its seed frame")
    s.add_argument("--clip1", required=True)
    s.add_argument("--workdir", required=True)
    s.add_argument("--tail-pad", type=float, default=TAIL_PAD)
    s.set_defaults(fn=phase_seed)

    f = sub.add_parser("finish", help="PHASE B: seam check, trim clip2, stitch 9:16")
    f.add_argument("--clip2", required=True)
    f.add_argument("--workdir", required=True)
    f.add_argument("--out", default="ad_final_9x16.mp4")
    f.add_argument("--tail-pad", type=float, default=TAIL_PAD)
    f.set_defaults(fn=phase_finish)

    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
