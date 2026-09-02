# Claude Skills Collection — Full Catalog

94 Claude skills across 15 categories, official Anthropic tools and community contributions. Source: [obviousworks/Claude-AI-skills-collection-2026](https://github.com/obviousworks/Claude-AI-skills-collection-2026), snapshot as of mid-2026 (repo last reviewed July 2026).

Skills require Claude Pro/Max/Team/Enterprise with code execution enabled. Treat any skill as executable code with file-system/shell/API-key access — see the security note in `SKILL.md` before installing anything here.

`⚠️ archived` = flagged as archived/unmaintained in the source repo, kept for completeness.

## 📄 Document Skills (6)

| Name | Description | Source |
|------|-------------|--------|
| **docx** | Create and edit Microsoft Word documents with formatting, comments, and tracked changes | https://github.com/anthropics/skills/tree/main/skills/docx |
| **pdf** | Extract content from PDFs, split/merge documents, or create new ones | https://github.com/anthropics/skills/tree/main/skills/pdf |
| **pptx** | Generate and edit PowerPoint presentations | https://github.com/anthropics/skills/tree/main/skills/pptx |
| **xlsx** | Manipulate Excel files, formulas, tables, and charts | https://github.com/anthropics/skills/tree/main/skills/xlsx |
| **revealjs-skill** | Generate polished, professional presentations using the Reveal.js HTML framework | https://github.com/ryanbbrown/revealjs-skill/tree/main |
| **Markdown to EPUB Converter** | Convert markdown documents and chat summaries into professional EPUB ebooks (and parse/analyze existing EPUBs) | https://github.com/smerchek/claude-epub-skill |

## 🎨 Creative & Design (6)

| Name | Description | Source |
|------|-------------|--------|
| **algorithmic-art** | Create generative art using p5.js | https://github.com/anthropics/skills/tree/main/skills/algorithmic-art |
| **canvas-design** | Render layout-based visual designs in PNG/PDF using design principles | https://github.com/anthropics/skills/tree/main/skills/canvas-design |
| **slack-gif-creator** | Generate Slack-optimized animated GIFs | https://github.com/anthropics/skills/tree/main/skills/slack-gif-creator |
| **brand-guidelines** | Apply company branding (colors, typography) to outputs | https://github.com/anthropics/skills/tree/main/skills/brand-guidelines |
| **theme-factory** | Create and apply visual themes for documents, slides, and artifacts | https://github.com/anthropics/skills/tree/main/skills/theme-factory |
| **nano-banana-image-generation** | Create images using Nano Banana Pro | https://github.com/livelabs-ventures/nano-skills/tree/main/skills/nano-image-generator |

## 💻 Development & Code Tools (16)

| Name | Description | Source |
|------|-------------|--------|
| **web-artifacts-builder** | Create elaborate, multi-component claude.ai HTML artifacts with React, Tailwind CSS, and shadcn/ui | https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder |
| **MCP Server / Builder** | Build high-quality, Claude-compatible MCP servers to integrate APIs with LLMs | https://github.com/anthropics/skills/tree/main/skills/mcp-builder |
| **Changelog Generator** | Create changelogs from commit history | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/changelog-generator |
| **using-git-worktrees** | Manage feature branches safely in isolated Git worktrees | https://github.com/obra/superpowers/tree/main/skills/using-git-worktrees |
| **test-driven-development** | Write tests before implementation to drive development | https://github.com/obra/superpowers/tree/main/skills/test-driven-development |
| **subagent-driven-development** | Use multiple Claude subagents to coordinate complex implementations | https://github.com/obra/superpowers/tree/main/skills/subagent-driven-development |
| **executing-plans** | Execute structured plans with checkpoints and verification steps | https://github.com/obra/superpowers/tree/main/skills/executing-plans |
| **finishing-a-development-branch** | Complete development branches with testing and review flow | https://github.com/obra/superpowers/tree/main/skills/finishing-a-development-branch |
| **preserving-productive-tensions** ⚠️ archived | Manage architectural decisions by preserving competing viewpoints | https://github.com/obra/superpowers-skills/tree/main/skills/architecture/preserving-productive-tensions |
| **feature-planning** | Break down feature requests into detailed, implementable plans | https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/feature-planning |
| **pypict-claude-skill** | Design comprehensive test cases using PICT for optimized test suites | https://github.com/omkamal/pypict-claude-skill |
| **aws-skills** | AWS development with CDK best practices, cost optimization, and serverless/event-driven patterns | https://github.com/zxkane/aws-skills |
| **AWS CDK Plugin** | AWS CDK development with an integrated MCP server for Infrastructure as Code | https://github.com/zxkane/aws-skills/tree/main/plugins/aws-iac |
| **claude-starter** | Production-ready Claude Code configuration template with 40 auto-activating skills and TOON format support | https://github.com/raintree-technology/claude-starter |
| **move-code-quality-skill** | Analyze Move language packages against the official Move Book Code Quality Checklist | https://github.com/1NickPappas/move-code-quality-skill |
| **claude-code-terminal-title** | Give each Claude Code terminal window a dynamic title describing the current work | https://github.com/bluzername/claude-code-terminal-title |

## 📊 Data & Analysis (3)

| Name | Description | Source |
|------|-------------|--------|
| **csv-data-summarizer** | Generate statistics and charts from CSVs | https://github.com/coffeefuelbump/csv-data-summarizer-claude-skill |
| **root-cause-tracing** | Trace and diagnose the source of data or logic errors | https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/root-cause-tracing.md |
| **postgres** | Execute safe read-only SQL queries against PostgreSQL databases with multi-connection support | https://github.com/sanjay3290/ai-skills/tree/main/skills/postgres |

## 🔬 Scientific & Research Tools (6)

| Name | Description | Source |
|------|-------------|--------|
| **claude-scientific-skills** | 125+ scientific skills for bioinformatics, cheminformatics, clinical research, and machine learning | https://github.com/K-Dense-AI/scientific-agent-skills |
| **materials-simulation-skills** | Agent skills for computational materials science: numerical stability, time-stepping, linear solvers, and simulation validation | https://github.com/HeshamFS/materials-simulation-skills |
| **Single-cell analysis (Scanpy)** | Analyze single-cell RNA-seq data with Scanpy and AnnData | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **Molecular manipulation (RDKit)** | Handle molecular structures and predictions with RDKit | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **Deep learning (PyTorch Lightning)** | Build and train ML models with PyTorch Lightning | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **Clinical databases (ClinVar)** | Access and analyze clinical variant data from ClinVar | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |

## 📝 Writing & Research (7)

| Name | Description | Source |
|------|-------------|--------|
| **article-extractor** | Extract full content from web articles | https://github.com/michalparkola/tapestry-skills/tree/main/article-extractor |
| **Content Research Writer** | Research and write high-quality content with feedback, sources, and citations | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/content-research-writer |
| **internal-comms** | Draft formal internal communications and reports using company formats | https://github.com/anthropics/skills/tree/main/skills/internal-comms |
| **writing-plans** | Create structured written plans with clear milestones | https://github.com/obra/superpowers/tree/main/skills/writing-plans |
| **writing-skills** | Enhance instructional and technical writing quality | https://github.com/obra/superpowers/tree/main/skills/writing-skills |
| **brainstorming** | Facilitate creative idea generation sessions | https://github.com/obra/superpowers/tree/main/skills/brainstorming |
| **family-history-research** | Plan family history and genealogy research projects | https://github.com/emaynard/claude-family-history-research-skill |

## 📚 Learning & Knowledge (8)

| Name | Description | Source |
|------|-------------|--------|
| **ship-learn-next** | Recommend next steps based on feedback loops | https://github.com/michalparkola/tapestry-skills/tree/main/ship-learn-next |
| **using-superpowers** | Learn and apply best practices for Superpowers workflows | https://github.com/obra/superpowers/tree/main/skills/using-superpowers |
| **collision-zone-thinking** ⚠️ archived | Combine unrelated concepts to find new creative or problem-solving connections | https://github.com/obra/superpowers-skills/tree/main/skills/problem-solving/collision-zone-thinking |
| **inversion-exercise** ⚠️ archived | Flip assumptions to uncover hidden insights and constraints | https://github.com/obra/superpowers-skills/tree/main/skills/problem-solving/inversion-exercise |
| **meta-pattern-recognition** ⚠️ archived | Identify patterns across domains to uncover universal principles | https://github.com/obra/superpowers-skills/tree/main/skills/problem-solving/meta-pattern-recognition |
| **scale-game** ⚠️ archived | Stress-test ideas at extreme scales to expose hidden weaknesses or truths | https://github.com/obra/superpowers-skills/tree/main/skills/problem-solving/scale-game |
| **simplification-cascades** ⚠️ archived | Reduce complexity by discovering insights that simplify multiple elements at once | https://github.com/obra/superpowers-skills/tree/main/skills/problem-solving/simplification-cascades |
| **tracing-knowledge-lineages** ⚠️ archived | Track how ideas evolve across iterations and influences | https://github.com/obra/superpowers-skills/tree/main/skills/research/tracing-knowledge-lineages |

## 🎥 Media & Content (4)

| Name | Description | Source |
|------|-------------|--------|
| **youtube-transcript** | Summarize YouTube transcripts | https://github.com/michalparkola/tapestry-skills/tree/main/youtube-transcript |
| **Video Downloader** | Download YouTube videos for use in Claude | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/video-downloader |
| **Image Enhancer** | Improve resolution and clarity of screenshots and images | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/image-enhancer |
| **imagen** | Generate images with Google Gemini's image API for UI mockups, icons, and visual assets | https://github.com/sanjay3290/ai-skills/tree/main/skills/imagen |

## 🤝 Collaboration & Project Management (11)

| Name | Description | Source |
|------|-------------|--------|
| **Meeting Insights Analyzer** | Analyze meeting transcripts for dynamics, communication patterns, and behavior | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/meeting-insights-analyzer |
| **Notion Integration Skills** | Official Notion connectors for Claude | https://notiondevs.notion.site/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0 |
| **receiving-code-review** | Process and apply code review feedback | https://github.com/obra/superpowers/tree/main/skills/receiving-code-review |
| **requesting-code-review** | Request and manage structured code reviews | https://github.com/obra/superpowers/tree/main/skills/requesting-code-review |
| **dispatching-parallel-agents** | Coordinate multiple Claude subagents on shared tasks | https://github.com/obra/superpowers/tree/main/skills/dispatching-parallel-agents |
| **remembering-conversations** ⚠️ archived | Recall facts, insights, and context from past Claude Code sessions | https://github.com/obra/superpowers-skills/tree/main/skills/collaboration/remembering-conversations |
| **git-pushing** | Automate git operations and repository interactions | https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/git-pushing |
| **linear-claude-skill** | Manage Linear issues, projects, and teams with MCP tools and GraphQL fallbacks | https://github.com/wrsmith108/linear-claude-skill |
| **linear-cli-skill** | Teach Claude to use linear-CLI as an alternative to the Linear MCP | https://github.com/Valian/linear-cli-skill |
| **review-implementing** | Evaluate code implementation plans and align them with specs | https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/review-implementing |
| **test-fixing** | Detect failing tests and propose patches or fixes | https://github.com/mhattingpete/claude-skills-marketplace/tree/main/engineering-workflow-plugin/skills/test-fixing |

## 🔐 Security & Testing (9)

| Name | Description | Source |
|------|-------------|--------|
| **webapp-testing** | UI test automation using Playwright to verify local web apps | https://github.com/anthropics/skills/tree/main/skills/webapp-testing |
| **ffuf_claude_skill** | Fuzz test web apps with FFUF + Claude | https://github.com/jthack/ffuf_claude_skill |
| **defense-in-depth** | Implement multi-layered testing and security best practices | https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/defense-in-depth.md |
| **systematic-debugging** | Structured debugging with hypothesis testing and validation | https://github.com/obra/superpowers/tree/main/skills/systematic-debugging |
| **testing-anti-patterns** | Identify and prevent testing anti-patterns | https://github.com/obra/superpowers/blob/main/skills/test-driven-development/testing-anti-patterns.md |
| **testing-skills-with-subagents** | Verify new skills using subagents and test cycles | https://github.com/obra/superpowers/blob/main/skills/writing-skills/testing-skills-with-subagents.md |
| **verification-before-completion** | Run verification checks before closing tasks | https://github.com/obra/superpowers/tree/main/skills/verification-before-completion |
| **condition-based-waiting** | Use logical conditions to control test flow timing | https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/condition-based-waiting.md |
| **varlock-claude-skill** | Secure environment-variable management so secrets never appear in sessions, terminals, logs, or git commits | https://github.com/wrsmith108/varlock-claude-skill |

## ⚙️ Utility & Automation (3)

| Name | Description | Source |
|------|-------------|--------|
| **skill-creator** | Build your own skill interactively | https://github.com/anthropics/skills/tree/main/skills/skill-creator |
| **gardening-skills-wiki** ⚠️ archived | Maintain a skills wiki, ensuring naming consistency and metadata quality | https://github.com/obra/superpowers-skills/tree/main/skills/meta/gardening-skills-wiki |
| **pulling-updates-from-skills-repository** ⚠️ archived | Sync and pull the latest skill updates from repositories | https://github.com/obra/superpowers-skills/tree/main/skills/meta/pulling-updates-from-skills-repository |

## 🤖 AI & Machine Learning (6)

| Name | Description | Source |
|------|-------------|--------|
| **Deep learning (Transformers)** | Use Hugging Face Transformers for NLP tasks | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **Graph ML (Torch Geometric)** | Build graph neural networks with PyTorch Geometric | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **Bayesian methods (PyMC)** | Perform Bayesian inference and modeling | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **Reinforcement learning (Stable Baselines3)** | Train RL agents with Stable Baselines3 | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **Model interpretability (SHAP)** | Explain ML model predictions with SHAP | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |
| **AWS Agentic AI Plugin** | Deploy and manage AI agents with AWS Bedrock | https://github.com/zxkane/aws-skills/tree/main/plugins/aws-agentic-ai |

## ☁️ Cloud & Infrastructure (3)

| Name | Description | Source |
|------|-------------|--------|
| **AWS Cost & Operations Plugin** | Cost optimization, monitoring, and operational excellence with MCP servers | https://github.com/zxkane/aws-skills/tree/main/plugins/aws-cost-ops |
| **AWS Serverless & Event-Driven Architecture Plugin** | Serverless patterns based on the Well-Architected Framework | https://github.com/zxkane/aws-skills/tree/main/plugins/serverless-eda |
| **Cloud compute (Modal)** | Integrate with Modal for cloud-based compute | https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/docs/skills.md |

## 💼 Business & Marketing (3)

| Name | Description | Source |
|------|-------------|--------|
| **Competitive Ads Extractor** | Extract and analyze competitors' ads | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/competitive-ads-extractor |
| **Domain Name Brainstormer** | Generate domain ideas and check availability | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/domain-name-brainstormer |
| **Lead Research Assistant** | Identify and qualify leads with outreach strategies | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/lead-research-assistant |

## 📈 Productivity & Organization (3)

| Name | Description | Source |
|------|-------------|--------|
| **file-organizer** | Intelligently organize files and folders by context; clean up structures and rename documents | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/file-organizer |
| **invoice-organizer** | Parse, categorize, and organize invoices for tax preparation | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/invoice-organizer |
| **raffle-winner-picker** | Randomly select winners from lists or sheets using secure randomness | https://github.com/ComposioHQ/awesome-claude-skills/tree/master/raffle-winner-picker |
