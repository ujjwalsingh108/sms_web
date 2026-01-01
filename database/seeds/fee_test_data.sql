-- =====================================================
-- FEE MANAGEMENT TEST DATA
-- For testing fee management CRUD operations
-- =====================================================
-- This file provides comprehensive test data covering:
-- - Fee structures for different classes and frequencies
-- - Fee payments with various payment methods
-- - Fee discounts and scholarships
-- =====================================================

-- Prerequisites: Run academic_test_data.sql and students_test_data.sql first

-- Use the same test tenant
-- Test Tenant ID: 00000000-0000-0000-0000-000000000001
-- Test Academic Year ID: acyr1000-0000-0000-0000-000000000001 (2025-2026)

-- =====================================================
-- FEE STRUCTURES
-- =====================================================

-- Fee structures for different classes and fee types
INSERT INTO fee_structures (id, tenant_id, name, class_id, amount, frequency, academic_year_id, status, due_day, description, created_at)
VALUES
  -- Class 1 Fees
  (
    'fees1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 1',
    'cls10000-0000-0000-0000-000000000001', -- Class 1
    15000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 1 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Transport Fee - Class 1',
    'cls10000-0000-0000-0000-000000000001',
    5000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    15,
    'Annual school bus transportation fee',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Admission Fee - Class 1',
    'cls10000-0000-0000-0000-000000000001',
    3000.00,
    'one_time',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    NULL,
    'One-time admission and registration fee',
    now()
  ),
  
  -- Class 2 Fees
  (
    'fees1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 2',
    'cls10000-0000-0000-0000-000000000002', -- Class 2
    16000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 2 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Transport Fee - Class 2',
    'cls10000-0000-0000-0000-000000000002',
    5000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    15,
    'Annual school bus transportation fee',
    now()
  ),
  
  -- Class 3 Fees
  (
    'fees1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 3',
    'cls10000-0000-0000-0000-000000000003', -- Class 3
    17000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 3 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'Computer Lab Fee - Class 3',
    'cls10000-0000-0000-0000-000000000003',
    2000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    20,
    'Annual computer lab usage and maintenance fee',
    now()
  ),
  
  -- Class 4 Fees
  (
    'fees1000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 4',
    'cls10000-0000-0000-0000-000000000004', -- Class 4
    18000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 4 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'Library Fee - Class 4',
    'cls10000-0000-0000-0000-000000000004',
    1500.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    25,
    'Annual library membership and book access fee',
    now()
  ),
  
  -- Class 5 Fees
  (
    'fees1000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 5',
    'cls10000-0000-0000-0000-000000000005', -- Class 5
    19000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 5 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'Sports Fee - Class 5',
    'cls10000-0000-0000-0000-000000000005',
    3000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    10,
    'Annual sports activities and equipment fee',
    now()
  ),
  
  -- Class 6 Fees
  (
    'fees1000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 6',
    'cls10000-0000-0000-0000-000000000006', -- Class 6
    22000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 6 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'Lab Fee - Class 6',
    'cls10000-0000-0000-0000-000000000006',
    3500.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    20,
    'Science and computer lab usage fee',
    now()
  ),
  
  -- Class 7 Fees
  (
    'fees1000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 7',
    'cls10000-0000-0000-0000-000000000007', -- Class 7
    24000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 7 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'Activity Fee - Class 7',
    'cls10000-0000-0000-0000-000000000007',
    2500.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    15,
    'Co-curricular and extracurricular activities fee',
    now()
  ),
  
  -- Class 8 Fees
  (
    'fees1000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 8',
    'cls10000-0000-0000-0000-000000000008', -- Class 8
    26000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 8 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000001',
    'Exam Fee - Class 8',
    'cls10000-0000-0000-0000-000000000008',
    2000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    25,
    'Internal and term examination fee',
    now()
  ),
  
  -- Class 9 Fees
  (
    'fees1000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 9',
    'cls10000-0000-0000-0000-000000000009', -- Class 9
    30000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 9 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000001',
    'Board Exam Registration Fee - Class 9',
    'cls10000-0000-0000-0000-000000000009',
    5000.00,
    'one_time',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    NULL,
    'Board examination registration and form submission fee',
    now()
  ),
  
  -- Class 10 Fees
  (
    'fees1000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'Tuition Fee - Class 10',
    'cls10000-0000-0000-0000-000000000010', -- Class 10
    32000.00,
    'yearly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    30,
    'Annual tuition fee for Class 10 students',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000001',
    'Board Exam Fee - Class 10',
    'cls10000-0000-0000-0000-000000000010',
    7500.00,
    'one_time',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    NULL,
    'CBSE/State board examination fee',
    now()
  ),
  
  -- Common Fees (applicable to all classes)
  (
    'fees1000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000001',
    'Annual Day Contribution',
    NULL, -- No specific class
    1000.00,
    'one_time',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    NULL,
    'Annual day celebration and event contribution',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000001',
    'Quarterly Maintenance Fee',
    NULL,
    2000.00,
    'quarterly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    5,
    'School infrastructure and facility maintenance fee',
    now()
  ),
  (
    'fees1000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000001',
    'Monthly Canteen Fee',
    NULL,
    500.00,
    'monthly',
    'acyr1000-0000-0000-0000-000000000001',
    'active',
    1,
    'Monthly canteen subscription fee',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FEE PAYMENTS
-- =====================================================

-- Sample fee payments for students
-- Using student IDs from students_test_data.sql
INSERT INTO fee_payments (id, tenant_id, student_id, fee_structure_id, amount_paid, payment_date, payment_method, transaction_id, status, remarks, created_at)
VALUES
  -- Aarav Sharma (Class 1) Payments
  (
    'fepy1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000001', -- Aarav Sharma
    'fees1000-0000-0000-0000-000000000001', -- Tuition Fee - Class 1
    15000.00,
    '2025-04-15',
    'online',
    'TXN2025041500123',
    'completed',
    'Full tuition payment for academic year',
    '2025-04-15 10:30:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000001',
    'fees1000-0000-0000-0000-000000000003', -- Admission Fee
    3000.00,
    '2025-03-10',
    'cash',
    NULL,
    'completed',
    'Admission fee paid at registration',
    '2025-03-10 14:20:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000001',
    'fees1000-0000-0000-0000-000000000002', -- Transport Fee
    2500.00,
    '2025-04-20',
    'upi',
    'UPI2025042000456',
    'completed',
    'Partial transport fee payment',
    '2025-04-20 16:45:00'
  ),
  
  -- Diya Patel (Class 2) Payments
  (
    'fepy1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000002', -- Diya Patel
    'fees1000-0000-0000-0000-000000000004', -- Tuition Fee - Class 2
    16000.00,
    '2025-04-12',
    'cheque',
    'CHQ789012',
    'completed',
    'Cheque cleared on 2025-04-15',
    '2025-04-12 11:00:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000002',
    'fees1000-0000-0000-0000-000000000005', -- Transport Fee
    5000.00,
    '2025-04-18',
    'online',
    'TXN2025041800789',
    'completed',
    'Full transport fee paid',
    '2025-04-18 09:15:00'
  ),
  
  -- Arjun Kumar (Class 3) Payments
  (
    'fepy1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000003', -- Arjun Kumar
    'fees1000-0000-0000-0000-000000000006', -- Tuition Fee - Class 3
    17000.00,
    '2025-05-01',
    'card',
    'CARD2025050100234',
    'completed',
    'Paid via credit card',
    '2025-05-01 13:30:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000003',
    'fees1000-0000-0000-0000-000000000007', -- Computer Lab Fee
    2000.00,
    '2025-05-05',
    'online',
    'TXN2025050500567',
    'completed',
    'Lab fee payment',
    '2025-05-05 10:45:00'
  ),
  
  -- Ananya Singh (Class 4) Payments
  (
    'fepy1000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000004', -- Ananya Singh
    'fees1000-0000-0000-0000-000000000008', -- Tuition Fee - Class 4
    9000.00,
    '2025-04-25',
    'cash',
    NULL,
    'completed',
    'Partial payment - First installment',
    '2025-04-25 15:00:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000004',
    'fees1000-0000-0000-0000-000000000008',
    9000.00,
    '2025-08-15',
    'upi',
    'UPI2025081500890',
    'completed',
    'Partial payment - Second installment',
    '2025-08-15 11:20:00'
  ),
  
  -- Rohan Verma (Class 5) Payments
  (
    'fepy1000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000005', -- Rohan Verma
    'fees1000-0000-0000-0000-000000000010', -- Tuition Fee - Class 5
    19000.00,
    '2025-04-10',
    'online',
    'TXN2025041000234',
    'completed',
    'Full tuition paid early',
    '2025-04-10 08:30:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000005',
    'fees1000-0000-0000-0000-000000000011', -- Sports Fee
    3000.00,
    '2025-04-15',
    'online',
    'TXN2025041500678',
    'completed',
    'Sports fee for annual sports day',
    '2025-04-15 14:00:00'
  ),
  
  -- Ishita Reddy (Class 6) Payments
  (
    'fepy1000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000006', -- Ishita Reddy
    'fees1000-0000-0000-0000-000000000012', -- Tuition Fee - Class 6
    22000.00,
    '2025-05-10',
    'cheque',
    'CHQ456789',
    'completed',
    'Full year tuition payment',
    '2025-05-10 10:00:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000006',
    'fees1000-0000-0000-0000-000000000013', -- Lab Fee
    3500.00,
    '2025-05-15',
    'online',
    'TXN2025051500345',
    'completed',
    'Science lab fee',
    '2025-05-15 12:30:00'
  ),
  
  -- Vihaan Joshi (Class 7) Payments
  (
    'fepy1000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000007', -- Vihaan Joshi
    'fees1000-0000-0000-0000-000000000014', -- Tuition Fee - Class 7
    12000.00,
    '2025-04-20',
    'card',
    'CARD2025042000567',
    'completed',
    'First installment - 50%',
    '2025-04-20 16:15:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000007',
    'fees1000-0000-0000-0000-000000000015', -- Activity Fee
    2500.00,
    '2025-04-22',
    'upi',
    'UPI2025042200123',
    'completed',
    'Activity fee paid',
    '2025-04-22 09:45:00'
  ),
  
  -- Saanvi Chopra (Class 8) Payments
  (
    'fepy1000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000008', -- Saanvi Chopra
    'fees1000-0000-0000-0000-000000000016', -- Tuition Fee - Class 8
    26000.00,
    '2025-04-08',
    'online',
    'TXN2025040800901',
    'completed',
    'Full payment with early bird discount applied',
    '2025-04-08 11:30:00'
  ),
  
  -- Advait Mehta (Class 9) Payments
  (
    'fepy1000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000009', -- Advait Mehta
    'fees1000-0000-0000-0000-000000000018', -- Tuition Fee - Class 9
    30000.00,
    '2025-04-28',
    'cheque',
    'CHQ567890',
    'completed',
    'Full tuition for class 9',
    '2025-04-28 14:00:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000009',
    'fees1000-0000-0000-0000-000000000019', -- Board Exam Registration
    5000.00,
    '2025-06-10',
    'online',
    'TXN2025061000456',
    'completed',
    'Board exam registration fee',
    '2025-06-10 10:15:00'
  ),
  
  -- Kiara Sharma (Class 10) Payments
  (
    'fepy1000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000010', -- Kiara Sharma
    'fees1000-0000-0000-0000-000000000020', -- Tuition Fee - Class 10
    32000.00,
    '2025-05-02',
    'online',
    'TXN2025050200789',
    'completed',
    'Full tuition payment',
    '2025-05-02 15:30:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000010',
    'fees1000-0000-0000-0000-000000000021', -- Board Exam Fee
    7500.00,
    '2025-09-15',
    'card',
    'CARD2025091500234',
    'completed',
    'Board exam fee - Class 10',
    '2025-09-15 13:00:00'
  ),
  
  -- Common Fee Payments
  (
    'fepy1000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000001',
    'fees1000-0000-0000-0000-000000000024', -- Monthly Canteen Fee
    500.00,
    '2025-04-01',
    'cash',
    NULL,
    'completed',
    'Canteen fee - April 2025',
    '2025-04-01 08:00:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000002',
    'fees1000-0000-0000-0000-000000000024',
    500.00,
    '2025-04-02',
    'upi',
    'UPI2025040200123',
    'completed',
    'Canteen fee - April 2025',
    '2025-04-02 08:30:00'
  ),
  
  -- Pending Payments
  (
    'fepy1000-0000-0000-0000-000000000023',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000007',
    'fees1000-0000-0000-0000-000000000014', -- Tuition Fee - Class 7 (remaining)
    12000.00,
    '2025-08-15',
    'online',
    NULL,
    'pending',
    'Second installment pending',
    '2025-08-15 10:00:00'
  ),
  (
    'fepy1000-0000-0000-0000-000000000024',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000003',
    'fees1000-0000-0000-0000-000000000023', -- Quarterly Maintenance
    2000.00,
    '2025-07-01',
    NULL,
    NULL,
    'pending',
    'Q2 maintenance fee due',
    '2025-07-01 00:00:00'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FEE DISCOUNTS
-- =====================================================

-- Fee discounts/scholarships for deserving students
INSERT INTO fee_discounts (id, tenant_id, student_id, fee_structure_id, discount_percentage, discount_amount, reason, created_at)
VALUES
  -- Merit Scholarship for Rohan Verma
  (
    'feds1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000005', -- Rohan Verma
    'fees1000-0000-0000-0000-000000000010', -- Tuition Fee - Class 5
    10.00,
    NULL,
    'Merit scholarship for academic excellence - 10% discount',
    '2025-03-20 10:00:00'
  ),
  
  -- Sibling Discount for Diya Patel
  (
    'feds1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000002', -- Diya Patel
    'fees1000-0000-0000-0000-000000000004', -- Tuition Fee - Class 2
    15.00,
    NULL,
    'Sibling discount - 15% off on tuition',
    '2025-03-15 11:30:00'
  ),
  
  -- Financial Aid for Vihaan Joshi
  (
    'feds1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000007', -- Vihaan Joshi
    'fees1000-0000-0000-0000-000000000014', -- Tuition Fee - Class 7
    NULL,
    5000.00,
    'Financial assistance - ₹5000 off',
    '2025-03-25 14:00:00'
  ),
  
  -- Sports Scholarship for Advait Mehta
  (
    'feds1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000009', -- Advait Mehta
    'fees1000-0000-0000-0000-000000000018', -- Tuition Fee - Class 9
    20.00,
    NULL,
    'Sports scholarship for state-level athlete - 20% discount',
    '2025-04-05 09:00:00'
  ),
  
  -- Early Bird Discount for Saanvi Chopra
  (
    'feds1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000008', -- Saanvi Chopra
    'fees1000-0000-0000-0000-000000000016', -- Tuition Fee - Class 8
    5.00,
    NULL,
    'Early payment discount - 5% off',
    '2025-04-08 11:00:00'
  ),
  
  -- Staff Ward Discount for Ishita Reddy
  (
    'feds1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000006', -- Ishita Reddy
    'fees1000-0000-0000-0000-000000000012', -- Tuition Fee - Class 6
    25.00,
    NULL,
    'Staff ward discount - 25% off on tuition',
    '2025-03-10 10:30:00'
  ),
  
  -- Need-based Scholarship for Ananya Singh
  (
    'feds1000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'std10000-0000-0000-0000-000000000004', -- Ananya Singh
    'fees1000-0000-0000-0000-000000000009', -- Library Fee - Class 4
    NULL,
    1500.00,
    'Full waiver of library fee - need-based scholarship',
    '2025-03-18 15:00:00'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SUMMARY STATISTICS
-- =====================================================

-- Total Fee Structures: 24
-- Total Fee Payments: 24 (22 completed, 2 pending)
-- Total Discounts: 7
-- Classes Covered: All classes (1-10) plus common fees
-- Payment Methods: cash, online, upi, card, cheque
-- Frequency Types: monthly, quarterly, yearly, one_time

-- =====================================================
-- USAGE NOTES
-- =====================================================
-- 1. This data works with students from students_test_data.sql
-- 2. Fee structures are linked to classes from academic_test_data.sql
-- 3. Academic year 2025-2026 is used throughout
-- 4. Payment dates range from March to September 2025
-- 5. Various payment methods and statuses are represented
-- 6. Discounts include merit, sibling, financial aid, and sports scholarships
