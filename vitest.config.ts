import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Scope to this project's own tests — the repo also carries several
    // installed Claude Code skills under .claude/skills/**, some of which
    // ship their own (non-Vitest) *.test.mjs files that would otherwise be
    // swept up by Vitest's default include glob.
    include: ["tests/**/*.test.ts"],
  },
});
