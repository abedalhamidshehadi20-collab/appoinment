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

CREATE UNIQUE INDEX IF NOT EXISTS idx_doctor_credentials_email_lower
  ON doctor_credentials(LOWER(email));

ALTER TABLE doctor_credentials ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE doctor_credentials IS 'Doctor login credentials managed from the dashboard';

CREATE OR REPLACE FUNCTION set_doctor_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_doctor_credentials_updated_at ON doctor_credentials;

CREATE TRIGGER trg_doctor_credentials_updated_at
BEFORE UPDATE ON doctor_credentials
FOR EACH ROW
EXECUTE FUNCTION set_doctor_credentials_updated_at();

-- Keep this table private. The application reads and writes it with the
-- server-side Supabase service role key, so no public RLS policies are added.
