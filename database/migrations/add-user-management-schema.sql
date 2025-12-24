-- =====================================================
-- USER MANAGEMENT SCHEMA UPDATES
-- =====================================================
-- Adds user_id columns to students and guardians tables
-- to enable login functionality for these user types

-- Add user_id to students table (for student portal access)
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS user_id UUID NULL,
ADD CONSTRAINT students_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add user_id to guardians table (for parent/guardian portal access)
ALTER TABLE public.guardians
ADD COLUMN IF NOT EXISTS user_id UUID NULL,
ADD CONSTRAINT guardians_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_guardians_user_id ON public.guardians(user_id);

-- Add staff_type column to staff table to categorize different types
ALTER TABLE public.staff
ADD COLUMN IF NOT EXISTS staff_type TEXT DEFAULT 'teacher'::TEXT;

-- Add constraint to validate staff_type
ALTER TABLE public.staff
DROP CONSTRAINT IF EXISTS staff_type_check;

ALTER TABLE public.staff
ADD CONSTRAINT staff_type_check 
  CHECK (staff_type = ANY (ARRAY[
    'teacher'::TEXT, 
    'principal'::TEXT, 
    'vice_principal'::TEXT,
    'clerk'::TEXT, 
    'librarian'::TEXT, 
    'driver'::TEXT,
    'security'::TEXT,
    'nurse'::TEXT,
    'accountant'::TEXT,
    'lab_assistant'::TEXT,
    'sports_coach'::TEXT,
    'counselor'::TEXT,
    'other'::TEXT
  ]));

-- Comments for documentation
COMMENT ON COLUMN public.students.user_id IS 'Links student to auth.users for portal access';
COMMENT ON COLUMN public.guardians.user_id IS 'Links guardian/parent to auth.users for portal access';
COMMENT ON COLUMN public.staff.staff_type IS 'Type of staff member (teacher, principal, clerk, librarian, driver, etc.)';
