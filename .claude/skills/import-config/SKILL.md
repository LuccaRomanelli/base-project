---
name: import-config
description: "Import the base project's Claude Code configuration into another project. Copies agents, skills, commands, docs, test infrastructure, and merges dependencies. Triggers on: import config, setup project, copy base config."
user-invocable: true
---

# Import Config

Copy the base project's Claude Code configuration to a target project.

## Usage

When invoked, ask for the target project path using AskUserQuestion.

## What Gets Copied

### 1. Claude Code Config

- `.claude/agents/` — All 10 agent definitions
- `.claude/commands/` — TDD and PR commands
- `.claude/skills/` — Start, import-config, PRD skills
- `.claude/docs/` — Testing conventions, TDD workflow, team workflow

### 2. Documentation

- `CLAUDE.md` — Master development guide
- `RALPH.md` — Ralph autonomous agent instructions
- `ralph.sh` — Ralph loop runner

### 3. Test Infrastructure

- `tests/` — Unit, integration, E2E test structure
- `vitest.config.ts` + `vitest.integration.config.ts`
- `playwright.config.ts`
- Test fixtures, helpers, and page objects

### 4. Dev Dependencies (Merged)

Merge these into the target's `package.json` devDependencies:

- Testing: vitest, playwright, testing-library
- Linting: eslint, prettier, typescript-eslint
- Git hooks: husky, lint-staged, commitlint

### 5. Config Files

- `.mcp.json` — Playwright MCP server
- `mise.toml` — Node version
- Husky hooks (pre-commit, pre-push, commit-msg)
- ESLint, Prettier, Commitlint configs

### 6. Devcontainer (Optional)

If user wants devcontainer:

- `.devcontainer/` — Dockerfile, compose, scripts

## Implementation

```bash
# Copy directories
cp -r /home/lcc/base-project/.claude/agents/ TARGET/.claude/agents/
cp -r /home/lcc/base-project/.claude/commands/ TARGET/.claude/commands/
cp -r /home/lcc/base-project/.claude/skills/ TARGET/.claude/skills/
cp -r /home/lcc/base-project/.claude/docs/ TARGET/.claude/docs/
cp -r /home/lcc/base-project/tests/ TARGET/tests/

# Copy files
cp /home/lcc/base-project/CLAUDE.md TARGET/
cp /home/lcc/base-project/RALPH.md TARGET/
cp /home/lcc/base-project/ralph.sh TARGET/
cp /home/lcc/base-project/.mcp.json TARGET/
cp /home/lcc/base-project/mise.toml TARGET/
cp /home/lcc/base-project/vitest.config.ts TARGET/
cp /home/lcc/base-project/vitest.integration.config.ts TARGET/
cp /home/lcc/base-project/playwright.config.ts TARGET/

# Copy config files
cp /home/lcc/base-project/eslint.config.js TARGET/
cp /home/lcc/base-project/.prettierrc TARGET/
cp /home/lcc/base-project/commitlint.config.js TARGET/
cp /home/lcc/base-project/.lintstagedrc.json TARGET/
cp -r /home/lcc/base-project/.husky/ TARGET/.husky/

# Merge package.json devDependencies
# (use jq or manual merge)
```

After copying, run:

```bash
cd TARGET && bun install && bunx husky
```
