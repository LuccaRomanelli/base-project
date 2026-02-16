# Base Project - Development Guide

## Build & Development Commands

```bash
bun run dev              # Vite dev server (port 5173)
bun run dev:full         # Start Supabase + Vite (recommended)
bun run dev:stop         # Stop Supabase
bun run build            # TypeScript check + production build
bun run typecheck        # Type-check without emitting
bun run lint             # ESLint check
bun run lint:fix         # ESLint auto-fix
bun run format           # Prettier format all files
bun run format:check     # Prettier check formatting
bun run test             # Vitest unit tests (single run)
bun run test:watch       # Vitest watch mode
bun run test:coverage    # Unit tests with coverage
bun run test:integration # Integration tests (testcontainers)
bun run test:e2e         # Playwright E2E tests
bun run test:e2e:ui      # Playwright interactive UI
bun run test:e2e:debug   # Playwright step-through debug
bun run db:reset         # Reset local Supabase database
bun run db:types         # Generate TypeScript types from schema
bun run db:studio        # Open Supabase Studio (port 54323)
bun run deploy           # Full production deploy
```

## TDD Workflow (MANDATORY)

Every feature MUST follow this 6-step loop:

### 1. Define Verification Method

Choose the right test level:

- **Unit**: Pure logic, utils, mappers, validators → `tests/unit/`
- **Integration**: Service + DB interactions → `tests/integration/`
- **E2E**: User-facing flows through UI → `tests/e2e/specs/`

### 2. Write Failing Test (RED)

Write a test that describes the expected behavior. Run it and confirm it fails.

### 3. Implement Minimum Code (GREEN)

Write the minimum code to make the test pass. No more, no less.

### 4. Verify

```bash
bun run test          # Unit tests pass
bun run typecheck     # Types are correct
bun run lint          # Code is clean
```

### 5. Refactor

Clean up while keeping tests green. Improve naming, extract patterns, remove duplication.

### 6. Loop

Go back to step 1 for the next piece of functionality.

## Developer Workflow (`/dev`)

The `/dev` skill is the primary way to implement features end-to-end. It orchestrates the full workflow from free-text description to merged PR using specialist agent teams.

### Usage

```
/dev Add a search bar to the items page
```

### 6 Phases with Developer Gates

Every phase has a confirmation gate — the workflow never proceeds without explicit developer approval.

1. **UNDERSTAND** — Parse input into structured summary (feature, affected layers, assumptions). Developer confirms scope and chooses level (MVP / Full / Backend only / UI only).
2. **CODEBASE EXPLORATION** — Spawn research agents to map affected files, find reusable code, and identify patterns. Developer confirms scope report.
3. **PLAN & TEAM DESIGN** — Select specialist agents based on affected layers, write a task contract to `tasks/plans/<slug>-contract.md` with dependency-ordered tasks. Developer approves the plan.
4. **IMPLEMENTATION** — Create feature branch, spawn agent team, execute tasks with TDD in dependency order (Level 0 parallel → Level 1 → ...). Run full verification. Developer confirms results.
5. **CODE REVIEW** — Spawn QA + security-specialist + devils-advocate in parallel. Fix must-fix items. Developer approves review results.
6. **PR CREATION** — Commit, push, create PR with full documentation (changes by layer, test results, review results). Developer confirms completion.

### Agent Selection

Agents are selected based on which layers the feature touches:

- Database schema → `dba`
- RLS policies / services / mappers → `supabase-backend`
- Components / routes / hooks → `frontend-developer`
- Styling / accessibility → `ui-ux-specialist`
- Tests → `test-specialist`
- Cross-stack issues → `tech-lead`
- Always in review: `qa`, `security-specialist`, `devils-advocate`

## Architecture Overview

### Tech Stack

- **Frontend**: React 19 + TypeScript 5.8 + Vite 6
- **Routing**: TanStack Router (file-based, type-safe)
- **Server State**: TanStack Query (caching, mutations)
- **Forms**: TanStack Form + Zod (schema validation)
- **Styling**: Tailwind CSS 4 + clsx
- **Icons**: lucide-react
- **Dates**: date-fns
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Realtime + Storage)
- **Testing**: Vitest (unit) + Playwright (E2E)

