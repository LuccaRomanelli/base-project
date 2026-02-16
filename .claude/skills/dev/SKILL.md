---
name: dev
description: 'Full developer workflow: understand requirements, explore codebase, plan with specialist agent team, implement with TDD, review, and create PR. Triggers on: /dev, develop this, implement this feature, build this.'
user-invocable: true
---

# Developer Workflow

Orchestrate a full feature implementation from free-text description to merged PR using specialist agent teams.

## Input

$ARGUMENTS — Free-text description of what to build (e.g., "Add a search bar to the items page")

---

## Phase 1: UNDERSTAND

**Goal:** Parse the free-text input into a structured understanding. Get developer confirmation before proceeding.

### Steps

1. Read CLAUDE.md to load project conventions
2. Parse `$ARGUMENTS` into a structured summary:

```
Feature: [one-line title]
Description: [2-3 sentences explaining what this does]
Affected Layers:
  - [ ] Database (schema/migrations)
  - [ ] RLS Policies
  - [ ] Backend Services (services/db/)
  - [ ] Type Mappers (services/mappers/)
  - [ ] Hooks (hooks/)
  - [ ] Components (components/)
  - [ ] Routes (routes/)
  - [ ] Tests (unit/integration/E2E)
Initial Assumptions:
  - [list any assumptions about scope, behavior, or constraints]
```

3. Present this summary to the developer using AskUserQuestion:

```json
{
  "questions": [
    {
      "question": "Does this summary capture what you want to build?",
      "header": "Confirm scope",
      "options": [
        {
          "label": "Yes, proceed",
          "description": "Summary is accurate, move to codebase exploration"
        },
        { "label": "Needs changes", "description": "I'll provide corrections in a follow-up" }
      ],
      "multiSelect": false
    },
    {
      "question": "What scope level do you want?",
      "header": "Scope",
      "options": [
        { "label": "MVP", "description": "Minimum viable — core functionality only" },
        { "label": "Full feature", "description": "Complete implementation with all edge cases" },
        { "label": "Backend only", "description": "Database + services, no UI" },
        { "label": "UI only", "description": "Components + routes, mock data" }
      ],
      "multiSelect": false
    }
  ]
}
```

**GATE 1:** Do NOT proceed until the developer confirms the summary is correct.

---

## Phase 2: CODEBASE EXPLORATION

**Goal:** Find all affected files, existing patterns, and reusable code. Get developer confirmation on scope.

### Steps

1. Spawn 2 general-purpose research agents in parallel:

**Agent 1: Structure Scout**

- Map which directories/files will be affected
- Find existing components, hooks, services that can be reused
- Identify the closest existing feature to use as a pattern

**Agent 2: Pattern Detector**

- Find naming conventions in affected areas
- Identify test patterns for similar features
- Check for existing Zod schemas, types, or validators that relate

2. Compile findings into a scope report:

```
Affected Files (existing):
  - src/services/db/item.ts — extend with new query
  - src/components/items/ItemList.tsx — add search input
  - ...

Reusable Code:
  - src/components/shared/Input.tsx — use for search field
  - src/hooks/useItems.ts — extend with search param
  - ...

Patterns to Follow:
  - Query pattern: see src/hooks/useItems.ts lines X-Y
  - Component pattern: see src/components/items/ItemCard.tsx
  - ...

New Files Needed:
  - src/components/items/SearchBar.tsx
  - tests/unit/searchUtils.test.ts
  - ...
```

3. Present scope report to the developer using AskUserQuestion:

```json
{
  "questions": [
    {
      "question": "Does this scope look correct? Any files to add or remove?",
      "header": "Confirm files",
      "options": [
        { "label": "Scope is correct", "description": "Proceed to planning" },
        { "label": "Needs adjustment", "description": "I'll specify what to change" }
      ],
      "multiSelect": false
    }
  ]
}
```

**GATE 2:** Do NOT proceed until the developer confirms the scope.

---

## Phase 3: PLAN & TEAM DESIGN

**Goal:** Select the right specialist agents, write a task contract, and get developer approval.

### Agent Selection Rules

Select agents based on which layers are affected:

| Layer             | Agent                | When to Include                            |
| ----------------- | -------------------- | ------------------------------------------ |
| Database schema   | `dba`                | Schema changes, migrations, indexes        |
| RLS policies      | `supabase-backend`   | New tables, policy changes, Edge Functions |
| Backend services  | `supabase-backend`   | services/db/, API logic                    |
| Type mappers      | `supabase-backend`   | New DB-to-App type mappings                |
| Components        | `frontend-developer` | New/modified React components              |
| Routes            | `frontend-developer` | New/modified TanStack Router routes        |
| Hooks             | `frontend-developer` | New/modified TanStack Query hooks          |
| Styling/UX        | `ui-ux-specialist`   | Complex layouts, responsive, accessibility |
| Unit tests        | `test-specialist`    | Complex test setups, test utilities        |
| E2E tests         | `test-specialist`    | Playwright specs, page objects             |
| Cross-stack debug | `tech-lead`          | Integration issues, CI/CD problems         |

