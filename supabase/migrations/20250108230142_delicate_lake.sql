/*
  # Initial Schema Setup for Mezzanine Quote App

  1. New Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `reference_number` (text, unique)
      - `consultant_name` (text)
      - `customer_name` (text)
      - `company_name` (text)
      - `email` (text)
      - `floor_size` (numeric)
      - `floor_finish_height` (numeric)
      - `floor_capacity` (numeric)
      - `decking_type` (text)
      - `steel_finish` (text)
      - `staircase` (text)
      - `handrail_type` (text)
      - `handrail_length` (numeric)
      - `access_gate` (text)
      - `supply_type` (text)
      - `total_price` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `content` (text)
      - `hidden` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  consultant_name text,
  customer_name text NOT NULL,
  company_name text NOT NULL,
  email text NOT NULL,
  floor_size numeric NOT NULL,
  floor_finish_height numeric NOT NULL,
  floor_capacity numeric NOT NULL,
  decking_type text NOT NULL,
  steel_finish text NOT NULL,
  staircase text NOT NULL,
  handrail_type text,
  handrail_length numeric,
  access_gate text,
  supply_type text NOT NULL,
  total_price numeric NOT NULL,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  hidden boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for quotes
CREATE POLICY "Users can view all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for templates
CREATE POLICY "Users can view templates"
  ON templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage templates"
  ON templates
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for settings
CREATE POLICY "Users can view settings"
  ON settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (true);
