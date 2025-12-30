-- =====================================================
-- STAFF MANAGEMENT TEST DATA
-- For testing staff dashboard CRUD operations
-- =====================================================
-- This file provides comprehensive test data covering:
-- - Staff members with various designations and departments
-- - Different employee statuses (active, inactive, on_leave)
-- - Diverse qualifications and salary ranges
-- - Edge cases for testing validation
-- =====================================================

-- Prerequisites: Run academic_test_data.sql first to ensure tenant exists

-- Use the same test tenant from academic_test_data.sql
-- Test Tenant ID: 00000000-0000-0000-0000-000000000001

-- =====================================================
-- STAFF - TEACHING STAFF (PRIMARY)
-- =====================================================

INSERT INTO staff (id, tenant_id, employee_id, salutation, first_name, last_name, email, phone, date_of_birth, gender, address, qualification, designation, department, date_of_joining, salary, status, created_at, updated_at)
VALUES
  -- Staff 1: Principal - Complete profile
  (
    'sf100000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024001',
    'Dr.',
    'Rajesh',
    'Sharma',
    'rajesh.sharma@school.edu.in',
    '+91-9876543210',
    '1975-04-15',
    'male',
    '45 Palm Grove, Bangalore, Karnataka - 560001',
    'Ph.D. in Education Management, M.Ed.',
    'Principal',
    'Administration',
    '2020-01-15',
    125000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 2: Vice Principal
  (
    'sf100000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024002',
    'Mrs.',
    'Priya',
    'Kumar',
    'priya.kumar@school.edu.in',
    '+91-9876543211',
    '1978-08-22',
    'female',
    '67 Green Park, Bangalore, Karnataka - 560002',
    'M.Ed., B.Ed.',
    'Vice Principal',
    'Administration',
    '2020-03-01',
    95000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 3: Senior Mathematics Teacher
  (
    'sf100000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024003',
    'Ramesh',
    'Patel',
    'ramesh.patel@school.edu.in',
    '+91-9876543212',
    '1980-12-10',
    'male',
    '89 Lake View, Pune, Maharashtra - 411001',
    'M.Sc. Mathematics, B.Ed.',
    'Senior Teacher',
    'Mathematics',
    '2018-06-01',
    55000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 4: English Teacher
  (
    'sf100000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024004',
    'Anjali',
    'Desai',
    'anjali.desai@school.edu.in',
    '+91-9876543213',
    '1985-03-18',
    'female',
    '23 Hill Station Road, Shimla, HP - 171001',
    'M.A. English, B.Ed.',
    'Teacher',
    'English',
    '2019-07-15',
    48000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 5: Science Teacher
  (
    'sf100000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024005',
    'Vikram',
    'Singh',
    'vikram.singh@school.edu.in',
    '+91-9876543214',
    '1982-09-25',
    'male',
    '56 Beach Road, Chennai, Tamil Nadu - 600001',
    'M.Sc. Physics, B.Ed.',
    'Teacher',
    'Science',
    '2019-08-01',
    50000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 6: Hindi Teacher
  (
    'sf100000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024006',
    'Sunita',
    'Verma',
    'sunita.verma@school.edu.in',
    '+91-9876543215',
    '1988-01-12',
    'female',
    '34 Park Street, Kolkata, West Bengal - 700016',
    'M.A. Hindi, B.Ed.',
    'Teacher',
    'Hindi',
    '2020-06-15',
    45000.00,
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STAFF - TEACHING STAFF (SECONDARY)
-- =====================================================

INSERT INTO staff (id, tenant_id, employee_id, first_name, last_name, email, phone, date_of_birth, gender, address, qualification, designation, department, date_of_joining, salary, status, created_at, updated_at)
VALUES
  -- Staff 7: Computer Science Teacher
  (
    'sf100000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024007',
    'Amit',
    'Gupta',
    'amit.gupta@school.edu.in',
    '+91-9876543216',
    '1986-05-20',
    'male',
    '78 Tech Park, Hyderabad, Telangana - 500081',
    'M.C.A., B.Tech Computer Science',
    'Teacher',
    'Computer Science',
    '2021-01-10',
    52000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 8: Social Studies Teacher
  (
    'sf100000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024008',
    'Kavita',
    'Sharma',
    'kavita.sharma@school.edu.in',
    '+91-9876543217',
    '1984-11-08',
    'female',
    '45 Civil Lines, Delhi - 110054',
    'M.A. History, B.Ed.',
    'Teacher',
    'Social Studies',
    '2020-08-01',
    47000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 9: Physical Education Teacher
  (
    'sf100000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024009',
    'Rahul',
    'Yadav',
    'rahul.yadav@school.edu.in',
    '+91-9876543218',
    '1990-07-15',
    'male',
    '90 Stadium Road, Mumbai, Maharashtra - 400001',
    'M.P.Ed., B.P.Ed.',
    'Physical Education Teacher',
    'Sports',
    '2021-06-01',
    42000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 10: Art Teacher
  (
    'sf100000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024010',
    'Meera',
    'Nair',
    'meera.nair@school.edu.in',
    '+91-9876543219',
    '1987-02-28',
    'female',
    '12 Art District, Kochi, Kerala - 682001',
    'M.F.A., B.F.A.',
    'Teacher',
    'Arts',
    '2021-07-15',
    40000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 11: Music Teacher
  (
    'sf100000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024011',
    'Arun',
    'Iyer',
    'arun.iyer@school.edu.in',
    '+91-9876543220',
    '1989-06-18',
    'male',
    '67 Music Lane, Chennai, Tamil Nadu - 600002',
    'M.A. Music, Diploma in Classical Music',
    'Music Teacher',
    'Arts',
    '2022-01-05',
    38000.00,
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STAFF - NON-TEACHING STAFF (ADMINISTRATION)
-- =====================================================

INSERT INTO staff (id, tenant_id, employee_id, first_name, last_name, email, phone, date_of_birth, gender, address, qualification, designation, department, date_of_joining, salary, status, created_at, updated_at)
VALUES
  -- Staff 12: Accountant
  (
    'sf100000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024012',
    'Deepak',
    'Mehta',
    'deepak.mehta@school.edu.in',
    '+91-9876543221',
    '1983-09-10',
    'male',
    '34 Finance Street, Ahmedabad, Gujarat - 380001',
    'M.Com., C.A.',
    'Accountant',
    'Accounts',
    '2019-04-01',
    58000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 13: HR Manager
  (
    'sf100000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024013',
    'Sneha',
    'Rao',
    'sneha.rao@school.edu.in',
    '+91-9876543222',
    '1986-04-22',
    'female',
    '89 Corporate Park, Bangalore, Karnataka - 560025',
    'MBA (HR), B.A.',
    'HR Manager',
    'Human Resources',
    '2020-02-15',
    62000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 14: Office Administrator
  (
    'sf100000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024014',
    'Rajni',
    'Chopra',
    'rajni.chopra@school.edu.in',
    '+91-9876543223',
    '1988-11-30',
    'female',
    '56 Admin Block, Chandigarh - 160001',
    'B.Com., Diploma in Office Management',
    'Administrator',
    'Administration',
    '2020-07-01',
    42000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 15: Librarian
  (
    'sf100000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024015',
    'Suresh',
    'Kulkarni',
    'suresh.kulkarni@school.edu.in',
    '+91-9876543224',
    '1981-03-14',
    'male',
    '23 Library Road, Pune, Maharashtra - 411002',
    'M.Lib.Sc., B.A.',
    'Librarian',
    'Library',
    '2018-08-15',
    45000.00,
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STAFF - NON-TEACHING STAFF (SUPPORT)
-- =====================================================

INSERT INTO staff (id, tenant_id, employee_id, first_name, last_name, email, phone, date_of_birth, gender, address, qualification, designation, department, date_of_joining, salary, status, created_at, updated_at)
VALUES
  -- Staff 16: Lab Assistant
  (
    'sf100000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024016',
    'Prakash',
    'Reddy',
    'prakash.reddy@school.edu.in',
    '+91-9876543225',
    '1991-08-05',
    'male',
    '45 Lab Complex, Hyderabad, Telangana - 500082',
    'B.Sc., Lab Technician Diploma',
    'Lab Assistant',
    'Science',
    '2021-09-01',
    32000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 17: IT Support
  (
    'sf100000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024017',
    'Nitin',
    'Joshi',
    'nitin.joshi@school.edu.in',
    '+91-9876543226',
    '1992-12-20',
    'male',
    '78 Tech Valley, Bangalore, Karnataka - 560030',
    'B.Tech (IT), CCNA',
    'IT Support Engineer',
    'IT Department',
    '2022-03-15',
    38000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 18: Nurse
  (
    'sf100000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024018',
    'Lakshmi',
    'Pillai',
    'lakshmi.pillai@school.edu.in',
    '+91-9876543227',
    '1987-05-10',
    'female',
    '34 Medical Lane, Kochi, Kerala - 682003',
    'B.Sc. Nursing, GNM',
    'School Nurse',
    'Infirmary',
    '2020-05-01',
    35000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 19: Security Supervisor
  (
    'sf100000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024019',
    'Ravi',
    'Kumar',
    'ravi.kumar@school.edu.in',
    '+91-9876543228',
    '1979-07-25',
    'male',
    '90 Guard House, Delhi - 110055',
    'High School, Security Training Certificate',
    'Security Supervisor',
    'Security',
    '2019-01-10',
    30000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 20: Receptionist
  (
    'sf100000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024020',
    'Pooja',
    'Bhat',
    'pooja.bhat@school.edu.in',
    '+91-9876543229',
    '1993-10-15',
    'female',
    '12 Reception Block, Mumbai, Maharashtra - 400002',
    'B.A., Diploma in Front Office Management',
    'Receptionist',
    'Administration',
    '2022-01-20',
    28000.00,
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STAFF - SPECIAL STATUS (Inactive, On Leave)
-- =====================================================

INSERT INTO staff (id, tenant_id, employee_id, first_name, last_name, email, phone, date_of_birth, gender, address, qualification, designation, department, date_of_joining, salary, status, created_at, updated_at)
VALUES
  -- Staff 21: Inactive Staff (Resigned)
  (
    'sf100000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000001',
    'EMP2023021',
    'Anand',
    'Trivedi',
    'anand.trivedi@school.edu.in',
    '+91-9876543230',
    '1985-02-18',
    'male',
    '67 Residency, Jaipur, Rajasthan - 302001',
    'M.Sc. Chemistry, B.Ed.',
    'Teacher',
    'Science',
    '2019-06-01',
    49000.00,
    'inactive',
    now() - INTERVAL '6 months',
    now() - INTERVAL '2 months'
  ),
  
  -- Staff 22: On Maternity Leave
  (
    'sf100000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024022',
    'Divya',
    'Malhotra',
    'divya.malhotra@school.edu.in',
    '+91-9876543231',
    '1990-09-12',
    'female',
    '45 Residential Area, Lucknow, UP - 226001',
    'M.A. Geography, B.Ed.',
    'Teacher',
    'Social Studies',
    '2021-04-01',
    46000.00,
    'on_leave',
    now(),
    now()
  ),
  
  -- Staff 23: On Medical Leave
  (
    'sf100000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024023',
    'Manoj',
    'Tiwari',
    'manoj.tiwari@school.edu.in',
    '+91-9876543232',
    '1982-06-30',
    'male',
    '89 Park View, Bhopal, MP - 462001',
    'M.Com., MBA (Finance)',
    'Finance Manager',
    'Accounts',
    '2019-09-01',
    60000.00,
    'on_leave',
    now(),
    now()
  ),
  
  -- Staff 24: Recently Joined (Probation)
  (
    'sf100000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024024',
    'Neha',
    'Saxena',
    'neha.saxena@school.edu.in',
    '+91-9876543233',
    '1994-11-22',
    'female',
    '23 New Colony, Indore, MP - 452001',
    'M.Sc. Biology, B.Ed.',
    'Teacher',
    'Science',
    CURRENT_DATE - INTERVAL '1 month',
    44000.00,
    'active',
    now() - INTERVAL '1 month',
    now() - INTERVAL '1 month'
  ),
  
  -- Staff 25: Senior Staff (Long Service)
  (
    'sf100000-0000-0000-0000-000000000025',
    '00000000-0000-0000-0000-000000000001',
    'EMP2015025',
    'Gopal',
    'Krishnan',
    'gopal.krishnan@school.edu.in',
    '+91-9876543234',
    '1970-03-08',
    'male',
    '56 Veteran Colony, Coimbatore, TN - 641001',
    'M.A. Sanskrit, B.Ed.',
    'Senior Teacher',
    'Languages',
    '2005-06-15',
    68000.00,
    'active',
    now() - INTERVAL '19 years',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STAFF - EDGE CASES
-- =====================================================

INSERT INTO staff (id, tenant_id, employee_id, first_name, last_name, email, phone, date_of_birth, gender, address, qualification, designation, department, date_of_joining, salary, status, created_at, updated_at)
VALUES
  -- Staff 26: Minimum required fields only
  (
    'sf100000-0000-0000-0000-000000000026',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024026',
    'Ramesh',
    'Kumar',
    'ramesh.kumar@school.edu.in',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Teacher',
    'General',
    NULL,
    NULL,
    'active',
    now(),
    now()
  ),
  
  -- Staff 27: Staff with hyphenated name
  (
    'sf100000-0000-0000-0000-000000000027',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024027',
    'Mary-Ann',
    'D''Souza',
    'maryann.dsouza@school.edu.in',
    '+91-9876543235',
    '1989-12-25',
    'female',
    '78 Church Street, Goa - 403001',
    'M.A. English Literature',
    'English Teacher',
    'English',
    '2021-08-01',
    47000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 28: Contract Staff
  (
    'sf100000-0000-0000-0000-000000000028',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024028',
    'Vijay',
    'Chawla',
    'vijay.chawla@school.edu.in',
    '+91-9876543236',
    '1991-04-10',
    'male',
    '90 Outskirts, Noida, UP - 201301',
    'B.E. Civil Engineering',
    'Maintenance Engineer',
    'Maintenance',
    '2023-12-01',
    42000.00,
    'active',
    now() - INTERVAL '2 months',
    now()
  ),
  
  -- Staff 29: Part-time Staff
  (
    'sf100000-0000-0000-0000-000000000029',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024029',
    'Shalini',
    'Kapoor',
    'shalini.kapoor@school.edu.in',
    '+91-9876543237',
    '1987-07-18',
    'female',
    '34 Suburban Area, Faridabad, HR - 121001',
    'M.A. Fine Arts',
    'Craft Teacher',
    'Arts',
    '2022-06-01',
    25000.00,
    'active',
    now(),
    now()
  ),
  
  -- Staff 30: Counselor
  (
    'sf100000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000001',
    'EMP2024030',
    'Dr. Ashok',
    'Pandey',
    'ashok.pandey@school.edu.in',
    '+91-9876543238',
    '1980-01-05',
    'male',
    '12 Medical Plaza, Patna, Bihar - 800001',
    'Ph.D. Psychology, M.A. Clinical Psychology',
    'School Counselor',
    'Counseling',
    '2020-10-01',
    55000.00,
    'active',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify the data was inserted correctly

-- Check total staff by status
-- SELECT status, COUNT(*) as count FROM staff 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
-- GROUP BY status ORDER BY status;

-- Check staff by department
-- SELECT department, COUNT(*) as count FROM staff 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
-- AND status = 'active'
-- GROUP BY department ORDER BY count DESC;

-- Check staff by designation
-- SELECT designation, COUNT(*) as count FROM staff 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
-- GROUP BY designation ORDER BY count DESC;

-- Check salary ranges
-- SELECT 
--   CASE 
--     WHEN salary < 35000 THEN 'Below 35K'
--     WHEN salary BETWEEN 35000 AND 50000 THEN '35K-50K'
--     WHEN salary BETWEEN 50001 AND 70000 THEN '50K-70K'
--     ELSE 'Above 70K'
--   END as salary_range,
--   COUNT(*) as count,
--   AVG(salary) as avg_salary
-- FROM staff 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
-- AND salary IS NOT NULL
-- GROUP BY salary_range
-- ORDER BY avg_salary;

-- Check staff by gender
-- SELECT gender, COUNT(*) as count FROM staff 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
-- GROUP BY gender ORDER BY gender;

-- Check recent joiners (last 6 months)
-- SELECT employee_id, first_name, last_name, designation, date_of_joining
-- FROM staff 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001'
-- AND date_of_joining >= CURRENT_DATE - INTERVAL '6 months'
-- ORDER BY date_of_joining DESC;

-- =====================================================
-- NOTES FOR TESTING
-- =====================================================
-- This seed data provides:
-- 
-- 1. **Teaching Staff (15)** - Various subjects and seniority levels
-- 2. **Administrative Staff (4)** - Principal, Vice Principal, HR, Administrator
-- 3. **Support Staff (6)** - Lab assistant, IT, Nurse, Security, etc.
-- 4. **Special Status (3)** - Inactive, On leave scenarios
-- 5. **Edge Cases (5)** - Minimal data, special names, contract staff
--
-- Departments Covered:
-- - Administration, Mathematics, English, Science, Hindi
-- - Computer Science, Social Studies, Sports, Arts
-- - Accounts, HR, Library, IT, Infirmary, Security
--
-- Designations:
-- - Principal, Vice Principal, Senior Teacher, Teacher
-- - Accountant, HR Manager, Librarian, Lab Assistant
-- - IT Support, Nurse, Security Supervisor, Receptionist
--
-- Status Distribution:
-- - Active: 26 staff members
-- - Inactive: 1 (resigned)
-- - On Leave: 2 (maternity/medical)
--
-- Salary Ranges:
-- - Below 35K: Support staff
-- - 35K-50K: Junior teachers, support staff
-- - 50K-70K: Senior teachers, administrative staff
-- - Above 70K: Principal, senior management
--
-- Use Cases for Testing:
-- - Create: Add new staff with complete/partial information
-- - Read: List all, filter by department/designation/status
-- - Update: Change designation, salary, department
-- - Delete: Mark as inactive (soft delete)
-- - Search: By name, employee ID, email, department
-- - Reports: Department-wise count, salary analysis
-- - Attendance: Track present/absent/leave
-- - Status Changes: Active to on_leave, on_leave to active
--
-- =====================================================
