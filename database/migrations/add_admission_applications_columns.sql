-- Migration: Add missing columns to admission_applications table
-- This fixes the schema to match the application requirements

-- Add missing columns to admission_applications table
ALTER TABLE public.admission_applications
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS previous_school TEXT,
  ADD COLUMN IF NOT EXISTS previous_class TEXT,
  ADD COLUMN IF NOT EXISTS guardian_email TEXT,
  ADD COLUMN IF NOT EXISTS guardian_relation TEXT,
  ADD COLUMN IF NOT EXISTS guardian_occupation TEXT,
  ADD COLUMN IF NOT EXISTS academic_year_id UUID,
  ADD COLUMN IF NOT EXISTS applied_class_id UUID;

-- Add foreign key constraint for academic_year_id (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admission_applications_academic_year_id_fkey'
  ) THEN
    ALTER TABLE public.admission_applications
      ADD CONSTRAINT admission_applications_academic_year_id_fkey 
      FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add foreign key constraint for applied_class_id (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admission_applications_applied_class_id_fkey'
  ) THEN
    ALTER TABLE public.admission_applications
      ADD CONSTRAINT admission_applications_applied_class_id_fkey 
      FOREIGN KEY (applied_class_id) REFERENCES classes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- If class_id column exists and you want to migrate data to applied_class_id
-- Uncomment the following lines:
-- UPDATE public.admission_applications 
-- SET applied_class_id = class_id 
-- WHERE applied_class_id IS NULL AND class_id IS NOT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_admission_applications_academic_year_id 
  ON public.admission_applications(academic_year_id);

CREATE INDEX IF NOT EXISTS idx_admission_applications_applied_class_id 
  ON public.admission_applications(applied_class_id);

-- Add check constraint for guardian_relation
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admission_applications_guardian_relation_check'
  ) THEN
    ALTER TABLE public.admission_applications
      DROP CONSTRAINT admission_applications_guardian_relation_check;
  END IF;
END $$;

ALTER TABLE public.admission_applications
  ADD CONSTRAINT admission_applications_guardian_relation_check 
  CHECK (guardian_relation IS NULL OR guardian_relation = ANY (ARRAY['father'::TEXT, 'mother'::TEXT, 'guardian'::TEXT, 'other'::TEXT]));

-- Verification query
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'admission_applications'
-- ORDER BY ordinal_position;
