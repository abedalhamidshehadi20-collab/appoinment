-- =============================================
-- Add Specialties Table and Update Schema
-- =============================================

-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on specialties
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;

-- Public read access for specialties
CREATE POLICY "Anyone can view specialties" ON specialties
  FOR SELECT USING (true);

-- Create index on specialties
CREATE INDEX IF NOT EXISTS idx_specialties_slug ON specialties(slug);
CREATE INDEX IF NOT EXISTS idx_specialties_featured ON specialties(is_featured);

-- Insert default specialties
INSERT INTO specialties (id, slug, name, icon, description, is_featured, sort_order) VALUES
('spc_dentist', 'dentist', 'Dentist', 'dentist', 'Dental care and oral health specialists', true, 1),
('spc_cardiologist', 'cardiologist', 'Cardiologist', 'cardiologist', 'Heart and cardiovascular system specialists', true, 2),
('spc_orthopedic', 'orthopedic', 'Orthopedic', 'orthopedic', 'Bone, joint, and muscle specialists', true, 3),
('spc_neurologist', 'neurologist', 'Neurologist', 'neurologist', 'Brain and nervous system specialists', true, 4),
('spc_otology', 'otology', 'Otology', 'otology', 'Ear, nose, and throat specialists', true, 5),
('spc_general', 'general-doctor', 'General Doctor', 'general', 'Primary care and general health', true, 6),
('spc_surgeon', 'surgeon', 'Surgeon', 'surgeon', 'Surgical procedures specialists', false, 7),
('spc_psychiatry', 'psychiatry', 'Psychiatry', 'psychiatry', 'Mental health specialists', false, 8),
('spc_eye', 'eye-specialist', 'Eye Specialist', 'eye', 'Vision and eye care specialists', false, 9)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  is_featured = EXCLUDED.is_featured,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- Add appointment_fee to doctors table
-- =============================================
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS appointment_fee DECIMAL(10,2) DEFAULT 50.00;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS available_times JSONB DEFAULT '["8:00 am", "8:30 am", "9:00 am", "9:30 am", "10:00 am", "10:30 am", "11:00 am", "11:30 am"]'::jsonb;

-- =============================================
-- Update site_settings to include contact info
-- =============================================
INSERT INTO site_settings (key, value) VALUES
('contact', '{
  "address": "123 Main Street, Springfield",
  "city": "IL 62704, United States",
  "phone": "+1 (555) 123-4567",
  "email": "contact@shmed.com",
  "mapUrl": "https://www.openstreetmap.org/export/embed.html?bbox=72.48%2C23.00%2C72.68%2C23.14&layer=mapnik",
  "workingHours": {
    "weekdays": "8:00 AM - 6:00 PM",
    "saturday": "9:00 AM - 2:00 PM",
    "sunday": "Closed"
  }
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- =============================================
-- Make appointments work without patient login (optional booking)
-- =============================================
-- Update the patient_id to be nullable (already is in schema)
-- The appointments table already has patient_id as nullable

-- =============================================
-- Add doctors all access policy for admin operations
-- =============================================
CREATE POLICY IF NOT EXISTS "Anyone can insert doctors" ON doctors
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can update doctors" ON doctors
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete doctors" ON doctors
  FOR DELETE USING (true);

-- Add services all access policy
CREATE POLICY IF NOT EXISTS "Anyone can insert services" ON services
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can update services" ON services
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete services" ON services
  FOR DELETE USING (true);

-- Add blogs all access policy
CREATE POLICY IF NOT EXISTS "Anyone can insert blogs" ON blogs
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can update blogs" ON blogs
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete blogs" ON blogs
  FOR DELETE USING (true);

-- Add news all access policy
CREATE POLICY IF NOT EXISTS "Anyone can insert news" ON news
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can update news" ON news
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete news" ON news
  FOR DELETE USING (true);

-- Add site_settings all access policy
CREATE POLICY IF NOT EXISTS "Anyone can update site settings" ON site_settings
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can insert site settings" ON site_settings
  FOR INSERT WITH CHECK (true);

-- Add patients all access policy (for registration)
CREATE POLICY IF NOT EXISTS "Anyone can insert patients" ON patients
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can view patients" ON patients
  FOR SELECT USING (true);

-- Add appointments view all policy
CREATE POLICY IF NOT EXISTS "Anyone can view appointments" ON appointments
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can update appointments" ON appointments
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete appointments" ON appointments
  FOR DELETE USING (true);

-- Add contacts view policy
CREATE POLICY IF NOT EXISTS "Anyone can view contacts" ON contacts
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete contacts" ON contacts
  FOR DELETE USING (true);

-- Add users all access policy
CREATE POLICY IF NOT EXISTS "Anyone can view users" ON users
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Add specialties all access policy
CREATE POLICY IF NOT EXISTS "Anyone can insert specialties" ON specialties
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can update specialties" ON specialties
  FOR UPDATE USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can delete specialties" ON specialties
  FOR DELETE USING (true);
