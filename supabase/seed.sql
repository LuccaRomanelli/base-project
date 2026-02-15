-- Seed data for testing
-- Test users (password for all: testpass123)
-- Auth users are created in global-setup.ts, this seeds the public.users table

-- Admin user
INSERT INTO users (id, auth_id, full_name, email, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Admin User', 'admin@test.com', 'admin');

-- Regular user
INSERT INTO users (id, auth_id, full_name, email, role) VALUES
  ('22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Regular User', 'user@test.com', 'user');

-- Example items
INSERT INTO items (id, user_id, title, description, status) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'First Item', 'This is the first example item.', 'published'),
  ('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Draft Item', 'This item is still in draft.', 'draft'),
  ('aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Archived Item', 'This item has been archived.', 'archived'),
  ('aaaa4444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Admin Item', 'Item created by admin.', 'published'),
  ('aaaa5555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Admin Draft', 'Admin draft item.', 'draft');
