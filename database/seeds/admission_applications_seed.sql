-- Admission Applications Test Data for Smart School ERP
-- Creates sample admission applications with various statuses
-- Update tenant_id and class_id values to match your environment before running

-- Note: This assumes you have:
-- - tenant_id: '00000000-0000-0000-0000-000000000001'
-- - academic_year_id: 'ay000000-0000-0000-0000-000000000002' (2024-2025)
-- - class_ids from academic_test_data.sql (Grade 1, 2, 3)

-- Insert admission applications with different statuses
INSERT INTO admission_applications (
  id, 
  tenant_id, 
  application_no, 
  first_name, 
  last_name, 
  date_of_birth, 
  gender, 
  email, 
  phone, 
  address, 
  previous_school, 
  previous_class, 
  guardian_name, 
  guardian_phone, 
  guardian_email, 
  guardian_relation, 
  guardian_occupation, 
  applied_class_id, 
  academic_year_id, 
  status, 
  applied_date, 
  remarks, 
  created_at
)
VALUES
  -- Pending Applications
  (
    'adm00000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'APP202500001',
    'Aarav',
    'Sharma',
    '2018-03-15',
    'male',
    'aarav.sharma@example.com',
    '+91-9876543210',
    '123 Green Park, New Delhi, 110016',
    'Little Angels School',
    'KG',
    'Rajesh Sharma',
    '+91-9876543211',
    'rajesh.sharma@example.com',
    'father',
    'Software Engineer',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    'ay000000-0000-0000-0000-000000000002', -- Academic Year 2024-2025
    'pending',
    '2024-12-01',
    'Application submitted online',
    now()
  ),
  (
    'adm00000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'APP202500002',
    'Priya',
    'Patel',
    '2018-07-22',
    'female',
    'priya.patel@example.com',
    '+91-9876543212',
    '456 MG Road, Bangalore, 560001',
    'Sunshine Kindergarten',
    'UKG',
    'Amit Patel',
    '+91-9876543213',
    'amit.patel@example.com',
    'father',
    'Business Owner',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    'ay000000-0000-0000-0000-000000000002',
    'pending',
    '2024-12-05',
    'Waiting for document verification',
    now()
  ),
  
  -- Approved Applications
  (
    'adm00000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'APP202400103',
    'Rohan',
    'Kumar',
    '2017-09-10',
    'male',
    'rohan.kumar@example.com',
    '+91-9876543214',
    '789 Park Street, Kolkata, 700016',
    'St. Mary''s School',
    'Grade 1',
    'Suresh Kumar',
    '+91-9876543215',
    'suresh.kumar@example.com',
    'father',
    'Doctor',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    'ay000000-0000-0000-0000-000000000002',
    'approved',
    '2024-11-10',
    'Approved after interview. Documents verified.',
    now()
  ),
  (
    'adm00000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'APP202400104',
    'Ananya',
    'Reddy',
    '2017-05-18',
    'female',
    'ananya.reddy@example.com',
    '+91-9876543216',
    '321 Jubilee Hills, Hyderabad, 500033',
    'Delhi Public School',
    'Grade 1',
    'Lakshmi Reddy',
    '+91-9876543217',
    'lakshmi.reddy@example.com',
    'mother',
    'Teacher',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    'ay000000-0000-0000-0000-000000000002',
    'approved',
    '2024-11-15',
    'Excellent entrance test score. Admitted to Section A.',
    now()
  ),
  (
    'adm00000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'APP202400105',
    'Arjun',
    'Singh',
    '2016-12-03',
    'male',
    'arjun.singh@example.com',
    '+91-9876543218',
    '555 Civil Lines, Jaipur, 302006',
    'Ryan International',
    'Grade 2',
    'Vikram Singh',
    '+91-9876543219',
    'vikram.singh@example.com',
    'father',
    'Army Officer',
    'c1000000-0000-0000-0000-000000000003', -- Grade 3
    'ay000000-0000-0000-0000-000000000002',
    'approved',
    '2024-11-20',
    'Transfer case. All documents in order.',
    now()
  ),

  -- Rejected Applications
  (
    'adm00000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'APP202400206',
    'Karan',
    'Verma',
    '2018-01-25',
    'male',
    'karan.verma@example.com',
    '+91-9876543220',
    '888 Sector 15, Chandigarh, 160015',
    'Little Stars Playschool',
    'Nursery',
    'Neha Verma',
    '+91-9876543221',
    'neha.verma@example.com',
    'mother',
    'Homemaker',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    'ay000000-0000-0000-0000-000000000002',
    'rejected',
    '2024-10-15',
    'Does not meet minimum age requirement.',
    now()
  ),
  (
    'adm00000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'APP202400207',
    'Sneha',
    'Joshi',
    '2017-11-08',
    'female',
    'sneha.joshi@example.com',
    '+91-9876543222',
    '999 Aundh, Pune, 411007',
    'Wisdom School',
    'Grade 1',
    'Sunil Joshi',
    '+91-9876543223',
    'sunil.joshi@example.com',
    'father',
    'Accountant',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    'ay000000-0000-0000-0000-000000000002',
    'rejected',
    '2024-10-20',
    'Failed entrance test. Recommended to reapply next year.',
    now()
  ),

  -- Waitlisted Applications
  (
    'adm00000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'APP202400308',
    'Aditya',
    'Mehta',
    '2018-04-30',
    'male',
    'aditya.mehta@example.com',
    '+91-9876543224',
    '111 Satellite, Ahmedabad, 380015',
    'Bright Future School',
    'LKG',
    'Raj Mehta',
    '+91-9876543225',
    'raj.mehta@example.com',
    'father',
    'Chartered Accountant',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    'ay000000-0000-0000-0000-000000000002',
    'waitlisted',
    '2024-11-25',
    'Seats full. Added to waitlist. Will notify if seat available.',
    now()
  ),
  (
    'adm00000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'APP202400309',
    'Diya',
    'Gupta',
    '2017-08-12',
    'female',
    'diya.gupta@example.com',
    '+91-9876543226',
    '222 Salt Lake, Kolkata, 700091',
    'Mount Carmel School',
    'Grade 1',
    'Priya Gupta',
    '+91-9876543227',
    'priya.gupta@example.com',
    'mother',
    'Architect',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    'ay000000-0000-0000-0000-000000000002',
    'waitlisted',
    '2024-11-28',
    'Good candidate. Waitlisted due to capacity constraints.',
    now()
  ),
  (
    'adm00000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'APP202400310',
    'Ishaan',
    'Chopra',
    '2016-10-20',
    'male',
    'ishaan.chopra@example.com',
    '+91-9876543228',
    '333 Greater Kailash, New Delhi, 110048',
    'Modern School',
    'Grade 2',
    'Rohit Chopra',
    '+91-9876543229',
    'rohit.chopra@example.com',
    'father',
    'Entrepreneur',
    'c1000000-0000-0000-0000-000000000003', -- Grade 3
    'ay000000-0000-0000-0000-000000000002',
    'waitlisted',
    '2024-12-02',
    'Transfer student. Waiting for previous school TC.',
    now()
  ),

  -- Additional Pending Applications (Recent)
  (
    'adm00000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'APP202500411',
    'Kavya',
    'Nair',
    '2018-06-05',
    'female',
    'kavya.nair@example.com',
    '+91-9876543230',
    '444 Koramangala, Bangalore, 560034',
    'Greenwood High',
    'UKG',
    'Mohan Nair',
    '+91-9876543231',
    'mohan.nair@example.com',
    'father',
    'IT Manager',
    'c1000000-0000-0000-0000-000000000001', -- Grade 1
    'ay000000-0000-0000-0000-000000000002',
    'pending',
    '2024-12-20',
    'Application under review. Interview scheduled.',
    now()
  ),
  (
    'adm00000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'APP202500412',
    'Vivaan',
    'Bhatia',
    '2017-02-28',
    'male',
    'vivaan.bhatia@example.com',
    '+91-9876543232',
    '555 Vasant Vihar, New Delhi, 110057',
    'Cambridge School',
    'Grade 1',
    'Anjali Bhatia',
    '+91-9876543233',
    'anjali.bhatia@example.com',
    'mother',
    'Lawyer',
    'c1000000-0000-0000-0000-000000000002', -- Grade 2
    'ay000000-0000-0000-0000-000000000002',
    'pending',
    '2024-12-22',
    'New application. Documents pending verification.',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Verification queries (uncomment to run after seeding)
-- SELECT application_no, first_name, last_name, status, applied_date 
-- FROM admission_applications 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
-- ORDER BY applied_date DESC;

-- SELECT status, COUNT(*) as count 
-- FROM admission_applications 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
-- GROUP BY status;

-- Notes:
-- 1. Replace tenant_id '00000000-0000-0000-0000-000000000001' with your actual tenant UUID
-- 2. Replace class_ids (c1000000...) with your actual class UUIDs from the classes table
-- 3. Replace academic_year_id (ay000000...) with your actual academic year UUID
-- 4. Phone numbers are in Indian format (+91), adjust as needed
-- 5. Statuses: pending (4), approved (3), rejected (2), waitlisted (3)
-- 6. Run this after running academic_test_data.sql and academic_years_seed.sql
-- 7. Execute in Supabase SQL editor or via psql:
--    psql "postgresql://<user>:<pass>@<host>:5432/<db>" -f database/seeds/admission_applications_seed.sql
