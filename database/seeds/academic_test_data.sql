-- Academic test data for Smart School ERP
-- Inserts example tenant, classes and sections for local testing
-- Adjust tenant_id values to match your environment before running

-- Ensure extensions required for gen_random_uuid are enabled (Supabase usually has pgcrypto)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Example tenant (no-op if already exists)
INSERT INTO tenants (id, name, subdomain, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Test School', 'test-school', now())
ON CONFLICT (id) DO NOTHING;

-- Classes
INSERT INTO classes (id, tenant_id, name, description, created_at)
VALUES
  ('c1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Grade 1', 'Primary - Grade 1', now()),
  ('c1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Grade 2', 'Primary - Grade 2', now()),
  ('c1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Grade 3', 'Primary - Grade 3', now())
ON CONFLICT (id) DO NOTHING;

-- Sections for Grade 1
INSERT INTO sections (id, tenant_id, class_id, name, room_number, capacity, created_at)
VALUES
  ('s1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'A', 'Room 101', 30, now()),
  ('s1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'B', 'Room 102', 30, now())
ON CONFLICT (id) DO NOTHING;

-- Sections for Grade 2
INSERT INTO sections (id, tenant_id, class_id, name, room_number, capacity, created_at)
VALUES
  ('s1000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'A', 'Room 201', 32, now()),
  ('s1000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'B', 'Room 202', 32, now())
ON CONFLICT (id) DO NOTHING;

-- Sections for Grade 3
INSERT INTO sections (id, tenant_id, class_id, name, room_number, capacity, created_at)
VALUES
  ('s1000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'A', 'Room 301', 28, now()),
  ('s1000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'B', 'Room 302', 28, now())
ON CONFLICT (id) DO NOTHING;

-- Quick checks (selects) you can run after seeding
-- SELECT id, name FROM classes WHERE tenant_id = '00000000-0000-0000-0000-000000000001' ORDER BY name;
-- SELECT id, name, class_id, room_number FROM sections WHERE tenant_id = '00000000-0000-0000-0000-000000000001' ORDER BY class_id, name;

-- Notes:
-- - If your tenant IDs differ, replace '00000000-0000-0000-0000-000000000001' with the correct tenant UUID.
-- - Run this file in Supabase SQL editor or via psql connected to your database.
-- Example psql command:
-- psql "postgresql://<user>:<pass>@<host>:5432/<db>" -f database/seeds/academic_test_data.sql
