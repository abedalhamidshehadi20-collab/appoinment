-- Create Admin Account
-- Run this in Supabase SQL Editor

INSERT INTO users (id, name, username, email, password, role, permissions, created_at)
VALUES (
  'usr_' || substr(md5(random()::text), 1, 8),
  'Abed Alhamid Shehadi',
  'abedalhamid',
  'abedalhamidshehadi20@gmail.com',
  'abed.208',
  'super-admin',
  '["all"]'::jsonb,
  NOW()
);

-- Verify the account was created
SELECT id, name, username, email, role, permissions
FROM users
WHERE email = 'abedalhamidshehadi20@gmail.com';
