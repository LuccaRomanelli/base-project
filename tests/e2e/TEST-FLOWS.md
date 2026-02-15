# E2E Test Flows

This document describes the end-to-end test flows for the base project.

## Test Users

Test users are created in `global-setup.ts` and defined in `fixtures/auth.fixture.ts`:

| User         | Email           | Password       | Role  |
| ------------ | --------------- | -------------- | ----- |
| Admin        | admin@test.com  | AdminPass123!  | admin |
| Regular User | user@test.com   | UserPass123!   | user  |

## Test Flows

### Authentication (`specs/auth/`)

#### login.spec.ts

- Valid login redirects to dashboard
- Invalid credentials show error
- Session persists on page reload
- Logout clears session

#### signup.spec.ts

- Signup form displays all fields
- Validation errors show for invalid input
- Navigation to login works

### Items CRUD (`specs/items/`)

#### crud.spec.ts

- Items list displays for authenticated user
- Create form is accessible from items page
- Create item flow works end-to-end

### Admin (`specs/admin/`)

#### admin-panel.spec.ts

- Admin users can access admin panel
- Non-admin users are redirected
- User list displays correctly

## Page Object Models

Located in `pages/`:

- `login.page.ts` - Login form interactions
- `dashboard.page.ts` - Dashboard navigation and stats
- `items.page.ts` - Items list and CRUD operations

## Fixtures

Located in `fixtures/`:

- `base-test.ts` - Extended test with anti-flake config
- `auth.fixture.ts` - Test user credentials
- `database.fixture.ts` - DB reset and utilities
- `index.ts` - Central export

## Helpers

Located in `helpers/`:

- `test-utils.ts` - loginAs, logout, clearAuthState, waitForApi
- `db-utils.ts` - Direct database verification

## Running Tests

```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Interactive UI mode
npm run test:e2e:debug    # Step-through debugger
```

## Debugging Tips

1. Use `test.only()` to run a single test
2. Use `page.pause()` to pause execution
3. Check `test-results/` for screenshots and traces
4. Use `npm run test:e2e:ui` for visual debugging
