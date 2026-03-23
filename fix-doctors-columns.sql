-- Fix missing doctors columns and policies for Supabase
-- Run this in Supabase SQL Editor for the same project used by your .env.local

BEGIN;

-- 1) Ensure doctors table has all columns used by the app
ALTER TABLE public.doctors
  ADD COLUMN IF NOT EXISTS appointment_fee numeric(10,2) DEFAULT 50.00,
  ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS available_times jsonb DEFAULT '["8:00 am", "8:30 am", "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am"]'::jsonb;

-- Backfill null values for existing rows
UPDATE public.doctors
SET
  appointment_fee = COALESCE(appointment_fee, 50.00),
  years_experience = COALESCE(years_experience, 0),
  available_times = COALESCE(available_times, '["8:00 am", "8:30 am", "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am"]'::jsonb);

-- 2) Ensure read/write permissions are available for your app roles
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.doctors TO anon, authenticated;

-- 3) Ensure required RLS policies exist (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'doctors' AND policyname = 'Anyone can view doctors'
  ) THEN
    CREATE POLICY "Anyone can view doctors" ON public.doctors
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'doctors' AND policyname = 'Anyone can insert doctors'
  ) THEN
    CREATE POLICY "Anyone can insert doctors" ON public.doctors
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'doctors' AND policyname = 'Anyone can update doctors'
  ) THEN
    CREATE POLICY "Anyone can update doctors" ON public.doctors
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'doctors' AND policyname = 'Anyone can delete doctors'
  ) THEN
    CREATE POLICY "Anyone can delete doctors" ON public.doctors
      FOR DELETE
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

COMMIT;

-- Verify columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'doctors'
  AND column_name IN ('appointment_fee', 'years_experience', 'available_times')
ORDER BY column_name;

-- Verify policies
SELECT policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'doctors'
ORDER BY policyname;
