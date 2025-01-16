/*
  # Fix Settings Table RLS

  1. Changes
    - Drop existing RLS policies
    - Create new simplified RLS policies for authenticated users
    - Add enable_row_level_security to ensure RLS is enabled
  
  2. Security
    - Allow authenticated users to read all settings
    - Allow authenticated users to insert new settings
    - Allow authenticated users to update existing settings
*/

-- Enable RLS explicitly
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON settings;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON settings;

-- Create new simplified policies
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
