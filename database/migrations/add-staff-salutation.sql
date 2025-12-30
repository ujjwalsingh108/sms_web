-- Add salutation column to staff table
-- Run this in Supabase SQL Editor

ALTER TABLE public.staff 
ADD COLUMN IF NOT EXISTS salutation TEXT;

-- Add check constraint for salutation values
ALTER TABLE public.staff 
DROP CONSTRAINT IF EXISTS staff_salutation_check;

ALTER TABLE public.staff 
ADD CONSTRAINT staff_salutation_check 
CHECK (salutation IS NULL OR salutation = ANY (ARRAY[
  'Mr.'::TEXT, 
  'Mrs.'::TEXT, 
  'Miss'::TEXT, 
  'Ms.'::TEXT,
  'Dr.'::TEXT,
  'Prof.'::TEXT
]));

-- Add comment
COMMENT ON COLUMN public.staff.salutation IS 'Salutation/title for staff member (Mr., Mrs., Miss, Ms., Dr., Prof.)';
