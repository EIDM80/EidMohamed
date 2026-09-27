#!/usr/bin/env python3
"""Install every skill, agent and command from a claude-code-templates checkout.

  python3 third_party/claude-code-templates/install.py /path/to/claude-code-templates
  python3 third_party/claude-code-templates/install.py --sanitize-only

Layout mapping:
  cli-tool/components/skills/**/SKILL.md  -> .claude/skills/<name>/      (flattened)
  cli-tool/components/agents/<cat>/*.md   -> .claude/agents/<name>.md    (flattened)
  cli-tool/components/commands/**.md      -> .claude/commands/<same relative path>

Name clashes (with skills/agents already in this repo, or between catalog
categories) get a "-<category>" suffix and the frontmatter `name:` is updated
to match. Items whose content is identical to what is already installed are
skipped. `allowed-tools` and `hooks` are stripped from every frontmatter so
nothing is pre-approved and no hook runs. A manifest of what was installed, renamed or skipped is written to
third_party/claude-code-templates/manifest.json.
"""

import filecmp
import json
import re
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SKILLS_DST = REPO / ".claude" / "skills"
AGENTS_DST = REPO / ".claude" / "agents"
COMMANDS_DST = REPO / ".claude" / "commands"
NAME_RE = re.compile(r"^(name:\s*)(.*)$", re.MULTILINE)
# Frontmatter keys that grant permissions or run commands; stripped on install
# so every vendored component asks before using tools and runs no hooks.
STRIP_KEYS = ("allowed-tools", "hooks")
STRIP_RE = re.compile(r"^(%s)\s*:" % "|".join(re.escape(k) for k in STRIP_KEYS))


def sanitize_frontmatter(path):
    """Remove STRIP_KEYS (and their nested/continuation lines) from YAML frontmatter."""
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return False
    try:
        end = next(i for i in range(1, len(lines)) if lines[i].strip() == "---")
    except StopIteration:
        return False
    out, skipping, changed = [], False, False
    for line in lines[1:end]:
        if STRIP_RE.match(line):
            skipping, changed = True, True
            continue
        if skipping and (line[:1] in (" ", "\t", "-", "]") or not line.strip()):
            continue
        skipping = False
        out.append(line)
    if changed:
        path.write_text("\n".join([lines[0]] + out + lines[end:]), encoding="utf-8")
    return changed


def body_without_name(text):
    return NAME_RE.sub(r"\1", text, count=1)


def set_frontmatter_name(path, name):
    text = path.read_text(encoding="utf-8")
    if text.startswith("---") and NAME_RE.search(text.split("---", 2)[1] if text.count("---") >= 2 else ""):
        text = NAME_RE.sub(lambda m: m.group(1) + name, text, count=1)
        path.write_text(text, encoding="utf-8")


def same_text(a, b):
    try:
        return body_without_name(a.read_text(encoding="utf-8")) == body_without_name(b.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError):
        return False


def pick_name(base, category, taken, parent=None):
    for cand in (base, f"{base}-{category}", f"{base}-{parent}-{category}" if parent else None):
        if cand and cand not in taken:
            return cand
    i = 2
    while f"{base}-{category}-{i}" in taken:
        i += 1
    return f"{base}-{category}-{i}"


def install_skills(src, manifest):
    root = src / "cli-tool" / "components" / "skills"
    skill_dirs = sorted(p.parent for p in root.rglob("SKILL.md"))
    skill_set = set(skill_dirs)
    taken = {p.name for p in SKILLS_DST.iterdir() if p.is_dir()}

    for d in skill_dirs:
        rel = d.relative_to(root)
        category = rel.parts[0]
        parent = rel.parts[-2] if len(rel.parts) >= 3 else None
        base = d.name

        existing = SKILLS_DST / base / "SKILL.md"
        if base in taken and existing.exists() and same_text(existing, d / "SKILL.md"):
            manifest["skills"].append({"source": str(rel), "installed_as": base, "status": "already-present"})
            continue

        name = pick_name(base, category, taken, parent)
        nested = [n for n in skill_set if n != d and d in n.parents]

        def ignore(dirpath, names, nested=nested):
            return [n for n in names if Path(dirpath) / n in nested]

        shutil.copytree(d, SKILLS_DST / name, ignore=ignore)
        if name != base:
            set_frontmatter_name(SKILLS_DST / name / "SKILL.md", name)
        sanitize_frontmatter(SKILLS_DST / name / "SKILL.md")
        taken.add(name)
        manifest["skills"].append(
            {"source": str(rel), "installed_as": name, "status": "renamed" if name != base else "installed"}
        )


def install_agents(src, manifest):
    root = src / "cli-tool" / "components" / "agents"
    AGENTS_DST.mkdir(parents=True, exist_ok=True)
    taken = {p.stem for p in AGENTS_DST.glob("*.md")}

    for f in sorted(root.rglob("*.md"), key=lambda p: (len(p.parts), str(p))):
        rel = f.relative_to(root)
        if f.name.lower() in ("readme.md", "claude.md"):
            continue
        category = rel.parts[0]
        base = f.stem
        existing = AGENTS_DST / f"{base}.md"
        if existing.exists() and same_text(existing, f):
            manifest["agents"].append({"source": str(rel), "installed_as": base, "status": "duplicate-skipped"})
            continue
        name = pick_name(base, category, taken)
        dst = AGENTS_DST / f"{name}.md"
        shutil.copy2(f, dst)
        if name != base:
            set_frontmatter_name(dst, name)
        sanitize_frontmatter(dst)
        taken.add(name)
        manifest["agents"].append(
            {"source": str(rel), "installed_as": name, "status": "renamed" if name != base else "installed"}
        )


def install_commands(src, manifest):
    root = src / "cli-tool" / "components" / "commands"
    for f in sorted(root.rglob("*")):
        if not f.is_file():
            continue
        rel = f.relative_to(root)
        dst = COMMANDS_DST / rel
        if dst.exists() and filecmp.cmp(f, dst, shallow=False):
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, dst)
        if f.suffix == ".md":
            sanitize_frontmatter(dst)
        if f.suffix == ".md" and f.name.lower() != "readme.md":
            manifest["commands"].append({"source": str(rel), "installed_as": str(rel), "status": "installed"})


def sanitize_installed():
    """Re-apply sanitize_frontmatter to everything listed in manifest.json."""
    manifest = json.loads(Path(__file__).with_name("manifest.json").read_text(encoding="utf-8"))
    paths = [SKILLS_DST / i["installed_as"] / "SKILL.md" for i in manifest["skills"]]
    paths += [AGENTS_DST / f'{i["installed_as"]}.md' for i in manifest["agents"]]
    paths += [COMMANDS_DST / i["installed_as"] for i in manifest["commands"]]
    changed = sum(sanitize_frontmatter(p) for p in paths if p.exists())
    print(f"sanitized {changed} of {len(paths)} files")


def main():
    if sys.argv[1:] == ["--sanitize-only"]:
        return sanitize_installed()
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = Path(sys.argv[1]).resolve()
    manifest = {"skills": [], "agents": [], "commands": []}
    install_skills(src, manifest)
    install_agents(src, manifest)
    install_commands(src, manifest)
    out = Path(__file__).with_name("manifest.json")
    out.write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    for kind, items in manifest.items():
        counts = {}
        for it in items:
            counts[it["status"]] = counts.get(it["status"], 0) + 1
        print(f"{kind}: {len(items)} {counts}")


if __name__ == "__main__":
    main()
