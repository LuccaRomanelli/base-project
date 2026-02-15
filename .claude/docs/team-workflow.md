# Team Workflow

## Agent Roles

| Agent               | Model  | Responsibility                            |
| ------------------- | ------ | ----------------------------------------- |
| software-architect  | opus   | Team lead, conventions, task coordination |
| tech-lead           | opus   | CI/CD, cross-stack debugging              |
| frontend-developer  | sonnet | React components, TDD                     |
| test-specialist     | sonnet | Unit/integration/E2E, anti-flaky          |
| supabase-backend    | sonnet | Edge Functions, RLS, Auth                 |
| ui-ux-specialist    | sonnet | Design, accessibility, responsive         |
| dba                 | sonnet | PostgreSQL, migrations, indexes           |
| security-specialist | sonnet | OWASP, vulnerability review (READ-ONLY)   |
| devils-advocate     | opus   | Challenges assumptions, finds weaknesses  |
| qa                  | sonnet | Quality gate, final verification          |

## Smart Agent Selection

The software-architect analyzes each feature request and spawns only needed agents:

### Schema Change

→ `dba` (migration) + `supabase-backend` (RLS policies)

### UI Feature

→ `frontend-developer` (implementation) + `ui-ux-specialist` (design review)

### Full-Stack Feature

→ `dba` + `supabase-backend` + `frontend-developer` + `test-specialist`

### Security Review

→ `security-specialist` (read-only audit)

### Quality Gate

→ `qa` (runs all checks, creates PR)

## Task Flow

1. **PRD Created** → `/prd` skill generates requirements
2. **Tasks Decomposed** → Software-architect breaks PRD into tasks
3. **Agents Spawned** → Only needed agents are created
4. **Parallel Execution** → Independent tasks run simultaneously
5. **Quality Gate** → QA agent verifies all checks pass
6. **PR Created** → QA creates PR with test results + screenshots

## Communication

- Agents communicate via task list and direct messages
- Software-architect monitors progress and reassigns as needed
- Blocking issues are escalated to tech-lead
- Devils-advocate reviews architectural decisions

## Dependency Order

Always follow this order for dependent tasks:

1. Database schema (migrations)
2. RLS policies
3. Backend services (DB operations)
4. Frontend components
5. Tests
6. QA verification
