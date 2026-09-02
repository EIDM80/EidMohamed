---
name: "claude-skills-catalog"
title: Claude skills catalog (discovery index)
description: "Use this skill when the user asks whether a Claude skill already exists for some job before building one from scratch — \"is there a skill for X,\" \"what Claude skills are out there for PDFs/testing/AWS/etc,\" \"find me a skill for Y,\" or when starting a task that a known community/official skill already covers (docx, pdf, pptx, xlsx editing, web-artifacts-builder, MCP server building, TDD/systematic-debugging workflows, AWS CDK, scientific/bioinformatics skills, webapp-testing with Playwright, SQL/postgres, YouTube transcript summarizing, invoice/file organizing, etc). Indexes 94 third-party and official Anthropic Claude skills across 15 categories with what each does and its source repo — curated from github.com/obviousworks/Claude-AI-skills-collection-2026. This is a DISCOVERY INDEX ONLY: none of the 94 linked skills are installed or vetted. Recommend the matching entry and its source link, then treat installing it as a separate step requiring its own inspection (per the security note below) — never assume it's already available."
category: Reference
---

# Claude Skills Catalog

A discovery index of 94 community and official Anthropic Claude skills across 15 categories, so a matching skill can be found and pointed to before reinventing it. Source: [obviousworks/Claude-AI-skills-collection-2026](https://github.com/obviousworks/Claude-AI-skills-collection-2026), snapshot as of mid-2026.

Full catalog with every entry and its source link: `references/catalog.md`.

## ⚠️ Security note (carried over from the source repo, read before installing anything)

**None of the skills listed here are installed, vetted, or endorsed by this index.** A skill is executable instruction code with access to the file system, shell, and API keys — treat any of these like a new dependency, not a document. The source repo cites a Feb 2026 Snyk audit finding roughly 36% (1,467 of 3,984) of scanned community Claude skills had at least one security flaw, including credential-theft and backdoor payloads.

Before actually installing any specific skill from this catalog:
1. Fetch and read its `SKILL.md` (and any scripts it ships) — same inspection done for the GTM skills, claude-seo, omni-ugc-ad-factory, and ai-history-vlog skills already in this repo.
2. Prefer entries under `github.com/anthropics/skills` (official) when an official version exists for the same job.
3. Only then install it (via `npx skills add <repo>` for a portable skill, or `claude plugin marketplace add` for a full plugin) and commit it into `.claude/skills/` the same way as the others.

## Quick category index

| Category | Count | Highlights |
|---|---|---|
| Document Skills | 6 | docx, pdf, pptx, xlsx (official), revealjs-skill, markdown-to-epub |
| Creative & Design | 6 | algorithmic-art, canvas-design, brand-guidelines, theme-factory (official), nano-banana-image-generation |
| Development & Code Tools | 16 | web-artifacts-builder, mcp-builder (official), TDD/systematic-debugging family (superpowers), aws-skills, claude-starter |
| Data & Analysis | 3 | csv-data-summarizer, root-cause-tracing, postgres (safe read-only SQL) |
| Scientific & Research Tools | 6 | claude-scientific-skills (125+ bioinformatics/cheminformatics/ML sub-skills), materials-simulation-skills |
| Writing & Research | 7 | article-extractor, internal-comms (official), writing-plans, brainstorming |
| Learning & Knowledge | 8 | using-superpowers, several archived "problem-solving" thinking-technique skills |
| Media & Content | 4 | youtube-transcript, video-downloader, image-enhancer, imagen |
| Collaboration & Project Management | 11 | Notion Integration Skills (official Notion), code-review pair, linear-claude-skill, dispatching-parallel-agents |
| Security & Testing | 9 | webapp-testing (official, Playwright), ffuf_claude_skill, systematic-debugging family, varlock-claude-skill |
| Utility & Automation | 3 | skill-creator (official) |
| AI & Machine Learning | 6 | Transformers/Torch Geometric/PyMC/Stable Baselines3/SHAP (all via K-Dense scientific-agent-skills), AWS Bedrock agentic AI |
| Cloud & Infrastructure | 3 | AWS cost-ops, AWS serverless/EDA, Modal compute |
| Business & Marketing | 3 | competitive-ads-extractor, domain-name-brainstormer, lead-research-assistant |
| Productivity & Organization | 3 | file-organizer, invoice-organizer, raffle-winner-picker |

See `references/catalog.md` for the full per-skill table (name, description, source link) in every category, including entries marked `⚠️ archived` in the source repo (still listed for completeness, but not actively maintained).

## How to use this

1. When a task matches an entry, name it and its source link rather than building the equivalent from scratch.
2. If both an official (`anthropics/skills`) and a community version exist for the same job, default to the official one unless the community one clearly does more of what's needed.
3. Before installing anything found here, follow the security note above — this index is a map, not a stamp of approval.
4. This snapshot will drift (the source repo is actively updated); if a link looks stale or a skill isn't where expected, check the source repo directly.
