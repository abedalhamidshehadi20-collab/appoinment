-- Update Doctor Image with Supabase Storage URL
-- Run this in Supabase SQL Editor
-- =============================================

-- IMPORTANT: First, make sure your appointmentpics bucket is PUBLIC
-- Go to Supabase Dashboard → Storage → appointmentpics → Settings → Make bucket public

-- Use the PUBLIC URL (not the signed URL with token):
-- Public URL format: https://fpqckpprlcofmhqgedep.supabase.co/storage/v1/object/public/appointmentpics/Smiling%20doctor%20in%20modern%20clinic.png

-- Option 1: Update Dr. Omar Hassan's image
UPDATE doctors
SET cover_image = 'https://fpqckpprlcofmhqgedep.supabase.co/storage/v1/object/public/appointmentpics/Smiling%20doctor%20in%20modern%20clinic.png'
WHERE slug = 'dr-omar-hassan';

-- Option 2: Update Dr. Khan Adel's image
-- UPDATE doctors
-- SET cover_image = 'https://fpqckpprlcofmhqgedep.supabase.co/storage/v1/object/public/appointmentpics/Smiling%20doctor%20in%20modern%20clinic.png'
-- WHERE slug = 'dr-khan-adel';

-- Verify the update
SELECT title, cover_image FROM doctors WHERE slug = 'dr-omar-hassan';
