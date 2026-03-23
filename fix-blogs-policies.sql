-- Fix blogs permissions for dashboard CRUD
-- Run in Supabase SQL Editor for the same project used by your app

BEGIN;

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.blogs TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blogs' AND policyname = 'Anyone can view blogs'
  ) THEN
    CREATE POLICY "Anyone can view blogs" ON public.blogs
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blogs' AND policyname = 'Anyone can insert blogs'
  ) THEN
    CREATE POLICY "Anyone can insert blogs" ON public.blogs
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blogs' AND policyname = 'Anyone can update blogs'
  ) THEN
    CREATE POLICY "Anyone can update blogs" ON public.blogs
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blogs' AND policyname = 'Anyone can delete blogs'
  ) THEN
    CREATE POLICY "Anyone can delete blogs" ON public.blogs
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

COMMIT;

-- Verify policies
SELECT policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'blogs'
ORDER BY policyname;
