-- Create storage bucket for audit photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('audit-photos', 'audit-photos', true);

-- Create policy to allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audit-photos' AND
  auth.role() = 'authenticated'
);

-- Create policy to allow public access to photos
CREATE POLICY "Allow public access to photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'audit-photos');
