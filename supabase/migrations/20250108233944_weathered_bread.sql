/*
  # Fix Settings Table and RLS Policies

  1. Changes
    - Create settings table if not exists
    - Enable RLS
    - Create proper RLS policies for authenticated users
    - Add updated_at trigger
    - Insert default form field settings
  
  2. Security
    - Enable RLS on settings table
    - Allow authenticated users to read all settings
    - Allow authenticated users to insert new settings
    - Allow authenticated users to update existing settings
*/

-- Create settings table if not exists
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON settings;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON settings FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users"
  ON settings FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (key, value)
VALUES (
  'formFields',
  '{
    "consultantName": {
      "type": "text",
      "label": "Consultant''s Name",
      "required": false
    },
    "customerName": {
      "type": "text",
      "label": "Customer Name",
      "required": true
    },
    "companyName": {
      "type": "text", 
      "label": "Company Name",
      "required": true
    },
    "email": {
      "type": "email",
      "label": "Email",
      "required": true
    },
    "floorSize": {
      "type": "number",
      "label": "Floor Size (m²)",
      "required": true
    },
    "floorFinishHeight": {
      "type": "number",
      "label": "Floor Finish Height (mm)",
      "required": true
    },
    "floorCapacity": {
      "type": "number",
      "label": "Floor Capacity (KPA)",
      "required": true
    },
    "deckingType": {
      "type": "select",
      "label": "Decking Type",
      "required": true,
      "options": ["22mm Particleboard", "25mm Structural Ply"]
    },
    "steelFinish": {
      "type": "select",
      "label": "Steel Finish",
      "required": true,
      "options": ["Galvanised", "Powder Coated"]
    },
    "staircase": {
      "type": "radio",
      "label": "Staircase",
      "required": true,
      "options": ["Yes", "No"]
    },
    "handrailType": {
      "type": "select",
      "label": "Handrail Type",
      "required": false,
      "options": ["No Handrail", "Standard", "Balustrading"]
    },
    "handrailLength": {
      "type": "number",
      "label": "Handrail Length (m)",
      "required": false
    },
    "accessGate": {
      "type": "select",
      "label": "Access Gate",
      "required": true,
      "options": ["No Gate", "Sliding Gate", "Up and Over Gate"]
    },
    "supplyType": {
      "type": "select",
      "label": "Supply Type",
      "required": true,
      "options": ["Supply Only", "Supply with Delivery", "Supply and Install"]
    },
    "totalPrice": {
      "type": "number",
      "label": "Total Price (AUD)",
      "required": true
    }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
