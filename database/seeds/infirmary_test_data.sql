-- =====================================================
-- INFIRMARY / MEDICAL TEST DATA
-- Provides sample medical_checkups and medical_records for testing
-- =====================================================

-- Prerequisites: Run academic_test_data.sql, students_test_data.sql and staff_test_data.sql first

-- Test Tenant ID: 00000000-0000-0000-0000-000000000001

-- =====================================================
-- MEDICAL CHECKUPS
-- =====================================================

INSERT INTO medical_checkups (id, tenant_id, student_id, checkup_date, height, weight, blood_pressure, temperature, vision_test, remarks, conducted_by, created_at)
VALUES
  (
    'mc100000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    98.5,
    14.2,
    '110/70',
    36.6,
    '20/20',
    'Routine annual checkup. All normal.',
    NULL,
    now()
  ),
  (
    'mc100000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000002',
    CURRENT_DATE - INTERVAL '7 days',
    97.8,
    13.9,
    '108/68',
    37.0,
    '20/25',
    'Slight fever reported during week. Recommended rest and hydration.',
    NULL,
    now() - INTERVAL '7 days'
  ),
  (
    'mc100000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000003',
    CURRENT_DATE - INTERVAL '30 days',
    101.0,
    16.0,
    '115/75',
    36.7,
    '20/20',
    'Follow-up after minor injury. Cleared.',
    NULL,
    now() - INTERVAL '30 days'
  ),
  (
    'mc100000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000006',
    CURRENT_DATE - INTERVAL '3 days',
    105.2,
    17.3,
    '112/72',
    36.5,
    '20/20',
    'Complained of stomach ache; observed and recommended light meals.',
    NULL,
    now() - INTERVAL '3 days'
  ),
  (
    'mc100000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000010',
    CURRENT_DATE - INTERVAL '15 days',
    110.0,
    18.4,
    '118/76',
    36.8,
    '20/25',
    'Vision slightly below expected; referred for optometry.',
    NULL,
    now() - INTERVAL '15 days'
  )
ON CONFLICT (id) DO NOTHING;


-- =====================================================
-- MEDICAL RECORDS
-- =====================================================

INSERT INTO medical_records (id, tenant_id, student_id, record_date, symptoms, diagnosis, treatment, prescription, doctor_name, follow_up_date, remarks, created_by, created_at)
VALUES
  (
    'mr100000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000001',
    CURRENT_DATE - INTERVAL '2 days',
    'Fever, mild cough',
    'Viral upper respiratory infection',
    'Rest, fluids, paracetamol as needed',
    'Paracetamol 250mg syrup: 5ml every 6 hours as needed',
    'School Nurse',
    NULL,
    'Sent home for rest; monitor temperature.',
    NULL,
    now() - INTERVAL '2 days'
  ),
  (
    'mr100000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000002',
    CURRENT_DATE - INTERVAL '10 days',
    'Minor cut on knee',
    'Superficial abrasion',
    'Clean wound, apply antiseptic, dress with sterile bandage',
    NULL,
    'School Nurse',
    NULL,
    'Dressing changed; no signs of infection.',
    NULL,
    now() - INTERVAL '10 days'
  ),
  (
    'mr100000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000003',
    CURRENT_DATE - INTERVAL '40 days',
    'Sprained wrist during play',
    'Mild wrist sprain',
    'Immobilize for 1 week, apply ice, avoid strenuous activity',
    NULL,
    'Dr. Rahul (Visiting)',
    CURRENT_DATE - INTERVAL '33 days',
    'Advised follow-up if pain persists.',
    NULL,
    now() - INTERVAL '40 days'
  ),
  (
    'mr100000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000006',
    CURRENT_DATE - INTERVAL '5 days',
    'Stomach pain, nausea',
    'Gastritis (suspected)',
    'Light diet for 48 hours, antacid if needed',
    'Antacid syrup: 5ml twice daily as needed',
    'School Nurse',
    CURRENT_DATE + INTERVAL '7 days',
    'Monitor; advised to visit clinic if symptoms worsen.',
    NULL,
    now() - INTERVAL '5 days'
  ),
  (
    'mr100000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000010',
    CURRENT_DATE - INTERVAL '20 days',
    'Blurry vision in right eye',
    'Possible refractive error',
    'Referred to optometrist for vision correction',
    NULL,
    'Dr. Meera (Optometrist)',
    NULL,
    'Referred for further assessment.',
    NULL,
    now() - INTERVAL '20 days'
  )
ON CONFLICT (id) DO NOTHING;
