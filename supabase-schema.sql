-- =============================================
-- Clinic Appointments Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: users (Admin/Staff users)
-- =============================================
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: patients
-- =============================================
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth TEXT,
  gender TEXT,
  medical_history TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: doctors (projects)
-- =============================================
CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  description TEXT,
  sector TEXT,
  location TEXT,
  status TEXT,
  cover_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: appointments (interests)
-- =============================================
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id TEXT REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_name TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  service TEXT,
  appointment_date TEXT,
  appointment_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: services
-- =============================================
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: blogs
-- =============================================
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: news
-- =============================================
CREATE TABLE news (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: contacts
-- =============================================
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Table: site_settings
-- =============================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
('home', '{
  "headline": "Sh-Med Care Solutions",
  "subheadline": "We build and operate modern clinic networks with measurable patient outcomes.",
  "primaryCtaText": "Meet Our Doctors",
  "primaryCtaLink": "/doctors",
  "secondaryCtaText": "Contact Us",
  "secondaryCtaLink": "/contact",
  "stats": [
    {"label": "Clinics Managed", "value": "48"},
    {"label": "Cities", "value": "11"},
    {"label": "Patient Satisfaction", "value": "96%"}
  ]
}'::jsonb),
('about', '{
  "title": "About Sh-Med",
  "description": "Sh-Med is a healthcare operations agency focused on clinic setup, digital workflows, and patient-centered design.",
  "mission": "To make premium clinical care accessible through better systems, better facilities, and better teams.",
  "vision": "To become the region''s most trusted partner for building high-performing care environments.",
  "values": ["Clinical excellence", "Transparent operations", "Long-term partnerships"]
}'::jsonb);

-- =============================================
-- Indexes for better performance
-- =============================================
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_doctors_slug ON doctors(slug);
CREATE INDEX idx_doctors_sector ON doctors(sector);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_news_slug ON news(slug);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for doctors (anyone can view doctors)
CREATE POLICY "Anyone can view doctors" ON doctors
  FOR SELECT USING (true);

-- Public read access for services
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (true);

-- Public read access for blogs
CREATE POLICY "Anyone can view blogs" ON blogs
  FOR SELECT USING (true);

-- Public read access for news
CREATE POLICY "Anyone can view news" ON news
  FOR SELECT USING (true);

-- Public read access for site settings
CREATE POLICY "Anyone can view site settings" ON site_settings
  FOR SELECT USING (true);

-- Public can insert contacts
CREATE POLICY "Anyone can create contacts" ON contacts
  FOR INSERT WITH CHECK (true);

-- Public can insert appointments
CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Patients can view their own data
CREATE POLICY "Patients can view their own profile" ON patients
  FOR SELECT USING (auth.uid()::text = id);

-- Patients can update their own data
CREATE POLICY "Patients can update their own profile" ON patients
  FOR UPDATE USING (auth.uid()::text = id);

-- Patients can view their own appointments
CREATE POLICY "Patients can view their appointments" ON appointments
  FOR SELECT USING (patient_id = auth.uid()::text);

COMMENT ON TABLE users IS 'Admin and staff users for dashboard';
COMMENT ON TABLE patients IS 'Patient accounts and profiles';
COMMENT ON TABLE doctors IS 'Doctor profiles (previously called projects)';
COMMENT ON TABLE appointments IS 'Patient appointment bookings (previously called interests)';
COMMENT ON TABLE services IS 'Clinic services offered';
COMMENT ON TABLE blogs IS 'Blog posts';
COMMENT ON TABLE news IS 'News articles';
COMMENT ON TABLE contacts IS 'Contact form submissions';
COMMENT ON TABLE site_settings IS 'Site-wide settings stored as JSON';
