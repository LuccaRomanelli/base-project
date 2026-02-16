# Base Project Template

A reusable starter template for React + Supabase applications, optimized for development with Claude Code and a team of 10 specialized AI agents.

## Purpose

Starting new projects from scratch means re-establishing conventions, agent configurations, testing infrastructure, and development workflows each time. This template solves that by providing:

- **Complete Claude Code configuration** - 10 specialized agents, skills, and commands
- **Full starter kit** - Authentication, CRUD operations, admin panel
- **Testing infrastructure** - Unit, integration, and E2E tests with anti-flakiness patterns
- **TDD workflow** - Mandatory test-driven development loop
- **Devcontainer** - Reproducible development environment

## Tech Stack

| Category     | Technologies                                    |
| ------------ | ----------------------------------------------- |
| Frontend     | React 19, TypeScript 5.8, Vite 6                |
| Routing      | TanStack Router (file-based, type-safe)         |
| Server State | TanStack Query (caching, mutations)             |
| Forms        | TanStack Form + Zod (schema validation)         |
| Styling      | Tailwind CSS 4, clsx, lucide-react              |
| Backend      | Supabase (PostgreSQL, Auth, RLS, Realtime)      |
| Testing      | Vitest (unit), Playwright (E2E), testcontainers |

## Quick Start

```bash
# Install dependencies
bun install

# Start Supabase + Vite dev server
bun run dev:full

# Run tests
bun run test        # Unit tests
bun run test:e2e    # E2E tests
```

## Agent Team

| Agent               | Role                                      |
| ------------------- | ----------------------------------------- |
| software-architect  | Team lead, conventions, task coordination |
| tech-lead           | CI/CD, cross-stack debugging              |
| frontend-developer  | React components, TDD                     |
| test-specialist     | Unit/integration/E2E, anti-flaky          |
| supabase-backend    | Edge Functions, RLS, Auth                 |
| ui-ux-specialist    | Design, accessibility, responsive         |
| dba                 | PostgreSQL, migrations, indexes           |
| security-specialist | OWASP, vulnerability review (read-only)   |
| devils-advocate     | Challenges assumptions, finds weaknesses  |
| qa                  | Quality gate, final verification          |

## Skills & Commands

- `/dev` - Full developer workflow: understand, explore, plan, implement with TDD, review, and create PR
- `/start` - Kickoff a new feature (generates PRD, creates team, decomposes tasks)
- `/tdd` - Run the TDD loop for a feature
- `/create-pr` - Create a PR with test results and screenshots
- `/prd` - Generate a Product Requirements Document
- `/import-config` - Import this config into another project

## Import to New Project

To use this template in a new project:

```bash
# From your new project directory
claude "/import-config from /home/lcc/base-project"
```

This copies all agents, skills, commands, docs, and test infrastructure to your project.

## Project Structure

```
├── .claude/
│   ├── agents/        # 10 specialized AI agents
│   ├── commands/      # /tdd, /create-pr
│   ├── skills/        # /dev, /start, /prd, /import-config, /ralph
│   └── docs/          # Team workflow, TDD guide, testing conventions
├── src/
│   ├── components/    # React components (shared, auth, items, admin)
│   ├── routes/        # TanStack Router file-based routes
│   ├── services/      # Supabase client, DB operations, mappers
│   ├── hooks/         # useAuth, useItems
│   └── contexts/      # AuthContext
├── supabase/
│   ├── migrations/    # Database schema
│   └── seed.sql       # Test data
├── tests/
│   ├── unit/          # Vitest unit tests
│   ├── integration/   # Testcontainers integration tests
│   └── e2e/           # Playwright E2E tests
└── .devcontainer/     # VS Code devcontainer setup
```

## Development Workflow

This project enforces TDD (Test-Driven Development):

1. **Define** - Choose test level (unit/integration/E2E)
2. **Red** - Write failing test
3. **Green** - Implement minimum code
4. **Verify** - Run tests + typecheck + lint
5. **Refactor** - Clean up while keeping tests green
6. **Loop** - Repeat for next feature

See [CLAUDE.md](./CLAUDE.md) for complete development guidelines.

## License

MIT
