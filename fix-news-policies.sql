-- Fix news permissions for dashboard CRUD
-- Run in Supabase SQL Editor for the same project used by your app

BEGIN;

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.news TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'news' AND policyname = 'Anyone can view news'
  ) THEN
    CREATE POLICY "Anyone can view news" ON public.news
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'news' AND policyname = 'Anyone can insert news'
  ) THEN
    CREATE POLICY "Anyone can insert news" ON public.news
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'news' AND policyname = 'Anyone can update news'
  ) THEN
    CREATE POLICY "Anyone can update news" ON public.news
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'news' AND policyname = 'Anyone can delete news'
  ) THEN
    CREATE POLICY "Anyone can delete news" ON public.news
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

COMMIT;

-- Verify policies
SELECT policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'news'
ORDER BY policyname;
