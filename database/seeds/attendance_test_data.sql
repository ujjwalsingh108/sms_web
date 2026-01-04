-- =====================================================
-- ATTENDANCE MANAGEMENT TEST DATA
-- For testing student and staff attendance features
-- =====================================================
-- This file provides comprehensive test data covering:
-- - Student attendance with various statuses
-- - Staff attendance with check-in/check-out times
-- - Historical attendance data (past 30 days)
-- - Different attendance patterns and edge cases
-- =====================================================

-- Prerequisites: 
-- 1. Run academic_test_data.sql first (for tenant, classes, sections)
-- 2. Run students_test_data.sql (for student records)
-- 3. Run staff_test_data.sql (for staff records)

-- Test Tenant ID: 00000000-0000-0000-0000-000000000001

-- =====================================================
-- STUDENT ATTENDANCE - Last 30 Days
-- =====================================================

-- Current Week (Last 5 days) - Mixed attendance
INSERT INTO student_attendance (id, tenant_id, student_id, class_id, section_id, date, status, remarks, created_at)
VALUES
  -- Day 1 (5 days ago) - All Present
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', NULL, now()),

  -- Day 2 (4 days ago) - One Absent
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'absent', 'Sick leave', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'present', NULL, now()),

  -- Day 3 (3 days ago) - Half Day and Late
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'half_day', 'Doctor appointment', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'late', 'Arrived at 10:30 AM', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'present', NULL, now()),

  -- Day 4 (2 days ago) - All Present
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'present', NULL, now()),

  -- Day 5 (1 day ago) - Multiple Absences
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'absent', 'Family emergency', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'absent', 'Unwell', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st100000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'present', NULL, now());

-- Grade 2 Students - Last Week
INSERT INTO student_attendance (id, tenant_id, student_id, class_id, section_id, date, status, remarks, created_at)
VALUES
  -- Grade 2, Section A students (last 5 days)
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'late', 'Transport delay', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'absent', 'Fever', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'present', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'st200000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 's2000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'present', NULL, now());

-- Historical Data - Past 30 Days (Sample Pattern)
-- Generate attendance for first student showing 90% attendance rate
INSERT INTO student_attendance (id, tenant_id, student_id, class_id, section_id, date, status, created_at)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'st100000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  's1000000-0000-0000-0000-000000000001',
  CURRENT_DATE - (generate_series || ' days')::INTERVAL,
  CASE 
    WHEN generate_series % 10 = 0 THEN 'absent'
    WHEN generate_series % 15 = 0 THEN 'half_day'
    ELSE 'present'
  END,
  now()
FROM generate_series(6, 30) AS generate_series
WHERE EXTRACT(DOW FROM CURRENT_DATE - (generate_series || ' days')::INTERVAL) BETWEEN 1 AND 5;

-- =====================================================
-- STAFF ATTENDANCE - Last 30 Days
-- =====================================================

-- Current Week (Last 5 days) - Teaching Staff
INSERT INTO staff_attendance (id, tenant_id, staff_id, date, status, check_in, check_out, notes, created_at)
VALUES
  -- Day 1 (5 days ago)
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '5 days', 'present', '08:00:00', '17:00:00', 'Regular day', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '5 days', 'present', '08:15:00', '17:15:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '5 days', 'present', '08:30:00', '16:30:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '5 days', 'present', '08:00:00', '17:00:00', NULL, now()),
  
  -- Day 2 (4 days ago) - One on Leave
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '4 days', 'present', '08:05:00', '17:10:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '4 days', 'on_leave', NULL, NULL, 'Casual leave', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '4 days', 'present', '08:20:00', '16:45:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '4 days', 'present', '08:10:00', '17:05:00', NULL, now()),
  
  -- Day 3 (3 days ago) - Half Day
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '3 days', 'present', '08:00:00', '17:00:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '3 days', 'present', '08:15:00', '17:20:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '3 days', 'half_day', '08:30:00', '13:00:00', 'Personal work', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '3 days', 'present', '08:00:00', '17:00:00', NULL, now()),
  
  -- Day 4 (2 days ago) - All Present
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '2 days', 'present', '08:00:00', '17:30:00', 'Parent meeting', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '2 days', 'present', '08:15:00', '17:15:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '2 days', 'present', '08:30:00', '16:30:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '2 days', 'present', '08:00:00', '17:00:00', NULL, now()),
  
  -- Day 5 (1 day ago) - One Absent
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', 'present', '08:00:00', '17:00:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '1 day', 'present', '08:15:00', '17:15:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '1 day', 'present', '08:30:00', '16:30:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '1 day', 'absent', NULL, NULL, 'Sick leave', now());

