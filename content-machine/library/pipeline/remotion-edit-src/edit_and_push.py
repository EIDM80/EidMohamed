#!/usr/bin/env python3
"""Edit a raw source video into a branded ad (word-synced captions, color
grade/grain/vignette, background music, branded end card) via the Remotion
pipeline in this directory, then push the rendered file to the git repo and
print RAW_URL=<raw.githubusercontent.com url to the pushed file>.

Usage: edit_and_push.py <name> <video_url> <spoken_text> <lang>
"""
import json
import os
import subprocess
import sys
import time

import cv2
import imageio_ffmpeg

from word_timing import word_timings_seconds

FPS = 30
REPO_DIR = "/home/user/EidMohamed"
REPO_REL_OUT = "iso-cert-portal/public/marketing/ads/video/ig/remotion-edit"
GIT_BRANCH = "claude/inspect-deploy-local-9l1858"
GIT_REMOTE_URL = "https://github.com/EIDM80/EidMohamed"

TAGLINES = {
    "ar": "شهادات ISO معتمدة دولياً، خلال أيام فقط",
    "en": "Get internationally accredited ISO certified, fast",
    "fr": "Certification ISO accréditée à l'international, rapide",
    "hi": "अंतरराष्ट्रीय स्तर पर मान्यता प्राप्त ISO प्रमाणन",
}


def run(cmd, **kwargs):
    print("+ " + " ".join(cmd))
    subprocess.run(cmd, check=True, **kwargs)


def sh(cmd):
    print("+ " + cmd)
    subprocess.run(cmd, shell=True, check=True)


def main():
    if len(sys.argv) != 5:
        print("Usage: edit_and_push.py <name> <video_url> <spoken_text> <lang>", file=sys.stderr)
        sys.exit(1)

    name, video_url, spoken_text, lang = sys.argv[1:5]

    base = os.path.dirname(os.path.abspath(__file__))
    work_dir = os.path.join(base, "auto", name)
    os.makedirs(work_dir, exist_ok=True)

    raw_path = os.path.join(work_dir, "raw.mp4")
    audio_path = os.path.join(work_dir, "audio.wav")
    props_path = os.path.join(work_dir, "props.json")

    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

    # 1. Download source video.
    run(["curl", "-sSL", "-o", raw_path, video_url])

    # 2. Extract mono 16kHz audio for word-timing analysis.
    run([ffmpeg_exe, "-y", "-v", "error", "-i", raw_path, "-ar", "16000", "-ac", "1", audio_path])

    # 3. Video duration/frame count via opencv (no ffprobe available here).
    cap = cv2.VideoCapture(raw_path)
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 30
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0
    cap.release()
    duration_sec = (frame_count / src_fps) if src_fps else 0
    if duration_sec <= 0:
        # Fall back to audio length if video metadata is unreliable.
        import wave
        with wave.open(audio_path, "rb") as wf:
            duration_sec = wf.getnframes() / wf.getframerate()

    clip_frames = max(1, round(duration_sec * FPS))

    # 4. Heuristic word timings (energy-based speech detection + proportional
    #    distribution of the given script across detected speech regions).
    timings = word_timings_seconds(audio_path, spoken_text)
    words = [
        {
            "text": w,
            "startFrame": max(0, min(clip_frames - 1, round(s * FPS))),
            "endFrame": max(1, min(clip_frames, round(e * FPS))),
        }
        for w, s, e in timings
    ]
    # Ensure strictly increasing, non-overlapping-enough frames.
    for i in range(1, len(words)):
        if words[i]["startFrame"] < words[i - 1]["endFrame"]:
            words[i]["startFrame"] = words[i - 1]["endFrame"]
        if words[i]["endFrame"] <= words[i]["startFrame"]:
            words[i]["endFrame"] = words[i]["startFrame"] + 1

    rtl = lang == "ar"
    tagline = TAGLINES.get(lang, TAGLINES["en"])

    # 5. Stage video into Remotion's public/ dir and write props.
    public_videos = os.path.join(base, "public", "videos")
    os.makedirs(public_videos, exist_ok=True)
    video_filename = f"{name}.mp4"
    sh(f'cp "{raw_path}" "{os.path.join(public_videos, video_filename)}"')

    props = {
        "videoFile": video_filename,
        "words": words,
        "rtl": rtl,
        "tagline": tagline,
        "clipFrames": clip_frames,
    }
    with open(props_path, "w", encoding="utf-8") as f:
        json.dump(props, f, ensure_ascii=False)

    # 6. Render.
    out_path = os.path.join(base, "out", f"{name}-remotion.mp4")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    headless_shell = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"
    render_cmd = [
        "npx", "remotion", "render",
        "src/index.ts", "AdSceneDynamic", out_path,
        "--codec", "h264", "--crf", "17",
        f"--browser-executable={headless_shell}",
        f"--props={props_path}",
        "--concurrency=1", "--overwrite",
    ]
    run(render_cmd, cwd=base)

    # 7. Push into the git repo (self-healing: fetch+reset+recopy+recommit on
    #    a concurrent-push rejection, since multiple firings may race).
    dest_rel = os.path.join(REPO_REL_OUT, f"{name}-remotion.mp4")

    if not os.path.isdir(REPO_DIR):
        os.makedirs(os.path.dirname(REPO_DIR), exist_ok=True)
        run(["git", "clone", "--branch", GIT_BRANCH, GIT_REMOTE_URL, REPO_DIR])

    dest_abs = os.path.join(REPO_DIR, dest_rel)
    os.makedirs(os.path.dirname(dest_abs), exist_ok=True)

    for attempt in range(5):
        sh(f'cp "{out_path}" "{dest_abs}"')
        run(["git", "-C", REPO_DIR, "add", dest_rel])
        commit = subprocess.run(
            ["git", "-C", REPO_DIR, "commit", "-m", f"Add Remotion-edited version of {name}"],
        )
        if commit.returncode != 0:
            # Nothing to commit (identical bytes to an existing push) — treat as done.
            break
        push = subprocess.run(["git", "-C", REPO_DIR, "push", "origin", GIT_BRANCH])
        if push.returncode == 0:
            break
        print(f"push rejected, retrying (attempt {attempt + 1})...", file=sys.stderr)
        run(["git", "-C", REPO_DIR, "fetch", "origin", GIT_BRANCH])
        run(["git", "-C", REPO_DIR, "reset", "--hard", f"origin/{GIT_BRANCH}"])
        time.sleep(2)
    else:
        print("Failed to push after retries", file=sys.stderr)
        sys.exit(1)

    raw_url = f"https://raw.githubusercontent.com/EIDM80/EidMohamed/{GIT_BRANCH}/{dest_rel}"
    print(f"RAW_URL={raw_url}")


if __name__ == "__main__":
    main()