**Always included in Phase 5:**

- `qa` — Final quality gate
- `security-specialist` — Security review (read-only)
- `devils-advocate` — Challenge assumptions

### Task Contract

Write the contract to `tasks/plans/<slug>-contract.md`:

```markdown
# Contract: <Feature Title>

## Summary

<2-3 sentences>

## Scope Level

<MVP | Full | Backend only | UI only>

## Team

| Agent              | Responsibilities                    |
| ------------------ | ----------------------------------- |
| dba                | Create migration for X table        |
| supabase-backend   | RLS policies + service functions    |
| frontend-developer | SearchBar component + route updates |
| test-specialist    | Unit tests + E2E specs              |

## Tasks (ordered by dependency)

### Level 0 — No dependencies (parallel)

- [ ] T1: [dba] Create migration for search index
- [ ] T2: [test-specialist] Write failing E2E for search flow
- [ ] T3: [ui-ux-specialist] Design search bar layout

### Level 1 — Depends on Level 0

- [ ] T4: [supabase-backend] RLS + service layer (blocked by T1)
- [ ] T5: [frontend-developer] SearchBar component (blocked by T3)

### Level 2 — Depends on Level 1

- [ ] T6: [frontend-developer] Integrate search with API (blocked by T4, T5)

### Level 3 — Final

- [ ] T7: [qa] Full verification (blocked by T6)

## Key Rules

- TDD mandatory for all implementation tasks (use /tdd command)
- No `any` in TypeScript
- Supabase RLS required on every new table
- auth.uid() for user scoping
- Type mappers required (snake_case DB -> camelCase app)
- No editing existing migrations — create new ones
- Run `bun run db:types` after schema changes
- Use `@/` import alias everywhere
- All code must pass: `bun run lint && bun run typecheck && bun run test`

## Verification Commands

bun run lint # ESLint
bun run typecheck # TypeScript strict
bun run test # Vitest unit tests
bun run test:e2e # Playwright E2E tests
bun run build # Production build
```

Present the contract to the developer:

```json
{
  "questions": [
    {
      "question": "Review the task contract at tasks/plans/<slug>-contract.md. Ready to start implementation?",
      "header": "Approve plan",
      "options": [
        {
          "label": "Approved — start building",
          "description": "Create branch, team, and begin implementation"
        },
        { "label": "Needs changes", "description": "I'll provide feedback on the plan" }
      ],
      "multiSelect": false
    }
  ]
}
```

**GATE 3:** Do NOT proceed until the developer approves the contract.

---

## Phase 4: IMPLEMENTATION

**Goal:** Create branch, spawn specialist team, execute tasks with TDD.

### Steps

1. **Create feature branch:**

```bash
git checkout -b feat/<slug>
```

2. **Create the tasks/ directory if needed:**

```bash
mkdir -p tasks/plans
```

3. **Create team:**

```
TeamCreate: dev-<slug>
```

4. **Create all tasks with dependencies** using TaskCreate. Set up `blockedBy` relationships matching the contract levels.

5. **Spawn Level 0 agents in parallel** (single message, multiple Task tool calls):

Each agent receives:

- Their task description from the contract
- Path to the contract file for full context
- Instruction to follow TDD (reference /tdd command)
- Instruction to read CLAUDE.md for conventions

6. **Monitor and coordinate:**

- Watch TaskList for completed tasks
- When a level completes, spawn the next level's agents
- Unblock stuck agents by providing guidance
- Escalate to tech-lead for cross-stack issues

7. **After all implementation tasks complete, run full verification:**

```bash
bun run lint && bun run typecheck && bun run test && bun run build
```

Fix any failures before proceeding.

**GATE 4:** Present verification results to the developer:

```json
{
  "questions": [
    {
      "question": "Implementation complete. All checks pass. Ready for code review?",
      "header": "Review gate",
      "options": [
        { "label": "Start review", "description": "Spawn QA + security + devil's advocate" },
        { "label": "Hold — let me check", "description": "I want to manually review first" }
      ],
      "multiSelect": false
    }
  ]
}
```

---

## Phase 5: CODE REVIEW

**Goal:** Automated review by QA, security, and devil's advocate. Fix must-fix items.

### Steps

1. **Spawn 3 review agents in parallel:**

**Agent: qa**

- Run full test suite (unit + E2E)
- Verify all acceptance criteria from the contract
- Check for flaky tests, missing edge cases
- Report: PASS/FAIL with details

