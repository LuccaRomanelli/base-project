---
name: tdd
description: 'Run the TDD loop for a feature. Takes a feature description and guides through: define test → write test → implement → verify → refactor → loop.'
user-invocable: true
---

# TDD Command

Execute the full TDD loop for a feature.

## Input

$ARGUMENTS — Feature description

## Process

### 1. Analyze the Feature

- Read CLAUDE.md for project conventions
- Understand what needs to be built
- Identify which test level is appropriate (unit/integration/E2E)

### 2. Define Verification Method

Ask if unclear:

- **Unit**: Pure logic, utils, mappers → `tests/unit/`
- **Integration**: Service + DB → `tests/integration/`
- **E2E**: User flow → `tests/e2e/specs/`

### 3. Write Failing Test (RED)

- Create test file in appropriate directory
- Write test that describes expected behavior
- Run test and confirm it FAILS:
  ```bash
  npm run test -- [test-file]
  # or
  npm run test:e2e -- [test-file]
  ```

### 4. Implement Minimum Code (GREEN)

- Write the simplest code that makes the test pass
- No extra features, no premature optimization

### 5. Verify

```bash
npm run test          # All tests pass
npm run typecheck     # Types correct
npm run lint          # Code clean
```

### 6. Refactor

- Improve code quality while keeping tests green
- Extract patterns, improve naming, remove duplication

### 7. Loop

- If more functionality needed, go back to step 3
- If feature is complete, commit:
  ```bash
  git add -A
  git commit -m "feat: [description]"
  ```

## Important Rules

- NEVER skip the RED step
- NEVER write production code without a test
- Keep tests focused — one behavior per test
- Run full verification after each GREEN step
