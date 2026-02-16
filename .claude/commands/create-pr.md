---
name: create-pr
description: 'Create a PR for the current feature branch. Runs all checks, captures E2E screenshots, and creates PR with full documentation.'
user-invocable: true
---

# Create PR Command

Create a pull request for the current feature branch.

## Process

### 1. Run All Checks

```bash
bun run lint
bun run typecheck
bun run test
bun run test:e2e
```

If any check fails, report the error and stop.

### 2. Collect Test Results

- Count passing/failing unit tests
- Count passing/failing E2E tests
- Note any skipped tests

### 3. Gather Screenshots

Look for Playwright screenshots in `test-results/` directory.
These are automatically captured on test failure and can be explicitly captured in tests.

### 4. Prepare PR Body

Generate the PR body with:

- Summary of changes (from `git log main..HEAD --oneline`)
- Test results (pass/fail counts)
- Screenshots (if available)
- Acceptance criteria (from task/PRD)

### 5. Create PR

```bash
# Get current branch
BRANCH=$(git branch --show-current)

# Create PR
gh pr create \
  --title "feat: $ARGUMENTS" \
  --body "$(cat <<'EOF'
## Summary
[Auto-generated from commit history]

## Test Results
- Unit tests: X passed, 0 failed
- E2E tests: X passed, 0 failed
- Typecheck: passed
- Lint: passed

## Screenshots
[Playwright screenshots from test-results/]

## Acceptance Criteria
- [x] All tests pass
- [x] Typecheck passes
- [x] Lint passes

---
Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)
EOF
)"
```

### 6. Report Result

Output the PR URL so the user can review it.
