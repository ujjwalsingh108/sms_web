-- =====================================================
-- ADD PASSWORD COLUMN TO STAFF TABLE
-- Migration to add password column for staff authentication
-- =====================================================

-- NOTE: This column is deprecated and should not be used.
-- Staff authentication is now handled through Supabase Auth.
-- The user account is created in auth.users and linked via user_id.
-- This column is kept for backward compatibility only.

-- Add password column to staff table (DEPRECATED - DO NOT USE)
ALTER TABLE staff 
ADD COLUMN IF NOT EXISTS password TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN staff.password IS 'DEPRECATED: This column is no longer used. Staff authentication is handled through Supabase Auth (auth.users table). User accounts are created via admin.createUser() and linked via user_id column.';

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. Staff authentication is now handled through Supabase Auth
-- 2. When creating staff, a user is created in auth.users first
-- 3. The user_id from auth.users is stored in staff.user_id
-- 4. Passwords are managed by Supabase Auth, not stored here
-- 5. This password column is kept for backward compatibility only
-- =====================================================
