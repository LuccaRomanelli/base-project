export const TEST_USERS = {
  admin: {
    id: '11111111-1111-1111-1111-111111111111',
    authId: 'a1111111-1111-1111-1111-111111111111',
    email: 'admin@test.com',
    password: 'testpass123',
    fullName: 'Admin User',
    role: 'admin' as const,
  },
  user: {
    id: '22222222-2222-2222-2222-222222222222',
    authId: 'a2222222-2222-2222-2222-222222222222',
    email: 'user@test.com',
    password: 'testpass123',
    fullName: 'Regular User',
    role: 'user' as const,
  },
} as const;

export type TestUserRole = keyof typeof TEST_USERS;
