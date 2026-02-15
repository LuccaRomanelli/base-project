---
name: start
description: "Kickoff a new feature or project. Analyzes what needs to be built, generates a PRD, creates a team, and decomposes work into tasks. Triggers on: start a feature, begin work on, kickoff, let's build."
user-invocable: true
---

# Project Kickoff

Start building a new feature from scratch.

## Workflow

### Step 1: Understand What to Build

Use AskUserQuestion to gather requirements:

**Batch 1: Core**

- "What do you want to build?" (feature description)
- "Who is this for?" (target users)

**Batch 2: Scope**

- "What's the scope?" (MVP / Full feature / Backend only / UI only)
- "Any specific requirements or constraints?"

### Step 2: Analyze Codebase

Before generating the PRD:

1. Map project structure and tech stack
2. Find reusable components
3. Identify existing patterns
4. Check for similar features

### Step 3: Generate PRD

Create a PRD at `tasks/prd-[feature-name].md` with:

- Codebase Analysis (what exists, what to reuse)
- Introduction/Overview
- Goals
- User Stories (with testType and acceptance criteria)
- Functional Requirements
- Non-Goals
- Technical Considerations
- Success Metrics

### Step 4: Create Team

```
TeamCreate: feature-[name]
```

### Step 5: Decompose into Tasks

Create tasks with dependencies:

1. Database schema changes (if any)
2. Backend services/RLS policies
3. Frontend components
4. Tests (unit + E2E)
5. QA verification

### Step 6: Spawn Agents

Analyze which agents are needed and spawn them in parallel for independent tasks:

- Schema changes → `dba` + `supabase-backend`
- UI work → `frontend-developer` + `ui-ux-specialist`
- Tests → `test-specialist`
- Quality gate → `qa` (after all others complete)

### Step 7: Monitor Progress

The software-architect monitors task completion and:

- Assigns new tasks as dependencies are resolved
- Unblocks stuck agents
- Escalates to tech-lead for complex issues

## Important

- Always follow TDD workflow
- Feature branches: `feat/[feature-name]`
- Conventional commits: `feat: [description]`
