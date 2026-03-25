-- ============================================
-- Contact Form Table Setup
-- ============================================
-- This script sets up the contacts table for storing
-- messages submitted through the contact form by patients
-- ============================================

-- Drop existing table if you want to start fresh (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS contacts CASCADE;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow service role full access to contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users to insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow admins to view all contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public to insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public to view contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public to delete contacts" ON contacts;

-- Policy 1: Allow service role (backend with service_role key) full access
CREATE POLICY "Allow service role full access to contacts"
ON contacts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Allow public inserts.
-- This project uses custom signed cookies for patients instead of Supabase Auth,
-- so browser requests still reach Supabase with the anon role.
CREATE POLICY "Allow public to insert contacts"
ON contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 3: Allow dashboard reads.
-- The admin dashboard in this repo also relies on custom cookies rather than
-- Supabase Auth JWTs, so it must be able to read through the anon role unless
-- the backend is configured with SUPABASE_SERVICE_ROLE_KEY.
CREATE POLICY "Allow public to view contacts"
ON contacts
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 4: Allow dashboard deletes for the current custom-cookie admin flow.
CREATE POLICY "Allow public to delete contacts"
ON contacts
FOR DELETE
TO anon, authenticated
USING (true);

-- ============================================
-- Verify Setup
-- ============================================

-- Check if table was created successfully
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'contacts';

-- If you later add SUPABASE_SERVICE_ROLE_KEY to your Next.js app and want a
-- stricter setup, keep the service role policy and remove the public SELECT
-- and DELETE policies above after switching your server code to supabaseAdmin.

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================
-- Uncomment to insert test data:
-- INSERT INTO contacts (id, name, email, phone, message, created_at)
-- VALUES
--   ('cnt_test001', 'John Doe', 'john@example.com', '+1234567890', 'Test message 1', NOW()),
--   ('cnt_test002', 'Jane Smith', 'jane@example.com', '+0987654321', 'Test message 2', NOW());
