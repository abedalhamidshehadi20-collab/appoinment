CREATE TABLE IF NOT EXISTS doctor_credentials (
  id TEXT PRIMARY KEY,
  doctor_id TEXT UNIQUE NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctor_credentials_doctor_id
  ON doctor_credentials(doctor_id);

CREATE INDEX IF NOT EXISTS idx_doctor_credentials_email
  ON doctor_credentials(email);

ALTER TABLE doctor_credentials ENABLE ROW LEVEL SECURITY;
