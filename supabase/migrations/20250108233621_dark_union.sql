/*
  # Fix Settings Table and RLS

  1. Changes
    - Create settings table if not exists
    - Add RLS policies for settings
    - Add default form field settings
  
  2. Security
    - Enable RLS on settings table
    - Add policies for authenticated users
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

-- Create policies for settings
CREATE POLICY "Users can read settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert settings"
  ON settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM settings s2 
      WHERE s2.key = settings.key
    )
  );

CREATE POLICY "Users can update settings"
  ON settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings if they don't exist
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
ON CONFLICT (key) DO NOTHING;
