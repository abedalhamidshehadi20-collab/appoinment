-- Fix services permissions for dashboard CRUD
-- Run in Supabase SQL Editor for the same project used by your app

BEGIN;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.services TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'Anyone can view services'
  ) THEN
    CREATE POLICY "Anyone can view services" ON public.services
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'Anyone can insert services'
  ) THEN
    CREATE POLICY "Anyone can insert services" ON public.services
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'Anyone can update services'
  ) THEN
    CREATE POLICY "Anyone can update services" ON public.services
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'Anyone can delete services'
  ) THEN
    CREATE POLICY "Anyone can delete services" ON public.services
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

COMMIT;

-- Verify policies
SELECT policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'services'
ORDER BY policyname;
