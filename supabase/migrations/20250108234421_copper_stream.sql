/*
  # Pallet Rack Audit Schema

  1. New Tables
    - `audits` - Main audit records
    - `damage_records` - Individual damage records with photos
    - `audit_locations` - Location records for audits
  
  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users
*/

-- Create enum for risk levels
CREATE TYPE risk_level AS ENUM ('RED', 'AMBER', 'GREEN');

-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  auditor_name text NOT NULL,
  site_name text NOT NULL,
  company_name text NOT NULL,
  audit_date date NOT NULL DEFAULT CURRENT_DATE,
  red_risks integer DEFAULT 0,
  amber_risks integer DEFAULT 0,
  green_risks integer DEFAULT 0,
  notes text,
  status text DEFAULT 'Draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create damage_records table
CREATE TABLE IF NOT EXISTS damage_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid REFERENCES audits(id) ON DELETE CASCADE,
  damage_type text NOT NULL,
  risk_level risk_level NOT NULL,
  location_details text NOT NULL,
  photo_url text,
  notes text,
  recommendation text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit_locations table
CREATE TABLE IF NOT EXISTS audit_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid REFERENCES audits(id) ON DELETE CASCADE,
  aisle text NOT NULL,
  bay text NOT NULL,
  level text NOT NULL,
  side text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for audits
CREATE POLICY "Users can view all audits"
  ON audits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create audits"
  ON audits FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update audits"
  ON audits FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for damage records
CREATE POLICY "Users can view damage records"
  ON damage_records FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage damage records"
  ON damage_records FOR ALL
  TO authenticated
  USING (true);

-- Create policies for locations
CREATE POLICY "Users can view locations"
  ON audit_locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage locations"
  ON audit_locations FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_audits_updated_at
  BEFORE UPDATE ON audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_damage_records_updated_at
  BEFORE UPDATE ON damage_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
