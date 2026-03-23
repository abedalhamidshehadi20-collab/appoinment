-- Fix patient signup permissions for Supabase
-- Run this in the SQL Editor for the same project used by your .env.local

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.patients TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Anyone can view patients" ON public.patients;
DROP POLICY IF EXISTS "Anyone can create patients" ON public.patients;
DROP POLICY IF EXISTS "Anyone can read patients for authentication" ON public.patients;

CREATE POLICY "Anyone can insert patients" ON public.patients
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view patients" ON public.patients
  FOR SELECT
  TO anon, authenticated
  USING (true);

SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'patients';
