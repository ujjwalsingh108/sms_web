# Staff Photo Upload Feature

## Overview
Added photo upload functionality to the staff management system. Staff photos are uploaded to Supabase Storage and the public URLs are saved in the database.

## Changes Made

### 1. Database Setup
**File:** `database/migrations/create-staff-photos-bucket.sql`
- Created Supabase storage bucket named `staff-photos`
- Set 5MB file size limit
- Allowed image formats: JPEG, JPG, PNG, WebP
- Configured RLS policies:
  - Public read access for all photos
  - Authenticated users can upload, update, and delete photos

### 2. Staff Form Component
**File:** `components/staff/staff-form.tsx`
- Added file input for photo upload
- Image preview with ability to remove selected photo
- Displays existing photo when editing staff
- Shows file size and format restrictions
- Responsive design that works on all screen sizes

### 3. Server Actions
**File:** `app/dashboard/staff/actions.ts`

#### Create Staff:
- Handles photo file upload to Supabase Storage
- Generates unique filename with timestamp
- Stores file in `staff/` folder within `staff-photos` bucket
- Retrieves and saves public URL to database

#### Update Staff:
- Deletes old photo from storage when new photo is uploaded
- Uploads new photo with unique filename
- Updates database with new photo URL
- Preserves existing photo if no new photo is uploaded

### 4. Staff Table
**File:** `components/staff/staff-table.tsx`
- Added Photo column as the first column
- Displays circular thumbnail (40x40px) with border
- Shows fallback icon when no photo is available
- Responsive and optimized with Next.js Image component

### 5. Staff Detail Page
**File:** `app/dashboard/staff/[id]/page.tsx`
- Displays larger staff photo (80x80px) in header
- Circular photo with white border and shadow
- Photo appears next to staff name and employee ID

## Setup Instructions

### 1. Run Database Migration
Go to **Supabase Studio → SQL Editor** and execute:

```sql
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
```

### 2. Verify Setup
After running the migration:
1. Check that the `staff-photos` bucket exists in Supabase Storage
2. Verify RLS policies are active
3. Test uploading a photo when creating/editing staff

## Usage

### Creating Staff with Photo
1. Navigate to Staff Management → Add Staff
2. Fill in required fields
3. Click "Choose File" in the Photo section
4. Select an image (max 5MB, JPG/PNG/WebP)
5. Preview appears with option to remove
6. Submit form - photo uploads automatically

### Editing Staff Photo
1. Navigate to staff detail page
2. Click "Edit Details"
3. Upload new photo (replaces old one)
4. Or leave unchanged to keep existing photo
5. Submit form

### Photo Display
- **Staff Table:** Small circular thumbnail in first column
- **Detail Page:** Larger photo in header next to name
- **No Photo:** Shows user icon placeholder

## Technical Details

### File Storage Structure
```
staff-photos/
  └── staff/
      ├── 1735567890123-abc123.jpg
      ├── 1735567891234-def456.png
      └── ...
```

### File Naming
Format: `{timestamp}-{random-string}.{extension}`
- Example: `1735567890123-abc123.jpg`
- Ensures unique filenames
- Prevents overwrites

### Security
- Only authenticated users can upload/modify photos
- All photos are publicly readable
- File size limited to 5MB
- Only image formats allowed

### Performance
- Uses Next.js Image component for optimization
- Lazy loading for better performance
- Responsive images for different screen sizes
- Cached with `cache-control: 3600` (1 hour)

## Troubleshooting

### Upload Fails
1. Check Supabase Storage bucket exists
2. Verify RLS policies are configured
3. Ensure file is under 5MB
4. Check file format (JPG/PNG/WebP only)

### Photo Not Displaying
1. Check `photo_url` in database is not null
2. Verify URL is accessible (test in browser)
3. Check Image component props are correct
4. Review browser console for errors

### Old Photos Not Deleted
- Check storage permissions
- Verify file path parsing in updateStaff action
- Review storage logs in Supabase

## Future Enhancements
- [ ] Image cropping tool
- [ ] Multiple photo upload
- [ ] Photo gallery for staff
- [ ] Automatic image compression
- [ ] Drag-and-drop upload
- [ ] Progress indicator for large uploads
