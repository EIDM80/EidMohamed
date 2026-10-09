---
name: "cct-skills-catalog"
title: claude-code-templates skills catalog (discovery index)
description: "Use this skill when the user asks whether a Claude Code skill already exists for some job before building one from scratch, or when starting a task that a known skill in this collection already covers — language/framework experts (python-pro, react-best-practices, laravel-expert, ...), cloud/DevOps (terraform-specialist, kubernetes-architect, railway-*, vercel-deploy), AI/LLM engineering (langchain, rag-engineer, fine-tuning, model serving/quantization, RL training), scientific/bioinformatics (alphafold-database, biopython, rdkit, scanpy, ...), testing/security (playwright, owasp-security, webapp-testing), git/GitHub workflow (gh-fix-ci, create-pr, systematic-debugging), document/media generation (docx, pdf, pptx, remotion, mermaid-diagrams), marketing/SEO/growth, resume/career tools, business-role personas (ceo-advisor, qms-audit-expert), Notion/Obsidian knowledge tools, and SaaS/bot integrations (stripe, shopify, slack, telegram). Indexes ~814 of the 869 skills in github.com/davila7/claude-code-templates across 20 categories with what each does and the source repo. This is a DISCOVERY INDEX ONLY: none of the 869 skills are installed, inspected, or vetted — this just says what exists and where, so the matching one can be found and then inspected/installed as its own step."
category: Reference
---

# claude-code-templates Skills Catalog

A discovery index of the **claude-code-templates** skill collection — a single
GitHub repo bundling ~869 Claude Code skills across nearly every domain
(languages, cloud, AI/ML, bioinformatics, security, marketing, career tools,
business-role personas, and more). Source:
[davila7/claude-code-templates](https://github.com/davila7/claude-code-templates),
snapshot taken via `npx skills add davila7/claude-code-templates --list` on
2026-10-09 (confirmed 869 skills by the CLI; this index's sampling captured
814 of the names, grouped into the 20 categories below — the remaining ~55
almost certainly fall into these same categories, just not individually
named here).

Full flat list of every skill name this index captured, by category:
`references/catalog.md`.

## Why index-only

869 skills is far beyond what can be reviewed one-by-one in a single pass.
Rather than bulk-installing an unreviewed collection of that size (which
would mean trusting hundreds of third-party scripts with file/shell/API
access sight-unseen), this index exists so a specific skill can be **named
and found** when it's actually needed — then inspected and installed as its
own deliberate step, the same way every other skill in this repo was vetted
before being added.

## ⚠️ Security note

**None of the skills listed here are installed, vetted, or endorsed by this
index.** A skill is executable instruction code with access to the file
system, shell, and API keys — treat any of these like a new dependency, not
a document, especially at this scale from a single third-party repo.

Before installing any specific skill named here:
1. Check what it actually contains: `npx skills add davila7/claude-code-templates -s <skill-name> --list` or fetch its `SKILL.md` directly from the repo.
2. Read it (and any scripts it ships) the same way every other skill in `.claude/skills/` in this repo was inspected before being added.
3. Only then install it: `npx skills add davila7/claude-code-templates -s <skill-name> -a claude-code -y`.

## Quick category index

| Category | ~Count | Examples |
|---|---|---|
| Language & framework experts | 65 | python-pro, react-dev, laravel-expert, golang-pro, flutter-expert, django-pro, fastapi-pro |
| Frontend / UI / design systems | 23 | tailwind-design-system, shadcn, figma-implement-design, core-web-vitals, mobile-design |
| Backend / API / architecture | 17 | microservices-patterns, domain-driven-design, graphql-architect, mcp-builder, c4-architecture |
| Databases & vector stores | 19 | postgresql-optimization, prisma-expert, qdrant-vector-search, pinecone, using-neon |
| Cloud, DevOps & infrastructure | 45 | terraform-specialist, kubernetes-architect, docker-expert, railway-* (10+), vercel-deploy |
| AI/LLM engineering & agents | 105 | langchain, rag-engineer, fine-tuning-with-trl, serving-llms-vllm, crewai-multi-agent, prompt-engineering |
| Scientific, bioinformatics & research | 122 | alphafold-database, biopython, rdkit, scanpy, pymc-bayesian-modeling, scientific-writing |
| General data analysis | 9 | exploratory-data-analysis, statistical-analysis, forecast-accuracy-review |
| Testing & QA | 15 | playwright, webapp-testing, tdd-workflow, k6-load-testing |
| Security & compliance | 20 | owasp-security, api-security-testing, threat-modeling-expert, secrets-management |
| Code quality, review & debugging | 26 | code-review, systematic-debugging, production-code-audit, performance-optimizer |
| Git, GitHub & workflow automation | 26 | gh-fix-ci, create-pr, using-git-worktrees, dispatching-parallel-agents, **yeet** (stages/commits/pushes/opens a PR — gated to explicit user ask) |
| Documents, diagrams & media generation | 38 | docx, pdf, pptx (official variants too), remotion, mermaid-diagrams, whisper, generate-image |
| Marketing, SEO & growth | 34 | seo-audit, programmatic-seo, form-cro/page-cro/signup-flow-cro, marketing-strategy-pmm |
| Career & resume tools | 14 | resume-tailor, cover-letter-generator, linkedin-profile-optimizer, salary-negotiation-prep |
| Business roles, ops & compliance personas | 29 | ceo-advisor, qms-audit-expert, regulatory-affairs-head, incident-responder |
| Knowledge, notes & memory tools | 18 | notion-knowledge-capture, obsidian-markdown, memory-search, docs-search |
| SaaS integrations & bots | 25 | stripe-integration, shopify-development, slack-bot-builder, n8n-workflow-patterns |
| Claude Code / skill meta-tooling | 16 | skill-creator, plugin-forge, using-superpowers, claude-code-sessions |
| Misc / novelty / games | 20+ | game-development, interactive-portfolio, raffle-winner-picker, and a long tail of one-off/product-specific skills (e.g. a `curviate-*` suite, a `doordash-*` suite) not broken out further here |

Counts are from this index's 814-name sample, not an exact census of all 869
— treat them as approximate. See `references/catalog.md` for the full list
of names this index captured, grouped the same way.

## How to use this

1. When a task matches a category or name above, check the exact skill name
   in `references/catalog.md`, then follow the security note before
   installing it.
2. This repo bundles both plain skills and some that may expect a specific
   toolchain already present (GPU, specific SDKs, cloud credentials,
   domain databases) — read the skill before assuming it'll just run.
3. For a name that looks genuinely novel/narrow (e.g. the `curviate-*` or
   `doordash-*` suites), assume it's a product-specific integration and
   check its `SKILL.md` for what service/account it expects before relying
   on it.
4. This snapshot will drift as the source repo grows — if a name isn't
   found, check the repo directly or re-run
   `npx skills add davila7/claude-code-templates --list`.
