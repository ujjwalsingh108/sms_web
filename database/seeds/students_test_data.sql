-- =====================================================
-- STUDENT ONBOARDING TEST DATA
-- For testing student dashboard CRUD operations
-- =====================================================
-- This file provides comprehensive test data covering:
-- - Students with various statuses and demographics
-- - Guardian relationships
-- - Student assignments to different classes/sections
-- - Edge cases for testing validation
-- =====================================================

-- Prerequisites: Run academic_test_data.sql first to ensure classes and sections exist

-- Use the same test tenant from academic_test_data.sql
-- Test Tenant ID: 00000000-0000-0000-0000-000000000001

-- =====================================================
-- STUDENTS - Active Students (Grade 1, Section A)
-- =====================================================

INSERT INTO students (id, tenant_id, admission_no, first_name, last_name, date_of_birth, gender, blood_group, email, phone, address, class_id, section_id, admission_date, status, created_at, updated_at)
VALUES
  -- Student 1: Complete profile with all fields
  (
    'st100000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024001',
    'Aarav',
    'Sharma',
    '2018-03-15',
    'male',
    'A+',
    'aarav.sharma@example.com',
    '+91-9876543210',
    '123 MG Road, Bangalore, Karnataka - 560001',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    's1000000-0000-0000-0000-000000000001', -- Section A
    '2024-04-01',
    'active',
    now(),
    now()
  ),
  
  -- Student 2: Minimal required fields only
  (
    'st100000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024002',
    'Ananya',
    'Patel',
    '2018-06-22',
    'female',
    NULL,
    NULL,
    NULL,
    'Flat 45, Green Park Society, Pune - 411001',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    's1000000-0000-0000-0000-000000000001', -- Section A
    '2024-04-05',
    'active',
    now(),
    now()
  ),
  
  -- Student 3: Student with different blood group
  (
    'st100000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024003',
    'Rohan',
    'Kumar',
    '2018-01-10',
    'male',
    'O+',
    'rohan.kumar@example.com',
    '+91-8765432109',
    '67 Park Street, Kolkata, West Bengal - 700016',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    's1000000-0000-0000-0000-000000000001', -- Section A
    '2024-04-01',
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STUDENTS - Grade 1, Section B
-- =====================================================

INSERT INTO students (id, tenant_id, admission_no, first_name, last_name, date_of_birth, gender, blood_group, email, phone, address, class_id, section_id, admission_date, status, created_at, updated_at)
VALUES
  -- Student 4: Female student with AB+ blood group
  (
    'st100000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024004',
    'Priya',
    'Singh',
    '2018-05-18',
    'female',
    'AB+',
    'priya.singh@example.com',
    '+91-7654321098',
    '89 Beach Road, Chennai, Tamil Nadu - 600001',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    's1000000-0000-0000-0000-000000000002', -- Section B
    '2024-04-10',
    'active',
    now(),
    now()
  ),
  
  -- Student 5: Student with B- blood group
  (
    'st100000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024005',
    'Arjun',
    'Reddy',
    '2018-08-25',
    'male',
    'B-',
    'arjun.reddy@example.com',
    '+91-6543210987',
    '234 Hitech City, Hyderabad, Telangana - 500081',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    's1000000-0000-0000-0000-000000000002', -- Section B
    '2024-04-15',
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STUDENTS - Grade 2, Section A
-- =====================================================

INSERT INTO students (id, tenant_id, admission_no, first_name, last_name, date_of_birth, gender, blood_group, email, phone, address, class_id, section_id, admission_date, status, created_at, updated_at)
VALUES
  -- Student 6: Older student in Grade 2
  (
    'st100000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024006',
    'Sneha',
    'Gupta',
    '2017-02-14',
    'female',
    'A-',
    'sneha.gupta@example.com',
    '+91-5432109876',
    '456 Civil Lines, Delhi - 110054',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    's1000000-0000-0000-0000-000000000011', -- Section A
    '2023-04-01',
    'active',
    now(),
    now()
  ),
  
  -- Student 7: Student with unique name
  (
    'st100000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024007',
    'Vivaan',
    'Mehta',
    '2017-09-30',
    'male',
    'O-',
    'vivaan.mehta@example.com',
    '+91-4321098765',
    '78 Residency Road, Bangalore, Karnataka - 560025',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    's1000000-0000-0000-0000-000000000011', -- Section A
    '2023-04-01',
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STUDENTS - Grade 2, Section B
-- =====================================================

INSERT INTO students (id, tenant_id, admission_no, first_name, last_name, date_of_birth, gender, blood_group, email, phone, address, class_id, section_id, admission_date, status, created_at, updated_at)
VALUES
  -- Student 8: Student with hyphenated last name
  (
    'st100000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024008',
    'Ishaan',
    'Verma-Kapoor',
    '2017-04-12',
    'male',
    'AB-',
    'ishaan.vk@example.com',
    '+91-3210987654',
    '912 Lake View, Udaipur, Rajasthan - 313001',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    's1000000-0000-0000-0000-000000000012', -- Section B
    '2023-04-01',
    'active',
    now(),
    now()
  ),
  
  -- Student 9: Student with 'other' gender
  (
    'st100000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024009',
    'Aanya',
    'Joshi',
    '2017-11-05',
    'female',
    'B+',
    'aanya.joshi@example.com',
    '+91-2109876543',
    '345 Hill Station Road, Shimla, HP - 171001',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    's1000000-0000-0000-0000-000000000012', -- Section B
    '2023-04-01',
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STUDENTS - Grade 3 (Various statuses)
-- =====================================================

INSERT INTO students (id, tenant_id, admission_no, first_name, last_name, date_of_birth, gender, blood_group, email, phone, address, class_id, section_id, admission_date, status, created_at, updated_at)
VALUES
  -- Student 10: Active student in Grade 3
  (
    'st100000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024010',
    'Kabir',
    'Malhotra',
    '2016-07-20',
    'male',
    'A+',
    'kabir.malhotra@example.com',
    '+91-1098765432',
    '567 Market Street, Mumbai, Maharashtra - 400001',
    'c1000000-0000-0000-0000-000000000003', -- Grade 3
    's1000000-0000-0000-0000-000000000021', -- Section A
    '2022-04-01',
    'active',
    now(),
    now()
  ),
  
  -- Student 11: Inactive student (for testing status filters)
  (
    'st100000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024011',
    'Diya',
    'Nair',
    '2016-12-08',
    'female',
    'O+',
    'diya.nair@example.com',
    '+91-0987654321',
    '890 Temple Road, Kochi, Kerala - 682001',
    'c1000000-0000-0000-0000-000000000003', -- Grade 3
    's1000000-0000-0000-0000-000000000021', -- Section A
    '2022-04-01',
    'inactive',
    now(),
    now()
  ),
  
  -- Student 12: Transferred student (for testing status filters)
  (
    'st100000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'ADM2023012',
    'Aditya',
    'Desai',
    '2016-03-25',
    'male',
    'B+',
    'aditya.desai@example.com',
    '+91-9876543211',
    '123 Station Road, Surat, Gujarat - 395001',
    'c1000000-0000-0000-0000-000000000003', -- Grade 3
    's1000000-0000-0000-0000-000000000022', -- Section B
    '2022-04-01',
    'transferred',
    now() - INTERVAL '3 months',
    now() - INTERVAL '3 months'
  ),
  
  -- Student 13: Student without class/section assignment (edge case)
  (
    'st100000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024013',
    'Myra',
    'Bose',
    '2018-10-11',
    'female',
    'AB+',
    'myra.bose@example.com',
    '+91-8765432110',
    '234 Lake Road, Bhopal, MP - 462001',
    NULL, -- No class assigned yet
    NULL, -- No section assigned yet
    '2024-06-15',
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STUDENTS - Recent Admissions (for testing sorting)
-- =====================================================

INSERT INTO students (id, tenant_id, admission_no, first_name, last_name, date_of_birth, gender, blood_group, email, phone, address, class_id, section_id, admission_date, status, created_at, updated_at)
VALUES
  -- Student 14: Very recent admission
  (
    'st100000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024014',
    'Vihaan',
    'Chatterjee',
    '2018-02-28',
    'male',
    'A-',
    'vihaan.c@example.com',
    '+91-7654321099',
    '456 Park Avenue, Guwahati, Assam - 781001',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    's1000000-0000-0000-0000-000000000001', -- Section A
    CURRENT_DATE - INTERVAL '5 days',
    'active',
    now() - INTERVAL '5 days',
    now() - INTERVAL '5 days'
  ),
  
  -- Student 15: Recent admission with minimal data
  (
    'st100000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'ADM2024015',
    'Saanvi',
    'Iyer',
    '2018-09-14',
    'female',
    NULL,
    NULL,
    NULL,
    '789 Temple Street, Madurai, Tamil Nadu - 625001',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    's1000000-0000-0000-0000-000000000002', -- Section B
    CURRENT_DATE - INTERVAL '2 days',
    'active',
    now() - INTERVAL '2 days',
    now() - INTERVAL '2 days'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- GUARDIANS - Primary and Secondary Guardians
-- =====================================================

INSERT INTO guardians (id, tenant_id, student_id, name, relationship, phone, email, occupation, address, is_primary, created_at)
VALUES
  -- Guardians for Student 1 (Aarav Sharma) - Both parents
  (
    'gd100000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000001',
    'Rajesh Sharma',
    'Father',
    '+91-9876543210',
    'rajesh.sharma@example.com',
    'Software Engineer',
    '123 MG Road, Bangalore, Karnataka - 560001',
    true,
    now()
  ),
  (
    'gd100000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000001',
    'Priya Sharma',
    'Mother',
    '+91-9876543211',
    'priya.sharma@example.com',
    'Teacher',
    '123 MG Road, Bangalore, Karnataka - 560001',
    false,
    now()
  ),
  
  -- Guardian for Student 2 (Ananya Patel) - Single parent
  (
    'gd100000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000002',
    'Amit Patel',
    'Father',
    '+91-8765432100',
    'amit.patel@example.com',
    'Business Owner',
    'Flat 45, Green Park Society, Pune - 411001',
    true,
    now()
  ),
  
  -- Guardians for Student 3 (Rohan Kumar) - Father and Grandfather
  (
    'gd100000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000003',
    'Vikram Kumar',
    'Father',
    '+91-8765432109',
    'vikram.kumar@example.com',
    'Doctor',
    '67 Park Street, Kolkata, West Bengal - 700016',
    true,
    now()
  ),
  (
    'gd100000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000003',
    'Ramesh Kumar',
    'Grandfather',
    '+91-8765432108',
    'ramesh.kumar@example.com',
    'Retired',
    '67 Park Street, Kolkata, West Bengal - 700016',
    false,
    now()
  ),
  
  -- Guardian for Student 4 (Priya Singh)
  (
    'gd100000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000004',
    'Sunita Singh',
    'Mother',
    '+91-7654321098',
    'sunita.singh@example.com',
    'Nurse',
    '89 Beach Road, Chennai, Tamil Nadu - 600001',
    true,
    now()
  ),
  
  -- Guardian for Student 5 (Arjun Reddy)
  (
    'gd100000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000005',
    'Ramesh Reddy',
    'Father',
    '+91-6543210987',
    'ramesh.reddy@example.com',
    'IT Manager',
    '234 Hitech City, Hyderabad, Telangana - 500081',
    true,
    now()
  ),
  
  -- Guardian for Student 6 (Sneha Gupta)
  (
    'gd100000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000006',
    'Manoj Gupta',
    'Father',
    '+91-5432109876',
    'manoj.gupta@example.com',
    'Government Officer',
    '456 Civil Lines, Delhi - 110054',
    true,
    now()
  ),
  
  -- Guardian for Student 7 (Vivaan Mehta)
  (
    'gd100000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000007',
    'Neha Mehta',
    'Mother',
    '+91-4321098765',
    'neha.mehta@example.com',
    'Architect',
    '78 Residency Road, Bangalore, Karnataka - 560025',
    true,
    now()
  ),
  
  -- Guardian for Student 8 (Ishaan Verma-Kapoor)
  (
    'gd100000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000008',
    'Sanjay Verma',
    'Father',
    '+91-3210987654',
    'sanjay.verma@example.com',
    'Hotel Manager',
    '912 Lake View, Udaipur, Rajasthan - 313001',
    true,
    now()
  ),
  
  -- Guardian for Student 9 (Aanya Joshi)
  (
    'gd100000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000009',
    'Pooja Joshi',
    'Mother',
    '+91-2109876543',
    'pooja.joshi@example.com',
    'Artist',
    '345 Hill Station Road, Shimla, HP - 171001',
    true,
    now()
  ),
  
  -- Guardian for Student 10 (Kabir Malhotra)
  (
    'gd100000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000010',
    'Ashish Malhotra',
    'Father',
    '+91-1098765432',
    'ashish.malhotra@example.com',
    'Banker',
    '567 Market Street, Mumbai, Maharashtra - 400001',
    true,
    now()
  ),
  
  -- Guardian for Student 11 (Diya Nair) - Inactive student
  (
    'gd100000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000011',
    'Krishna Nair',
    'Mother',
    '+91-0987654321',
    'krishna.nair@example.com',
    'Lawyer',
    '890 Temple Road, Kochi, Kerala - 682001',
    true,
    now()
  ),
  
  -- Guardian for Student 12 (Aditya Desai) - Transferred student
  (
    'gd100000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000012',
    'Jayesh Desai',
    'Father',
    '+91-9876543211',
    'jayesh.desai@example.com',
    'Textile Business',
    '123 Station Road, Surat, Gujarat - 395001',
    true,
    now()
  ),
  
  -- Guardian for Student 13 (Myra Bose) - No class assigned
  (
    'gd100000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000013',
    'Subhash Bose',
    'Father',
    '+91-8765432110',
    'subhash.bose@example.com',
    'Professor',
    '234 Lake Road, Bhopal, MP - 462001',
    true,
    now()
  ),
  
  -- Guardians for Student 14 (Vihaan Chatterjee) - Recent admission
  (
    'gd100000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000014',
    'Soumya Chatterjee',
    'Mother',
    '+91-7654321099',
    'soumya.c@example.com',
    'Journalist',
    '456 Park Avenue, Guwahati, Assam - 781001',
    true,
    now() - INTERVAL '5 days'
  ),
  
  -- Guardian for Student 15 (Saanvi Iyer) - Recent admission with minimal data
  (
    'gd100000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000015',
    'Venkat Iyer',
    'Father',
    '+91-6543210988',
    'venkat.iyer@example.com',
    'Priest',
    '789 Temple Street, Madurai, Tamil Nadu - 625001',
    true,
    now() - INTERVAL '2 days'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify the data was inserted correctly

-- Check total students by status
-- SELECT status, COUNT(*) as count FROM students 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
-- GROUP BY status ORDER BY status;

-- Check students by class and section
-- SELECT c.name as class, s.name as section, COUNT(st.id) as student_count
-- FROM students st
-- JOIN classes c ON st.class_id = c.id
-- LEFT JOIN sections s ON st.section_id = s.id
-- WHERE st.tenant_id = '00000000-0000-0000-0000-000000000001'
-- GROUP BY c.name, s.name
-- ORDER BY c.name, s.name;

-- Check students with their guardians
-- SELECT st.admission_no, st.first_name, st.last_name, 
--        g.name as guardian_name, g.relationship, g.is_primary
-- FROM students st
-- LEFT JOIN guardians g ON st.id = g.student_id
-- WHERE st.tenant_id = '00000000-0000-0000-0000-000000000001'
-- ORDER BY st.admission_no, g.is_primary DESC;

-- Check students by blood group
-- SELECT blood_group, COUNT(*) as count FROM students 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
-- GROUP BY blood_group ORDER BY blood_group;

-- Check students by gender
-- SELECT gender, COUNT(*) as count FROM students 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
-- GROUP BY gender ORDER BY gender;

-- =====================================================
-- NOTES FOR TESTING
-- =====================================================
-- This seed data provides:
-- 
-- 1. **Active Students (12)** - For standard CRUD operations
-- 2. **Inactive Student (1)** - For testing status filters
-- 3. **Transferred Student (1)** - For testing status changes
-- 4. **Unassigned Student (1)** - For testing edge cases
-- 5. **Recent Admissions (2)** - For testing sorting by date
--
-- Blood Groups Covered: A+, A-, B+, B-, AB+, AB-, O+, O-
-- Genders: Male (8), Female (7)
-- Classes: Grade 1 (7), Grade 2 (4), Grade 3 (3), Unassigned (1)
-- Sections: Distributed across A and B sections
--
-- Guardian Scenarios:
-- - Both parents (1 student)
-- - Single parent (8 students)
-- - Parent + Grandparent (1 student)
-- - Various occupations and relationships
--
-- Use Cases for Testing:
-- - Create: Add new students with/without guardians
-- - Read: List all, filter by class/section/status, search by name/admission
-- - Update: Change class/section, update personal info, modify status
-- - Delete: Soft delete students (set status to inactive)
-- - Bulk operations: Promote students to next class
-- - Validation: Duplicate admission numbers, required fields
-- - Relationships: Students with multiple guardians
-- - Edge cases: Students without class assignment
--
-- =====================================================