**Agent: security-specialist** (read-only)

- Review new RLS policies
- Check for SQL injection, XSS, OWASP top 10
- Verify auth.uid() scoping
- Report: findings with severity (must-fix / should-fix / note)

**Agent: devils-advocate**

- Challenge architectural decisions
- Identify potential performance issues
- Question edge cases and failure modes
- Report: concerns with priority

2. **Compile review results:**

```
Review Summary:
  QA: PASS | FAIL
    - [details]
  Security: X must-fix, Y should-fix, Z notes
    - [findings]
  Devil's Advocate: X concerns
    - [concerns]

Must-Fix Items (blocking PR):
  1. [item]
  2. [item]

Should-Fix Items (non-blocking):
  1. [item]
```

3. **Fix must-fix items** — spawn appropriate agents to fix blocking issues.

4. **Re-run verification** after fixes:

```bash
bun run lint && bun run typecheck && bun run test && bun run build
```

5. Present review results to developer:

```json
{
  "questions": [
    {
      "question": "Code review complete. See review summary above. Ready to create PR?",
      "header": "Approve review",
      "options": [
        { "label": "Create PR", "description": "All issues resolved, create the pull request" },
        { "label": "Fix more items", "description": "Address should-fix items before PR" },
        { "label": "Cancel", "description": "Stop here, I'll handle the rest" }
      ],
      "multiSelect": false
    }
  ]
}
```

**GATE 5:** Do NOT create PR until the developer approves.

---

## Phase 6: PR CREATION

**Goal:** Commit, push, and create a well-documented PR.

### Steps

1. **Stage and commit:**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: <feature description>

<detailed summary of changes>

Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>
EOF
)"
```

2. **Push branch:**

```bash
git push -u origin feat/<slug>
```

3. **Create PR:**

```bash
gh pr create --title "feat: <title>" --body "$(cat <<'EOF'
## Summary
- <bullet points of what changed>

## Changes by Layer
- **Database:** <migration details or "No changes">
- **RLS Policies:** <policy details or "No changes">
- **Services:** <service changes or "No changes">
- **Components:** <component changes or "No changes">
- **Routes:** <route changes or "No changes">
- **Tests:** <test details>

## Test Results
- Unit tests: X passed, 0 failed
- E2E tests: X passed, 0 failed
- Typecheck: passed
- Lint: passed
- Build: passed

## Review Results
- QA: PASS
- Security: No must-fix items
- Devil's Advocate: Concerns addressed

## Task Contract
See `tasks/plans/<slug>-contract.md` for full implementation plan.

---
Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)
EOF
)"
```

4. **Shut down the team:**

Send `shutdown_request` to all team members, then:

```
TeamDelete
```

5. **Report PR URL to developer.**

**GATE 6:** Present the PR URL:

```json
{
  "questions": [
    {
      "question": "PR created: <URL>. Anything else to do?",
      "header": "Complete",
      "options": [
        { "label": "Done", "description": "Feature workflow complete" },
        { "label": "Another feature", "description": "Start a new /dev workflow" }
      ],
      "multiSelect": false
    }
  ]
}
```

---

## Critical Rules (Enforced in All Phases)

1. **6 developer gates** — NEVER skip a confirmation gate. Each gate requires explicit "proceed" from the developer.
2. **TDD mandatory** — Every implementation task uses the TDD loop. No production code without tests.
3. **No `any`** — TypeScript strict mode. Zero `any` types allowed.
4. **RLS on every table** — Supabase Row Level Security required. Use `auth.uid()` for user scoping.
5. **Type mappers required** — Database snake_case maps to app camelCase through `services/mappers/`.
6. **No editing existing migrations** — Always create new migration files.
7. **`bun run db:types` after schema changes** — Regenerate TypeScript types from database.
8. **`@/` import alias** — All internal imports use the path alias.
9. **Conventional commits** — `feat:`, `fix:`, `chore:`, etc.
10. **Never `--no-verify`** — All git hooks must pass. Fix issues, don't skip hooks.
11. **Package manager is `bun`** — Use `bun run`, `bunx`, `bun install`. Never `npm` or `npx`.

---

## Error Recovery

- **Agent fails or gets stuck:** Reassign task to a fresh agent with additional context about what went wrong.
- **Tests fail after implementation:** Fix the code, not the test (unless the test is wrong). Re-run full verification.
- **Developer rejects a gate:** Ask what needs to change, adjust, and re-present the gate.
- **Merge conflict on branch:** Rebase onto main (`git rebase main`), resolve conflicts, re-run verification.
- **Hook failure on commit:** Fix the issue (lint, types, etc.), stage fixes, create a new commit. Never amend or skip hooks.
