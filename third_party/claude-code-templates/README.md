# claude-code-templates (vendored, sanitized)

Source: https://github.com/davila7/claude-code-templates (MIT, see `LICENSE`), upstream commit `42886b2`.
Some skills carry their own `LICENSE.txt` inside their folder (for example the Anthropic-authored ones).

Everything under `cli-tool/components/{skills,agents,commands}` is installed:

| Component | Source | Installed to |
|---|---|---|
| 913 skills | `skills/**/SKILL.md` | `.claude/skills/<name>/` (flattened; nested skills get their own folder) |
| 423 agents | `agents/<category>/*.md` | `.claude/agents/<name>.md` |
| 348 commands | `commands/**.md` | `.claude/commands/<category>/...` (invoked as `/category:name`) |

`manifest.json` lists every item, its source path, and the name it was installed under.

## Safety changes from upstream

- **`allowed-tools` removed** from every skill, agent and command frontmatter (380 files). Upstream, many of
  them pre-approved `Bash` (one granted `Bash(*)`), so tools ran without asking. Now every tool use goes
  through the normal permission prompt. Agents keep their `tools:` field, which only limits what they can use.
- **`hooks` removed** from frontmatter (4 files: `gh-address-comments`, `git-commit-helper`,
  `planning-with-files`, and the `read-only-auditor` agent). Nothing runs automatically on tool use or session
  events. `read-only-auditor` is still limited to Read, Grep and Glob by its `tools:` field.
- The security category (penetration-testing skills and agents) is included as upstream ships it; use it only
  for authorized testing.
- Many skills need their own API keys or CLIs (OpenAI, Luma, Railway, Supabase, Datadog, and others).
- 221 files have frontmatter that strict YAML parsers reject (unquoted colons in descriptions). This is the
  same in upstream, and Claude Code still loads them.

## Name clashes

When a name was already taken (by a skill already in this repo, or by another catalog category), the item was
installed as `<name>-<category>` and its frontmatter `name:` updated. Items identical to one already installed
were skipped (`already-present` / `duplicate-skipped` in the manifest). `brand-guidelines-community` was renamed
from `brand-guidelines`.

## Reinstall or update

```bash
git clone --depth 1 https://github.com/davila7/claude-code-templates.git /tmp/cct
python3 third_party/claude-code-templates/install.py /tmp/cct          # installs and sanitizes
python3 third_party/claude-code-templates/install.py --sanitize-only  # re-strip permissions/hooks
```