-- Non-Teaching Staff - Last Week
INSERT INTO staff_attendance (id, tenant_id, staff_id, date, status, check_in, check_out, notes, created_at)
VALUES
  -- Administrative staff (5 days)
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '5 days', 'present', '09:00:00', '18:00:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '4 days', 'present', '09:05:00', '18:10:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '3 days', 'present', '09:00:00', '18:00:00', NULL, now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '2 days', 'present', '09:00:00', '18:15:00', 'Monthly report', now()),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'sf100000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '1 day', 'present', '09:00:00', '18:00:00', NULL, now());

-- Historical Data - Past 30 Days for Principal (Perfect Attendance)
INSERT INTO staff_attendance (id, tenant_id, staff_id, date, status, check_in, check_out, created_at)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'sf100000-0000-0000-0000-000000000001',
  CURRENT_DATE - (generate_series || ' days')::INTERVAL,
  'present',
  '08:00:00',
  '17:00:00',
  now()
FROM generate_series(6, 30) AS generate_series
WHERE EXTRACT(DOW FROM CURRENT_DATE - (generate_series || ' days')::INTERVAL) BETWEEN 1 AND 5;

-- Historical Data - Teacher with some leaves
INSERT INTO staff_attendance (id, tenant_id, staff_id, date, status, check_in, check_out, created_at)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'sf100000-0000-0000-0000-000000000003',
  CURRENT_DATE - (generate_series || ' days')::INTERVAL,
  CASE 
    WHEN generate_series % 12 = 0 THEN 'on_leave'
    WHEN generate_series % 20 = 0 THEN 'half_day'
    ELSE 'present'
  END,
  CASE 
    WHEN generate_series % 12 = 0 THEN NULL
    ELSE '08:30:00'
  END,
  CASE 
    WHEN generate_series % 12 = 0 THEN NULL
    WHEN generate_series % 20 = 0 THEN '13:00:00'
    ELSE '16:30:00'
  END,
  now()
FROM generate_series(6, 30) AS generate_series
WHERE EXTRACT(DOW FROM CURRENT_DATE - (generate_series || ' days')::INTERVAL) BETWEEN 1 AND 5;

-- =====================================================
-- ATTENDANCE STATISTICS SUMMARY
-- =====================================================

-- Student Attendance Summary (for verification)
SELECT 
  'Student Attendance' AS category,
  status,
  COUNT(*) AS count
FROM student_attendance
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
GROUP BY status
ORDER BY status;

-- Staff Attendance Summary (for verification)
SELECT 
  'Staff Attendance' AS category,
  status,
  COUNT(*) AS count
FROM staff_attendance
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
GROUP BY status
ORDER BY status;

-- Recent Attendance (Last 7 Days)
SELECT 
  'Last 7 Days Student' AS category,
  date::DATE AS date,
  COUNT(*) AS total_records,
  COUNT(*) FILTER (WHERE status = 'present') AS present,
  COUNT(*) FILTER (WHERE status = 'absent') AS absent,
  COUNT(*) FILTER (WHERE status = 'half_day') AS half_day,
  COUNT(*) FILTER (WHERE status = 'late') AS late
FROM student_attendance
WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
  AND date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date
ORDER BY date DESC;

-- =====================================================
-- END OF ATTENDANCE TEST DATA
-- =====================================================

COMMENT ON TABLE student_attendance IS 'Test data includes 30 days of attendance for various students with different patterns';
COMMENT ON TABLE staff_attendance IS 'Test data includes 30 days of staff attendance with check-in/check-out times and various status types';
