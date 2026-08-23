#!/usr/bin/env python3
"""Scaffold a new client under content-machine/clients/<client_id>/.

Usage:
    python3 new_client.py <client_id> --name "Display Name" [--website URL]

Creates config.json (template — fill in topics/personas/hooks before the
first generate_calendar.py run), an empty learnings.json, and the
calendar/queues/performance subfolders. Edit config.json by hand afterward;
there is no wizard on purpose — the schema is documented in
content-machine/schema/client-config.md.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib.common import CLIENTS_DIR, save_json, today_iso  # noqa: E402

TEMPLATE_PLATFORMS = {
    "youtube": {"enabled": False, "handle": "", "posts_per_day": 1, "queue_file": "queues/youtube.json"},
    "instagram": {"enabled": False, "handle": "", "posts_per_day": 1, "queue_file": "queues/instagram.json"},
    "facebook": {"enabled": False, "handle": "", "posts_per_day": 1, "queue_file": "queues/facebook.json"},
    "tiktok": {"enabled": False, "handle": "", "posts_per_day": 1, "queue_file": "queues/tiktok.json"},
}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("client_id", help="Short slug, e.g. 'isoorder', 'acme-clinic'")
    ap.add_argument("--name", required=True, help="Display name")
    ap.add_argument("--website", default="")
    args = ap.parse_args()

    cdir = CLIENTS_DIR / args.client_id
    if cdir.exists():
        raise SystemExit(f"clients/{args.client_id} already exists — edit config.json directly instead.")

    for sub in ("calendar", "queues", "performance"):
        (cdir / sub).mkdir(parents=True, exist_ok=True)
        (cdir / sub / ".gitkeep").touch()

    config = {
        "client_id": args.client_id,
        "display_name": args.name,
        "website": args.website,
        "created_at": today_iso(),
        "brand": {
            "languages": ["ar", "en"],
            "primary_language": "ar",
            "voice": "TODO — describe tone in 1-2 lines",
            "cta": "TODO",
        },
        "platforms": TEMPLATE_PLATFORMS,
        "topics": [
            {"id": "TODO-topic-1", "label_ar": "", "label_en": ""},
        ],
        "personas": [
            {"id": "TODO-persona-1", "label_ar": "", "label_en": ""},
        ],
        "hooks": [
            {"id": "TODO-hook-1", "label_ar": "", "pattern": ""},
        ],
        "content_type_mix": {
            "ugc_talking_head": 0.6,
            "camera_replacement": 0.1,
            "hero_cinematic": 0.05,
            "motion_graphics_static_source": 0.25,
        },
        "routing_overrides": {},
    }
    save_json(cdir / "config.json", config)
    save_json(cdir / "learnings.json", {"topics": {}, "personas": {}, "hooks": {}, "updated_at": None})

    print(f"Created clients/{args.client_id}/ — fill in topics/personas/hooks and enable "
          f"platforms in config.json before running generate_calendar.py.")


if __name__ == "__main__":
    main()
