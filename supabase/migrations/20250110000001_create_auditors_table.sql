-- Create auditors table
    CREATE TABLE IF NOT EXISTS auditors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enable RLS for auditors
    ALTER TABLE auditors ENABLE ROW LEVEL SECURITY;

    -- Create policies for auditors
    CREATE POLICY "Users can view all auditors"
      ON auditors
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Users can insert auditors"
      ON auditors
      FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Users can update auditors"
      ON auditors
      FOR UPDATE
      TO authenticated
      USING (true);

    CREATE POLICY "Users can delete auditors"
      ON auditors
      FOR DELETE
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
    CREATE TRIGGER update_auditors_updated_at
      BEFORE UPDATE ON auditors
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
