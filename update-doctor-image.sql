-- =============================================
-- Update Doctor Image with Supabase Storage URL
-- Run this in Supabase SQL Editor
-- =============================================

-- STEP 1: First verify bucket is public
-- Go to: Supabase Dashboard → Storage → appointmentpics → Settings
-- Toggle "Public bucket" to ON

-- STEP 2: Update Dr. Omar Hassan's image
UPDATE doctors
SET cover_image = 'https://fpqckpprlcofmhqgedep.supabase.co/storage/v1/object/public/appointmentpics/Smiling%20doctor%20in%20modern%20clinic.png'
WHERE slug = 'dr-omar-hassan';

-- STEP 3: Verify the update worked
SELECT title, cover_image FROM doctors WHERE slug = 'dr-omar-hassan';
