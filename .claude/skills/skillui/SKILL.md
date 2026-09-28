---
name: "skillui"
title: Extract a design system and build matching UI (SkillUI)
description: "Use this skill when the user wants new UI to visually match an existing website, app, or codebase — \"make this look like notion.so\", \"match our existing app's design\", \"extract the design system from this repo/site\", \"clone the look of X\", or before building any UI when a specific site/repo is named as the visual reference. Wraps the `skillui` npm CLI (github.com/amaancoderx/npxskillui, MIT) — not itself a packaged Claude skill (no SKILL.md upstream; the tool GENERATES one per target, so this documents install + usage instead of copying files). Extracts colors, typography, spacing, animations, components, and screenshots from a URL, git repo, or local directory into a structured design-token package, then that package is used as the reference for building matching UI. No API keys required — pure static/visual analysis, runs locally."
category: Reference
---

# SkillUI — design-system extraction

Reverse-engineers a design system (colors, typography, spacing, animations, components, screenshots) from a live website, a git repo, or a local codebase, and packages it as design tokens + reference docs to build matching UI against. Source: [amaancoderx/npxskillui](https://github.com/amaancoderx/npxskillui), MIT license.

## Install

```bash
npm install -g skillui
```

Node.js 18+ required. For **ultra mode** (Playwright-based visual extraction — better for JS-heavy/animated sites), also:

```bash
npm install playwright
npx playwright install chromium
```

## Usage by mode

```bash
# Crawl a live URL
skillui --url https://notion.so
skillui --url https://nothing.tech --mode ultra --screens 10   # cinematic/animation-aware extraction

# Scan a local directory (an existing project's own design system)
skillui --dir ./my-app
skillui --dir ./my-nextjs-app --name "MyApp"

# Clone and analyze a git repo
skillui --repo https://github.com/org/repo
skillui --repo https://github.com/vercel/next.js --name "Next.js"
```

| Flag | Purpose |
|---|---|
| `--mode ultra` | Playwright-powered extraction — catches animations/interactions static analysis misses |
| `--screens <n>` | Pages to crawl (default 5, max 20) |
| `--out <path>` | Custom output directory |
| `--name <string>` | Override the generated project name |
| `--format design-md\|skill\|both` | Output format selection |
| `--no-skill` | Generate only `DESIGN.md`, skip the packaged `.skill` zip |

## What it produces

A folder (e.g. `notion-design/`):

```
notion-design/
  SKILL.md            — auto-loaded by Claude Code when working in this folder
  CLAUDE.md            — project context
  DESIGN.md            — full design tokens, human-readable
  notion-design.skill  — packaged zip of the above
  tokens/
    colors.json
    spacing.json
    typography.json
  references/
    ANIMATIONS.md
    LAYOUT.md
    COMPONENTS.md
    INTERACTIONS.md
    VISUAL_GUIDE.md
  screens/{scroll,pages,sections}/   — screenshots
  fonts/                              — bundled Google Fonts (woff2)
```

## How to use this in practice

1. Run `skillui` against whatever the user named as the visual reference (URL, repo, or their own existing project dir).
2. The output folder's `SKILL.md`/`CLAUDE.md` are picked up automatically by a Claude Code session run inside that folder — or read `DESIGN.md` and `tokens/*.json` directly to pull exact colors/spacing/type scale into the current project instead.
3. Cross-reference `references/COMPONENTS.md` and the `screens/` captures before building each UI piece, rather than guessing at spacing/color from memory.
4. Prefer `--mode ultra` when the reference site is animation-heavy or the default static crawl produces thin/generic tokens.