### Core Layers

```
src/
├── main.tsx              # Entry point with providers
├── index.css             # Tailwind imports
├── types.ts              # App-level TypeScript interfaces
├── types/supabase.ts     # Auto-generated DB types (bun run db:types)
├── lib/validators.ts     # Zod schemas for shared validation
├── services/
│   ├── supabase.ts       # Supabase client initialization
│   ├── db/               # Database operations by domain
│   │   ├── user.ts       # User CRUD operations
│   │   └── item.ts       # Item CRUD operations
│   └── mappers/          # Type converters (DB ↔ App)
│       ├── userMapper.ts # snake_case ↔ camelCase for users
│       └── itemMapper.ts # snake_case ↔ camelCase for items
├── hooks/
│   ├── useAuth.ts        # Auth context consumer hook
│   └── useItems.ts       # TanStack Query hooks for items
├── contexts/
│   └── AuthContext.tsx    # Auth state with Supabase session
├── components/
│   ├── shared/           # Reusable UI (Button, Input, Card, Layout, ProtectedRoute)
│   ├── auth/             # Auth forms (Login, Signup)
│   ├── items/            # Item components (List, Card, Form)
│   └── admin/            # Admin panel
└── routes/               # TanStack Router file-based routes
    ├── __root.tsx         # Root layout
    ├── index.tsx          # Home page
    ├── login.tsx          # Login page
    ├── signup.tsx         # Signup page
    ├── dashboard.tsx      # Protected dashboard
    ├── admin.tsx          # Admin-only page
    └── items/             # CRUD routes
        ├── index.tsx      # Item list
        ├── $itemId.tsx    # Item detail/edit
        └── new.tsx        # Create item
```

## Key Patterns

### Type Mapping (DB ↔ App)

Database uses `snake_case`, app uses `camelCase`. Mappers handle conversion:

```typescript
// services/mappers/itemMapper.ts
mapItemFromDb(dbItem); // DB row → App type
mapItemToDb(appItem); // App type → DB fields
```

### Path Alias

`@/*` maps to `src/*`. Always use `@/` imports:

```typescript
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
```

### TanStack Router File Routes

Routes are in `src/routes/`. The route tree is auto-generated by the Vite plugin.

- `__root.tsx` - Root layout (wraps all pages)
- `index.tsx` - Home page (`/`)
- `$paramName.tsx` - Dynamic params (`/items/:itemId`)
- `items/index.tsx` - Nested index (`/items`)

### TanStack Query Patterns

```typescript
// Queries - read data with caching
const { data, isLoading, error } = useQuery({
  queryKey: ['items'],
  queryFn: getItems,
});

// Mutations - write data with cache invalidation
const mutation = useMutation({
  mutationFn: createItem,
  onSuccess: () => {
    void queryClient.invalidateQueries({ queryKey: ['items'] });
  },
});
```

### TanStack Form + Zod Validation

```typescript
const form = useForm({
  defaultValues: { title: '', description: '' },
  validatorAdapter: zodValidator(),
  validators: { onChange: itemSchema },
  onSubmit: async ({ value }) => {
    /* handle submit */
  },
});
```

## Type Safety

### Rules

1. **No `any`** - ESLint enforces `@typescript-eslint/no-explicit-any: error`
2. **Strict mode** - `tsconfig.json` has `strict: true`, `noUncheckedIndexedAccess: true`
3. **DB types** - Always regenerate after schema changes: `bun run db:types`
4. **Zod schemas** - Validate at system boundaries (forms, API responses)

### DB Types vs App Types

- `src/types/supabase.ts` - Auto-generated from database schema (snake_case)
- `src/types.ts` - App-level interfaces (camelCase)
- Never use DB types directly in components — always map through services/mappers

## Testing Rules

### When to Use Each Level

| Level       | When                                | Location             | Command                    |
| ----------- | ----------------------------------- | -------------------- | -------------------------- |
| Unit        | Pure logic, utils, mappers          | `tests/unit/`        | `bun run test`             |
| Integration | Service + DB, complex queries       | `tests/integration/` | `bun run test:integration` |
| E2E         | User flows, multi-page interactions | `tests/e2e/specs/`   | `bun run test:e2e`         |

