-- Create customers table
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      next_audit_due DATE,
      default_auditor TEXT,
      is_active BOOLEAN DEFAULT FALSE,
      auto_marketing BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMptz DEFAULT NOW()
    );

    -- Create scheduled_audits table
    CREATE TABLE IF NOT EXISTS scheduled_audits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
      booking_date DATE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Enable RLS for customers
    ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

    -- Enable RLS for scheduled_audits
    ALTER TABLE scheduled_audits ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view all customers" ON customers;
    DROP POLICY IF EXISTS "Users can insert customers" ON customers;
    DROP POLICY IF EXISTS "Users can update customers" ON customers;
    DROP POLICY IF EXISTS "Users can view all scheduled audits" ON scheduled_audits;
    DROP POLICY IF EXISTS "Users can insert scheduled audits" ON scheduled_audits;
    DROP POLICY IF EXISTS "Users can update scheduled audits" ON scheduled_audits;

    -- Create policies for customers
    CREATE POLICY "Users can view all customers"
      ON customers
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Users can insert customers"
      ON customers
      FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Users can update customers"
      ON customers
      FOR UPDATE
      TO authenticated
      USING (true);

    -- Create policies for scheduled_audits
    CREATE POLICY "Users can view all scheduled audits"
      ON scheduled_audits
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Users can insert scheduled audits"
      ON scheduled_audits
      FOR INSERT
      TO authenticated
      WITH CHECK (true);

    CREATE POLICY "Users can update scheduled audits"
      ON scheduled_audits
      FOR UPDATE
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

    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
    DROP TRIGGER IF EXISTS update_scheduled_audits_updated_at ON scheduled_audits;

    -- Create triggers for updated_at
    CREATE TRIGGER update_customers_updated_at
      BEFORE UPDATE ON customers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_scheduled_audits_updated_at
      BEFORE UPDATE ON scheduled_audits
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
