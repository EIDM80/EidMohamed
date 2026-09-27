# claude-code-templates (vendored skills)

Source: https://github.com/davila7/claude-code-templates (MIT, see LICENSE), upstream commit 42886b2, path `cli-tool/components/skills/`.

Only a curated subset for social media, content, design, video and analytics was installed into `.claude/skills/`. Some skills (canvas-design, theme-factory, etc.) carry their own LICENSE.txt inside their folder.

`brand-guidelines-community` was renamed from `brand-guidelines` to avoid clashing with the Anthropic brand-guidelines skill.

| Skill | Upstream category |
|---|---|
| `social-content` | business-marketing |
| `content-creator` | business-marketing |
| `copywriting` | business-marketing |
| `copy-editing` | business-marketing |
| `marketing-ideas` | business-marketing |
| `marketing-psychology` | business-marketing |
| `launch-strategy` | business-marketing |
| `paid-ads` | business-marketing |
| `competitive-ads-extractor` | business-marketing |
| `content-research-writer` | business-marketing |
| `seo-audit` | business-marketing |
| `seo-fundamentals` | business-marketing |
| `schema-markup` | business-marketing |
| `marketing-strategy-pmm` | business-marketing |
| `marketing-demand-acquisition` | business-marketing |
| `analytics-tracking` | business-marketing |
| `ab-test-setup` | business-marketing |
| `page-cro` | business-marketing |
| `competitor-alternatives` | business-marketing |
| `brand-guidelines-community` | business-marketing |
| `x-twitter-scraper` | marketing |
| `meme-factory` | creative-design |
| `imagegen` | creative-design |
| `luma-imagegen` | creative-design |
| `theme-factory` | creative-design |
| `ui-design-system` | creative-design |
| `frontend-design` | creative-design |
| `premium-web-design` | creative-design |
| `executing-marketing-campaigns` | creative-design |
| `marp-slide` | creative-design |
| `excalidraw` | creative-design |
| `mermaid-diagrams` | creative-design |
| `remotion-best-practices` | creative-design |
| `transcribe` | media |
| `video-downloader` | media |
| `image-enhancer` | media |
| `speech` | media |
| `remotion` | video |
| `google-analytics` | analytics |

To add more from the catalog: `npx claude-code-templates@latest --skill <category>/<name>` or browse https://aitmpl.com.
