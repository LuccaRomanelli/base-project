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

## Parallel Agent Execution

### Spawning Agents in Parallel

To spawn multiple agents in parallel, use multiple Task tool calls in a SINGLE message:

Example (software-architect spawning 3 agents):

- Agent 1: dba - Create database schema
- Agent 2: test-specialist - Write failing E2E tests
- Agent 3: ui-ux-specialist - Design component layouts

All three agents start simultaneously and run independently.

### When to Parallelize

| Scenario                             | Parallel? | Reason                |
| ------------------------------------ | --------- | --------------------- |
| Schema + E2E tests                   | Yes       | No data dependency    |
| Backend service + Frontend component | Yes       | Can work from spec    |
| Migration + RLS policies             | No        | RLS depends on tables |
| Component + Component tests          | No        | Tests need component  |

### Context Isolation

Each agent:

- Starts with fresh context (no shared memory)
- Reads from files (source of truth)
- Writes results to files
- Returns summary to orchestrator

This prevents context window exhaustion in long-running teams.

## Team Messaging

### Message Passing Pattern

Agents communicate through the task system and SendMessage tool:

1. **Task-based**: Update task status, add comments
2. **Direct message**: Use SendMessage for urgent coordination
3. **File-based**: Write results to files, other agents read

### Avoiding Context Bloat

Instead of passing large context through messages:

- BAD: "Here's the entire component code..."
- GOOD: "Component created at src/components/items/ItemCard.tsx"

- BAD: "The schema includes these 50 fields..."
- GOOD: "Schema created. Run `bun run db:types` to see types."

### Orchestrator Pattern (software-architect)

The software-architect acts as orchestrator:

1. **Decompose**: Break feature into independent tasks
2. **Assign**: Spawn agents in parallel for independent tasks
3. **Monitor**: Check task completion via TaskList
4. **Coordinate**: Spawn dependent tasks when blockers resolve
5. **Verify**: Spawn QA agent for final verification

### Example Flow

Feature: "Add user profile editing"

Round 1 (parallel):

- dba: Create profile_updates table
- test-specialist: Write failing E2E for profile edit
- ui-ux-specialist: Design profile edit form

Round 2 (after Round 1 completes):

- supabase-backend: Create profile service (needs schema)
- frontend-developer: Implement profile form (needs design)

Round 3 (after Round 2):

- frontend-developer: Wire up form to service

Round 4 (final):

- qa: Run all checks, create PR
