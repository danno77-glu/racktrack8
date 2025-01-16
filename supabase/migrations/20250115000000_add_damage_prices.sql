-- Add price column to damage_records table
    ALTER TABLE damage_records
    ADD COLUMN price numeric;

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
      USING (true);

    CREATE POLICY "Enable insert access for authenticated users"
      ON settings FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Enable update access for authenticated users"
      ON settings FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);

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
      'damagePrices',
      '{
        "Beam Safety Clips Missing": 10,
        "Upright Damaged": 100,
        "Upright/Footplate Twisted": 50,
        "Footplate Damaged/Missing": 30,
        "Floor Fixing Damaged/Missing": 20,
        "Horizontal Brace Damaged": 40,
        "Diagonal Brace Damaged": 40,
        "Beam Damaged": 80,
        "Beam Dislodged": 20,
        "Row Spacer Damaged/Missing": 30,
        "Mesh Deck missing/damaged": 60,
        "Barrier/Guard Damaged/Missing": 70,
        "Load Sign Incorrect/Missing": 15,
        "Splice Incorrect/Poor Quality": 120,
        "Frames not compatible with Beam": 150
      }'::jsonb
    )
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
