-- Academic Years seed data for Smart School ERP
-- Creates academic year entries for testing
-- Update tenant_id to match your actual tenant before running

-- Insert academic years for the test tenant
INSERT INTO academic_years (id, tenant_id, name, start_date, end_date, is_current, created_at)
VALUES
  -- Previous academic year (2023-2024)
  ('ay000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2023-2024', '2023-04-01', '2024-03-31', false, now()),
  
  -- Current academic year (2024-2025)
  ('ay000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '2024-2025', '2024-04-01', '2025-03-31', true, now()),
  
  -- Next academic year (2025-2026)
  ('ay000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '2025-2026', '2025-04-01', '2026-03-31', false, now())
ON CONFLICT (id) DO NOTHING;

-- Verification query (uncomment to check after inserting)
-- SELECT id, name, start_date, end_date, is_current 
-- FROM academic_years 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
-- ORDER BY start_date DESC;

-- Notes:
-- 1. Replace '00000000-0000-0000-0000-000000000001' with your actual tenant_id if different
-- 2. Adjust dates based on your school's academic calendar
-- 3. Only one academic year should have is_current = true at a time
-- 4. Run this in Supabase SQL editor or via psql:
--    psql "postgresql://<user>:<pass>@<host>:5432/<db>" -f database/seeds/academic_years_seed.sql
