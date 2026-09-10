---
name: "markitdown"
title: Convert documents to Markdown (MarkItDown)
description: "Use this skill when a file needs converting to clean Markdown for LLM ingestion or reading — PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx/.xls), Outlook messages, images (EXIF + OCR), audio (EXIF + speech transcription), HTML, CSV/JSON/XML, ZIP archives, EPubs, or a YouTube URL. Triggers on \"convert this PDF/DOCX/PPTX/XLSX to markdown\", \"extract text from this document\", \"turn this into markdown\", \"summarize this PDF\" (convert first, then read), or any need to feed a non-text file into an LLM context as structured Markdown. Wraps microsoft/markitdown (MIT-licensed Python CLI/library) — not itself a packaged Claude skill, no SKILL.md upstream, so this skill documents install + usage. Do NOT use for editing/writing back to Office formats (use the docx/pptx/xlsx skills for that) — MarkItDown is one-way, source-format-to-Markdown only."
category: Reference
---

# MarkItDown

Converts files to Markdown while preserving structure (headings, lists, tables, links) — built for feeding documents into LLMs. Source: [microsoft/markitdown](https://github.com/microsoft/markitdown), MIT license.

This is a real Python package, not just reference material — check it's installed before using it: `python3 -c "import markitdown"` or `markitdown --help`. If missing, install per below (needs network access to PyPI, which this environment's proxy allows).

## Install

```bash
pip install 'markitdown[all]'          # everything
pip install 'markitdown[pdf,docx,pptx]' # only what you need
```

| Extra | Covers |
|---|---|
| `all` | every optional dependency below |
| `pdf` | PDF files |
| `docx` | Word files |
| `pptx` | PowerPoint files |
| `xlsx` | Excel files (modern) |
| `xls` | Excel files (legacy) |
| `outlook` | Outlook `.msg` messages |
| `audio-transcription` | WAV/MP3 speech-to-text |
| `youtube-transcription` | YouTube video transcripts |
| `az-doc-intel` | Azure Document Intelligence backend |
| `az-content-understanding` | Azure Content Understanding backend |

## CLI usage

```bash
markitdown path-to-file.pdf -o document.md
markitdown path-to-file.pdf > document.md
cat path-to-file.pdf | markitdown          # stdin works too

# Azure Document Intelligence backend (better PDF/scan fidelity, needs an Azure resource)
export MARKITDOWN_DOCINTEL_ENDPOINT="<endpoint>"
markitdown path-to-file.pdf -o document.md -d

# Azure Content Understanding backend
export MARKITDOWN_CU_ENDPOINT="<endpoint>"
markitdown path-to-file.pdf --use-cu

# Plugins (disabled by default; search GitHub for #markitdown-plugin)
markitdown --list-plugins
markitdown --use-plugins path-to-file.pdf
```

## Python API

```python
from markitdown import MarkItDown

md = MarkItDown(enable_plugins=False)
result = md.convert("test.xlsx")
print(result.markdown)

# Optional: let an LLM write alt-text/descriptions for embedded images
from openai import OpenAI
md = MarkItDown(llm_client=OpenAI(), llm_model="gpt-4o")
result = md.convert("example.jpg")
```

## Docker

```bash
docker build -t markitdown:latest .
docker run --rm -i markitdown:latest < ~/your-file.pdf > output.md
```

## MCP server (`markitdown-mcp`)

A separate `markitdown-mcp` package in the same repo exposes MarkItDown as an MCP server for Claude Desktop and other MCP clients, so conversion can run as a tool call instead of a shell command — check `packages/markitdown-mcp` in the repo for current install/run instructions before relying on exact flags, since they weren't pinned down during inspection.

## How to use this in practice

1. Check the file extension against the extras table — install only what's needed rather than `[all]` if this is a one-off.
2. Run the CLI (fastest for a single file) or the Python API (when chaining into other processing).
3. For scanned/complex PDFs where plain extraction reads poorly, mention the Azure Document Intelligence option rather than fighting the default OCR.
4. This is one-way (source → Markdown). If the task is editing an Office file and saving it back in its original format, use the docx/pptx/xlsx skills instead — not this one.
