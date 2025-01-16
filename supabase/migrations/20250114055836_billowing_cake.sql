-- Drop existing RLS policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON settings;

-- Create new simplified RLS policies
CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure default settings exist
INSERT INTO settings (key, value)
VALUES (
  'formFields',
  '{
    "customerName": {
      "type": "text",
      "label": "Customer Name",
      "required": true
    }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;
