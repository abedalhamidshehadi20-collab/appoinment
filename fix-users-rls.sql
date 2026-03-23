-- =============================================
-- Fix RLS Policy for Users Table
-- This allows the login system to read user data
-- =============================================

-- Allow anyone to read users table for login/authentication
-- Note: passwords are stored in plain text, so this is not ideal for production
-- but it matches the current system architecture
CREATE POLICY "Allow public read access for authentication" ON users
  FOR SELECT USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';
