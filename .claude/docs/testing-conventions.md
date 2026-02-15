# Testing Conventions

## Test Levels

### Unit Tests (`tests/unit/`)

- Pure functions, utilities, mappers, validators
- No external dependencies (mock everything)
- Fast execution (< 1s per test)
- Run with: `npm run test`

### Integration Tests (`tests/integration/`)

- Service layer + database interactions
- Uses testcontainers or local Supabase
- Real database queries, real responses
- Run with: `npm run test:integration`

### E2E Tests (`tests/e2e/specs/`)

- Full user flows through the browser
- Uses Playwright + real app + real database
- Run with: `npm run test:e2e`

## Anti-Flakiness Rules (The 10 Commandments)

### 1. Never Use Fixed Timeouts

```typescript
// BAD
await page.waitForTimeout(2000);

// GOOD
await page.waitForURL('/dashboard');
await page.getByText('Welcome').waitFor({ state: 'visible' });
await page.waitForResponse((resp) => resp.url().includes('/api/items'));
```

### 2. Use Semantic Selectors (Priority Order)

1. `getByRole` - buttons, links, headings
2. `getByLabel` - form inputs
3. `getByText` - static text content
4. `getByTestId` - last resort (data-testid attribute)

```typescript
// BAD
await page.locator('.btn-primary').click();
await page.locator('#email-input').fill('test@email.com');

// GOOD
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email').fill('test@email.com');
```

### 3. Clear State in beforeEach

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearAuthState(page); // Clear Supabase tokens from localStorage
});
```

### 4. Wait for Navigation

```typescript
// After clicking a link that navigates
await page.getByRole('link', { name: 'Dashboard' }).click();
await page.waitForURL('/dashboard');
```

### 5. Wait for Network

```typescript
// Wait for specific API response
const responsePromise = page.waitForResponse(
  (resp) => resp.url().includes('/rest/v1/items') && resp.status() < 400,
);
await page.getByRole('button', { name: 'Save' }).click();
await responsePromise;
```

### 6. Isolate Tests

- Each test must work independently
- Never depend on test ordering
- Use beforeEach for setup, not previous tests' side effects

### 7. Use Page Object Models

```typescript
// pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
  }
}
```

### 8. Handle Loading States

```typescript
// Wait for spinner to disappear before asserting
await page.getByRole('progressbar').waitFor({ state: 'detached' });
// Or wait for the actual content to appear
await page.getByText('Welcome').waitFor({ state: 'visible' });
```

### 9. Use Test Fixtures

```typescript
// Import from central fixtures
import { test, expect, TEST_USERS } from '../../fixtures';
```

### 10. Retry on CI Only

```typescript
// playwright.config.ts
retries: process.env.CI ? 2 : 0,
```

## Page Object Model Pattern

Each page gets a POM class in `tests/e2e/pages/`:

- Locators for page elements
- Actions (login, createItem, etc.)
- Assertions (expectLoaded, expectError, etc.)

```typescript
export class ItemsPage {
  readonly heading: Locator;
  readonly newItemButton: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Items' });
    this.newItemButton = page.getByRole('link', { name: /new item/i });
  }

  async goto() {
    await this.page.goto('/items');
  }
  async expectLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }
}
```

## Test Data Management

- Seed data in `supabase/seed.sql`
- Test user credentials in `tests/e2e/fixtures/auth.fixture.ts`
- Database reset via global-setup.ts before all tests
- Use `dbVerify` helpers for direct database verification