### E2E Test Structure

```
tests/e2e/
├── global-setup.ts        # DB reset before all tests
├── fixtures/
│   ├── base-test.ts       # Extended test with anti-flake
│   ├── auth.fixture.ts    # Test user credentials
│   ├── database.fixture.ts # DB utilities
│   └── index.ts           # Central exports
├── helpers/
│   ├── db-utils.ts        # Direct DB verification
│   └── test-utils.ts      # Common test utilities
├── pages/                 # Page Object Models
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   └── items.page.ts
└── specs/                 # Test specs
    ├── auth/
    ├── items/
    └── admin/
```

## Anti-Flakiness Rules (10 Rules)

1. **Never use fixed timeouts** - Use `waitFor`, `waitForURL`, `waitForResponse` instead of `page.waitForTimeout()`
2. **Use semantic selectors** - Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
3. **Clear state in beforeEach** - Always clear auth tokens and relevant state before each test
4. **Wait for navigation** - Use `page.waitForURL()` after actions that navigate
5. **Wait for network** - Use `page.waitForResponse()` for API calls
6. **Isolate tests** - Each test must work independently, never depend on test ordering
7. **Use Page Object Models** - Encapsulate page interactions in POM classes
8. **Handle loading states** - Wait for spinners to disappear before asserting
9. **Use test fixtures** - Centralize test data and utilities in fixtures/
10. **Retry on CI only** - Set `retries: 2` in CI, `retries: 0` in dev

## Code Quality

### ESLint (Flat Config)

- typescript-eslint strict
- react-hooks (exhaustive deps)
- react-refresh (export validation)
- prettier (formatting)
- No `any`, no unused vars (except `_` prefix)

### Prettier

- Single quotes, semicolons, trailing commas
- 100 char line width, 2-space indent

### Import Conventions

```typescript
// 1. External packages
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal (using @/ alias)
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import type { Item } from '@/types';
```

## Git Workflow

### GitHub Flow

- `main` branch is always deployable
- Feature branches: `feat/[task-name]`, `fix/[bug-name]`, `refactor/[scope]`
- PRs required before merging to main

### Conventional Commits

Format: `type: description`

- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Build, deps, config
- `refactor:` - Code restructuring
- `test:` - Adding/updating tests
- `docs:` - Documentation

Enforced by commitlint via Husky commit-msg hook.

### Hooks

- **Pre-commit**: lint-staged (ESLint + Prettier on staged files)
- **Pre-push**: `bun run typecheck`
- **Commit-msg**: commitlint (conventional commits)

**IMPORTANT**: Never use `--no-verify` to skip hooks. All commits must pass pre-commit, commit-msg, and pre-push hooks. If a hook fails, fix the underlying issue instead of bypassing it.

### PR Creation

PRs include:

- Summary of changes
- Test results (unit + E2E pass/fail)
- Screenshots from Playwright E2E tests
- Acceptance criteria checklist

## Team Coordination

### Smart Agent Selection

The software-architect analyzes each feature and spawns only the agents needed:

- Schema changes → `dba` + `supabase-backend`
- UI work → `frontend-developer` + `ui-ux-specialist`
- Security concerns → `security-specialist` (read-only review)
- Complex features → `tech-lead` for cross-stack debugging
- Quality gate → `qa` runs final checks before PR

### Parallel Execution

Independent tasks run in parallel to maximize efficiency:

1. **Spawn in single message**: Multiple Task tool calls = parallel execution
2. **No shared context**: Each agent reads from files, not memory
3. **File-based handoff**: Results written to files, not passed in messages
4. **Orchestrator monitors**: software-architect tracks TaskList for completion

Dependent tasks are ordered: schema → backend → frontend → tests → QA.

### Message Efficiency

Keep messages small to avoid context exhaustion:

- Reference files by path instead of copying content
- Use task IDs instead of full descriptions
- Let agents read CLAUDE.md for conventions (don't repeat)

### Communication

Agents communicate through the task list and direct messages.
The software-architect is always the team lead and coordinates.
