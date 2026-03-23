-- Fix site_settings write permissions for dashboard edits
-- Run in Supabase SQL Editor

BEGIN;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.site_settings TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'Anyone can view site settings'
  ) THEN
    CREATE POLICY "Anyone can view site settings" ON public.site_settings
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'Anyone can insert site settings'
  ) THEN
    CREATE POLICY "Anyone can insert site settings" ON public.site_settings
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'Anyone can update site settings'
  ) THEN
    CREATE POLICY "Anyone can update site settings" ON public.site_settings
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

COMMIT;

SELECT policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'site_settings'
ORDER BY policyname;
