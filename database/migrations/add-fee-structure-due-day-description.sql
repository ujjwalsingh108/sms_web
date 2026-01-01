-- =====================================================
-- ADD DUE_DAY AND DESCRIPTION TO FEE_STRUCTURES
-- Migration: Add missing columns for fee structures
-- Date: 2026-01-01
-- =====================================================

-- Add due_day column (1-31) for monthly/quarterly fees
ALTER TABLE fee_structures
  ADD COLUMN IF NOT EXISTS due_day INTEGER,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Add constraint to ensure due_day is between 1 and 31
ALTER TABLE fee_structures
  ADD CONSTRAINT fee_structures_due_day_check 
  CHECK (due_day IS NULL OR (due_day >= 1 AND due_day <= 31));

-- Add comments
COMMENT ON COLUMN fee_structures.due_day IS 'Day of month when fee is due (1-31)';
COMMENT ON COLUMN fee_structures.description IS 'Additional details about the fee structure';

-- Set default due_day for existing records (1st of month)
UPDATE fee_structures
SET due_day = 1
WHERE due_day IS NULL AND frequency IN ('monthly', 'quarterly');
