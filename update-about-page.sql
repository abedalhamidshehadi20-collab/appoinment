-- Update About page content
-- Run in Supabase SQL Editor

INSERT INTO public.site_settings (key, value, updated_at)
VALUES (
  'about',
  jsonb_build_object(
    'title', 'About Sh-Med',
    'description', 'Sh-Med is a healthcare operations agency focused on clinic setup, digital workflows, and patient-centered design.',
    'mission', 'To make premium clinical care accessible through better systems, better facilities, and better teams.',
    'vision', 'To become the region''s most trusted partner for building high-performing care environments.',
    'values', jsonb_build_array(
      'Clinical excellence',
      'Transparent operations',
      'Long-term partnerships'
    )
  ),
  NOW()
)
ON CONFLICT (key)
DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Verify result
SELECT key, value, updated_at
FROM public.site_settings
WHERE key = 'about';
