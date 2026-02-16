# TDD Workflow Guide

## The 6-Step Loop

### Step 1: Define Verification Method

Before writing any code, decide HOW you will verify it works:

| What you're building   | Test Level  | Location                 |
| ---------------------- | ----------- | ------------------------ |
| Utility function       | Unit        | `tests/unit/`            |
| Zod validator          | Unit        | `tests/unit/`            |
| Mapper (DB ↔ App)      | Unit        | `tests/unit/`            |
| Service + DB query     | Integration | `tests/integration/`     |
| Login flow             | E2E         | `tests/e2e/specs/auth/`  |
| CRUD operations via UI | E2E         | `tests/e2e/specs/items/` |
| Admin panel access     | E2E         | `tests/e2e/specs/admin/` |

### Step 2: Write Failing Test (RED)

Write a test that describes the EXPECTED behavior. The test MUST fail initially.

```typescript
// tests/unit/validators.test.ts
import { describe, it, expect } from 'vitest';
import { itemSchema } from '@/lib/validators';

describe('itemSchema', () => {
  it('should reject empty title', () => {
    const result = itemSchema.safeParse({ title: '', description: 'valid' });
    expect(result.success).toBe(false);
  });
});
```

Run and confirm failure:

```bash
bun run test -- tests/unit/validators.test.ts
```

### Step 3: Implement Minimum Code (GREEN)

Write the simplest code that makes the test pass:

```typescript
// src/lib/validators.ts
export const itemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
});
```

### Step 4: Verify

```bash
bun run test          # All tests pass
bun run typecheck     # Types correct
bun run lint          # Code clean
```

### Step 5: Refactor

Improve code quality while keeping tests green:

- Better naming
- Extract shared patterns
- Remove duplication
- Simplify logic

### Step 6: Loop

Go back to Step 1 for the next piece of functionality.

## Example: Adding a New Feature

Feature: "Add item search by title"

1. **Define**: E2E test for search UI + unit test for search logic
2. **RED**: Write test for search input filtering items
3. **GREEN**: Add search input, filter items client-side
4. **Verify**: Tests pass, types check, lint clean
5. **Refactor**: Extract search logic to custom hook
6. **Loop**: Next feature

## Important Rules

- NEVER skip the RED step - if you can't write a failing test, you don't understand the requirement
- NEVER write production code without a test
- Keep tests focused - one behavior per test
- Name tests descriptively: "should reject empty title" not "test1"
