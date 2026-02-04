-- Security Management Module - Test Data Seed
-- This seed file creates test data for Security Incidents, Gate Passes, and Visitors
-- Tenant ID: 00000000-0000-0000-0000-000000000001

-- ============================================================================
-- SECURITY INCIDENTS
-- ============================================================================
INSERT INTO public.security_incidents (
  id,
  tenant_id,
  incident_date,
  incident_time,
  incident_type,
  location,
  description,
  severity,
  reported_by,
  action_taken,
  status,
  created_at
) VALUES
  (
    '11000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '2026-02-02'::date,
    '09:30:00'::time,
    'Unauthorized Entry',
    'Main Gate',
    'Unknown person attempting to enter campus without ID',
    'medium',
    'Security Guard - Raj',
    'Person asked to leave, campus entry strengthened',
    'resolved',
    now()
  ),
  (
    '11000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '2026-02-01'::date,
    '14:15:00'::time,
    'Student Misconduct',
    'Parking Area',
    'Two students involved in verbal altercation',
    'low',
    'Security Guard - Prem',
    'Students counseled and separated, incident reported to administration',
    'resolved',
    now()
  ),
  (
    '11000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '2026-02-02'::date,
    '16:45:00'::time,
    'Equipment Damage',
    'Science Lab',
    'Fire extinguisher found tampered',
    'high',
    'Lab Technician',
    'Equipment replaced, investigation ongoing',
    'investigating',
    now()
  ),
  (
    '11000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '2026-02-02'::date,
    '10:00:00'::time,
    'Theft Report',
    'Hostel Building A',
    'Student reports missing mobile phone from dormitory',
    'critical',
    'Hostel Warden',
    'FIR to be filed, CCTV footage being reviewed',
    'investigating',
    now()
  ),
  (
    '11000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    '2025-02-01'::date,
    '11:30:00'::time,
    'Property Damage',
    'Classroom Block C',
    'Window pane broken in Class 10-B',
    'low',
    'Maintenance Staff',
    'Window repaired, responsibility identified',
    'closed',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- GATE PASSES - STUDENTS
-- ============================================================================
INSERT INTO public.gate_passes (
  id,
  tenant_id,
  student_id,
  staff_id,
  pass_date,
  exit_time,
  expected_return_time,
  actual_return_time,
  reason,
  approved_by,
  status,
  created_at
) VALUES
  (
    '12000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    NULL,
    '2026-02-02'::date,
    '14:00:00'::time,
    '17:00:00'::time,
    '16:45:00'::time,
    'Medical appointment at city hospital',
    '99000000-0000-0000-0000-000000000001',
    'returned',
    now()
  ),
  (
    '12000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    NULL,
    '2026-02-02'::date,
    '15:30:00'::time,
    '18:00:00'::time,
    NULL,
    'Parents emergency call',
    '99000000-0000-0000-0000-000000000002',
    'pending',
    now()
  ),
  (
    '12000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003',
    NULL,
    '2026-02-01'::date,
    '09:00:00'::time,
    '12:00:00'::time,
    '11:50:00'::time,
    'Local bank work experience',
    '99000000-0000-0000-0000-000000000001',
    'returned',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- GATE PASSES - STAFF
-- ============================================================================
INSERT INTO public.gate_passes (
  id,
  tenant_id,
  student_id,
  staff_id,
  pass_date,
  exit_time,
  expected_return_time,
  actual_return_time,
  reason,
  approved_by,
  status,
  created_at
) VALUES
  (
    '12000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    NULL,
    '40000000-0000-0000-0000-000000000001',
    '2026-02-02'::date,
    '10:30:00'::time,
    '13:00:00'::time,
    '12:50:00'::time,
    'Bank work - salary processing',
    '99000000-0000-0000-0000-000000000001',
    'returned',
    now()
  ),
  (
    '12000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    NULL,
    '40000000-0000-0000-0000-000000000002',
    '2026-02-02'::date,
    '14:00:00'::time,
    '15:30:00'::time,
    NULL,
    'Government office documentation',
    '99000000-0000-0000-0000-000000000001',
    'approved',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VISITORS
-- ============================================================================
INSERT INTO public.visitors (
  id,
  tenant_id,
  visitor_name,
  phone,
  email,
  purpose,
  person_to_meet,
  check_in_time,
  check_out_time,
  id_proof_type,
  id_proof_number,
  status,
  remarks,
  created_at
) VALUES
  (
    '13000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Mr. Rajesh Kumar',
    '9876543210',
    'rajesh.kumar@example.com',
    'Meet Principal - Admission inquiry',
    'Principal Dr. Sharma',
    '2026-02-02 10:00:00+00',
    '2026-02-02 10:45:00+00',
    'Aadhar',
    '123456789012',
    'checked_out',
    'Discussed admission for class 8',
    now()
  ),
  (
    '13000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Mrs. Priya Sharma',
    '9876543211',
    'priya.sharma@example.com',
    'School fee payment counseling',
    'Accounts Officer',
    '2026-02-02 11:30:00+00',
    '2026-02-02 12:15:00+00',
    'Passport',
    'N5678901',
    'checked_out',
    'Fee structure reviewed',
    now()
  ),
  (
    '13000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Mr. Vikram Patel',
    '9876543212',
    'vikram.patel@example.com',
    'IT System Maintenance',
    'IT Head',
    '2026-02-02 13:00:00+00',
    NULL,
    'Driving License',
    'DL2678901',
    'checked_in',
    'Maintenance work in progress - currently in server room',
    now()
  ),
  (
    '13000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Ms. Anjali Singh',
    '9876543213',
    'anjali.singh@example.com',
    'External examiner - Board Exam Audit',
    'Academic Head',
    '2026-02-01 09:00:00+00',
    '2026-02-01 16:30:00+00',
    'Aadhar',
    '234567890123',
    'checked_out',
    'Class 12 exam audit completed',
    now()
  ),
  (
    '13000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Mr. Suresh Kumar',
    '9876543214',
    'suresh.kumar@example.com',
    'Transportation Contractor',
    'Transport Head',
    '2026-02-02 08:30:00+00',
    '2026-02-02 09:15:00+00',
    'Driving License',
    'DL9876543',
    'checked_out',
    'Route inspection and discussion',
    now()
  ),
  (
    '13000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Mr. Arjun Desai',
    '9876543215',
    'arjun.desai@example.com',
    'Vendor - Sports Equipment Supply',
    'Sports Coordinator',
    '2026-02-02 14:30:00+00',
    NULL,
    'Aadhar',
    '345678901234',
    'checked_in',
    'Delivering new volleyball sets and gym equipment',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Seed Completion Confirmation
-- ============================================================================
-- This seed file successfully creates:
-- - 5 Security Incidents with various severity levels and statuses
-- - 5 Gate Passes (3 for students, 2 for staff)
-- - 6 Visitor records with complete tracking data
--
-- Note: Replace the following UUIDs with your actual IDs:
-- - Tenant ID: 00000000-0000-0000-0000-000000000001
-- - Student IDs: 30000000-0000-0000-0000-000000000001, 002, 003
-- - Staff IDs: 40000000-0000-0000-0000-000000000001, 002
-- - Approver IDs: 99000000-0000-0000-0000-000000000001, 002
