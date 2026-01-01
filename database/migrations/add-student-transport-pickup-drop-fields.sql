-- =====================================================
-- ADD PICKUP AND DROP FIELDS TO STUDENT TRANSPORT
-- Migration: Add separate pickup and drop stop support
-- Date: 2026-01-01
-- =====================================================

-- Add new columns for pickup and drop information
ALTER TABLE student_transport
  ADD COLUMN IF NOT EXISTS pickup_stop_id UUID REFERENCES route_stops(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS drop_stop_id UUID REFERENCES route_stops(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS pickup_time TIME,
  ADD COLUMN IF NOT EXISTS drop_time TIME;

-- Migrate existing data: copy stop_id to pickup_stop_id
UPDATE student_transport
SET pickup_stop_id = stop_id
WHERE stop_id IS NOT NULL AND pickup_stop_id IS NULL;

-- Copy pickup_time from route_stops if available
UPDATE student_transport st
SET pickup_time = rs.pickup_time
FROM route_stops rs
WHERE st.pickup_stop_id = rs.id 
  AND st.pickup_time IS NULL;

-- Copy drop_time from route_stops if available
UPDATE student_transport st
SET drop_time = rs.drop_time
FROM route_stops rs
WHERE st.drop_stop_id = rs.id 
  AND st.drop_time IS NULL;

-- Add comment
COMMENT ON COLUMN student_transport.pickup_stop_id IS 'Stop where student is picked up (morning route)';
COMMENT ON COLUMN student_transport.drop_stop_id IS 'Stop where student is dropped (evening route)';
COMMENT ON COLUMN student_transport.pickup_time IS 'Time when student is picked up';
COMMENT ON COLUMN student_transport.drop_time IS 'Time when student is dropped off';
COMMENT ON COLUMN student_transport.stop_id IS 'DEPRECATED: Use pickup_stop_id and drop_stop_id instead';
