-- Create storage bucket for staff photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'staff-photos',
  'staff-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for staff-photos bucket
CREATE POLICY "Staff photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'staff-photos');

CREATE POLICY "Authenticated users can upload staff photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'staff-photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update their uploaded staff photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'staff-photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete staff photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'staff-photos' AND
  auth.role() = 'authenticated'
);
