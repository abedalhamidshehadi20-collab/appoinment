-- =============================================
-- Create Your Admin Account
-- Copy and paste this into Supabase SQL Editor
-- =============================================

-- Create admin account
INSERT INTO users (id, name, username, email, password, role, permissions, created_at)
VALUES (
  'usr_admin1',
  'Abed Alhamid Shehadi',
  'abedalhamid',
  'abedalhamidshehadi20@gmail.com',
  'abed.208',
  'super-admin',
  '["all"]'::jsonb,
  NOW()
);

-- Verify it was created
SELECT id, name, username, email, role, permissions, created_at
FROM users
WHERE email = 'abedalhamidshehadi20@gmail.com';
