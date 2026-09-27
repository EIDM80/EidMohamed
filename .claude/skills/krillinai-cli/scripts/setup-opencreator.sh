#!/usr/bin/env bash
# Clone OpenCreator (upstream of the krillinai-* skills) and build the KrillinAI CLI.
#
# The skills in .claude/skills/krillinai-* only carry instructions; the CLI they
# drive lives in https://github.com/krillinai/OpenCreator (Apache-2.0).
#
# Requirements: git, node + pnpm (or node alone), Go, ffmpeg, ffprobe, yt-dlp.
#
# Usage:
#   bash .claude/skills/krillinai-cli/scripts/setup-opencreator.sh
#   OPENCREATOR_HOME=/path/to/OpenCreator bash .claude/skills/krillinai-cli/scripts/setup-opencreator.sh
set -euo pipefail

OPENCREATOR_HOME="${OPENCREATOR_HOME:-$HOME/OpenCreator}"
OPENCREATOR_REF="${OPENCREATOR_REF:-main}"

for bin in git node go; do
  command -v "$bin" >/dev/null || { echo "missing required tool: $bin" >&2; exit 1; }
done
for bin in ffmpeg ffprobe yt-dlp; do
  command -v "$bin" >/dev/null || echo "warning: $bin not found; subtitle/render stages will fail with error.kind=dependency" >&2
done

if [ ! -d "$OPENCREATOR_HOME/.git" ]; then
  git clone --depth 1 --branch "$OPENCREATOR_REF" https://github.com/krillinai/OpenCreator.git "$OPENCREATOR_HOME"
fi

cd "$OPENCREATOR_HOME"
node scripts/build-krillinai.mjs

CONFIG_DIR="$OPENCREATOR_HOME/runtime/krillinai/config"
if [ ! -f "$CONFIG_DIR/config.toml" ]; then
  cp "$CONFIG_DIR/config-example.toml" "$CONFIG_DIR/config.toml"
  echo "created $CONFIG_DIR/config.toml - add only the provider keys the stages you run need"
fi

TARGET="$(node -p "process.platform + '-' + process.arch")"
SUFFIX="$(node -p "process.platform === 'win32' ? '.exe' : ''")"
CLI="$OPENCREATOR_HOME/.runtime/build/krillinai/$TARGET/bin/krillinai-cli$SUFFIX"
test -f "$CLI"

cat <<EOF

KrillinAI CLI ready. Export these before using the krillinai-* skills:

  export OPENCREATOR_HOME="$OPENCREATOR_HOME"
  export KRILLINAI_CLI="$CLI"
  export KRILLINAI_CWD="$OPENCREATOR_HOME/runtime/krillinai"
EOF
