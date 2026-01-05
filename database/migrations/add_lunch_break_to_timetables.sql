-- Add is_lunch_break column to timetables table
-- This allows marking specific periods as lunch breaks

ALTER TABLE public.timetables 
ADD COLUMN is_lunch_break BOOLEAN NOT NULL DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN public.timetables.is_lunch_break IS 'Indicates whether this period is a lunch break';

-- When is_lunch_break is true, subject_id and teacher_id can be NULL
-- The start_time and end_time will define the lunch break duration
