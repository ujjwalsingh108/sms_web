-- =====================================================
-- TRANSPORT MANAGEMENT TEST DATA
-- For testing transport dashboard CRUD operations
-- =====================================================
-- This file provides comprehensive test data covering:
-- - Vehicles with different types and statuses
-- - Routes with multiple stops
-- - Vehicle assignments to routes
-- - Student transport registrations
-- =====================================================

-- Prerequisites: Run academic_test_data.sql and students_test_data.sql first

-- Use the same test tenant
-- Test Tenant ID: 00000000-0000-0000-0000-000000000001

-- =====================================================
-- VEHICLES
-- =====================================================

INSERT INTO vehicles (id, tenant_id, vehicle_number, vehicle_type, model, capacity, driver_name, driver_phone, driver_license, status, is_deleted, created_at)
VALUES
  -- Vehicle 1: School Bus 1 (Active)
  (
    'veh10000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'KA-01-AB-1234',
    'bus',
    'Tata Starbus 40-Seater',
    40,
    'Ramesh Kumar',
    '+91-9876541111',
    'KA01-20180012345',
    'active',
    false,
    now()
  ),
  
  -- Vehicle 2: School Bus 2 (Active)
  (
    'veh10000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'KA-01-AB-5678',
    'bus',
    'Ashok Leyland 45-Seater',
    45,
    'Suresh Sharma',
    '+91-9876541112',
    'KA01-20190023456',
    'active',
    false,
    now()
  ),
  
  -- Vehicle 3: Mini Van (Active)
  (
    'veh10000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'KA-02-CD-9012',
    'van',
    'Force Traveller 17-Seater',
    17,
    'Vijay Singh',
    '+91-9876541113',
    'KA02-20200034567',
    'active',
    false,
    now()
  ),
  
  -- Vehicle 4: School Bus 3 (Active)
  (
    'veh10000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'KA-03-EF-3456',
    'bus',
    'Eicher Skyline 52-Seater',
    52,
    'Prakash Reddy',
    '+91-9876541114',
    'KA03-20210045678',
    'active',
    false,
    now()
  ),
  
  -- Vehicle 5: Mini Bus (Active)
  (
    'veh10000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'KA-04-GH-7890',
    'bus',
    'Tata LP 410 30-Seater',
    30,
    'Anil Kumar',
    '+91-9876541115',
    'KA04-20220056789',
    'active',
    false,
    now()
  ),
  
  -- Vehicle 6: Van (Maintenance)
  (
    'veh10000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'KA-05-IJ-2345',
    'van',
    'Mahindra Tourister 25-Seater',
    25,
    'Ravi Kumar',
    '+91-9876541116',
    'KA05-20180067890',
    'maintenance',
    false,
    now()
  ),
  
  -- Vehicle 7: Bus (Inactive)
  (
    'veh10000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'KA-01-KL-6789',
    'bus',
    'Tata Starbus 40-Seater',
    40,
    'Mohan Das',
    '+91-9876541117',
    'KA01-20170078901',
    'inactive',
    false,
    now() - INTERVAL '6 months'
  ),
  
  -- Vehicle 8: Small Bus (Active)
  (
    'veh10000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'KA-06-MN-4567',
    'bus',
    'Force Traveller 26-Seater',
    26,
    'Sanjay Verma',
    '+91-9876541118',
    'KA06-20230089012',
    'active',
    false,
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROUTES
-- =====================================================

INSERT INTO routes (id, tenant_id, route_name, route_number, starting_point, ending_point, distance_km, fare, status, created_at)
VALUES
  -- Route 1: East Zone Route
  (
    'rout1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'East Zone Route',
    'R-001',
    'Whitefield Main Road',
    'School Campus',
    15.5,
    2500.00,
    'active',
    now()
  ),
  
  -- Route 2: North Zone Route
  (
    'rout1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'North Zone Route',
    'R-002',
    'Hebbal Circle',
    'School Campus',
    12.3,
    2200.00,
    'active',
    now()
  ),
  
  -- Route 3: South Zone Route
  (
    'rout1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'South Zone Route',
    'R-003',
    'Banashankari',
    'School Campus',
    18.7,
    2800.00,
    'active',
    now()
  ),
  
  -- Route 4: West Zone Route
  (
    'rout1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'West Zone Route',
    'R-004',
    'Rajajinagar',
    'School Campus',
    10.2,
    2000.00,
    'active',
    now()
  ),
  
  -- Route 5: Express Route
  (
    'rout1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Express Route',
    'R-005',
    'Electronic City',
    'School Campus',
    22.5,
    3200.00,
    'active',
    now()
  ),
  
  -- Route 6: Central Zone Route (Inactive)
  (
    'rout1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Central Zone Route',
    'R-006',
    'MG Road',
    'School Campus',
    8.5,
    1800.00,
    'inactive',
    now() - INTERVAL '3 months'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROUTE STOPS
-- =====================================================

-- Route 1: East Zone Route Stops
INSERT INTO route_stops (id, tenant_id, route_id, stop_name, stop_order, pickup_time, drop_time, created_at)
VALUES
  -- Route 1 Stops
  (
    'stop1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000001',
    'Whitefield Main Road',
    1,
    '07:00:00',
    '15:30:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000001',
    'Marathahalli Bridge',
    2,
    '07:15:00',
    '15:15:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000001',
    'HAL Airport Road',
    3,
    '07:30:00',
    '15:00:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000001',
    'Indiranagar 100 Feet Road',
    4,
    '07:45:00',
    '14:45:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000001',
    'School Campus',
    5,
    '08:00:00',
    '14:30:00',
    now()
  ),
  
  -- Route 2 Stops
  (
    'stop1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000002',
    'Hebbal Circle',
    1,
    '07:10:00',
    '15:40:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000002',
    'RT Nagar',
    2,
    '07:25:00',
    '15:25:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000002',
    'Manyata Tech Park',
    3,
    '07:40:00',
    '15:10:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000002',
    'School Campus',
    4,
    '08:00:00',
    '14:30:00',
    now()
  ),
  
  -- Route 3 Stops
  (
    'stop1000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000003',
    'Banashankari Bus Stand',
    1,
    '06:50:00',
    '15:50:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000003',
    'Jayanagar 4th Block',
    2,
    '07:05:00',
    '15:35:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000003',
    'JP Nagar',
    3,
    '07:20:00',
    '15:20:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000003',
    'BTM Layout',
    4,
    '07:35:00',
    '15:05:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000014',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000003',
    'School Campus',
    5,
    '08:00:00',
    '14:30:00',
    now()
  ),
  
  -- Route 4 Stops
  (
    'stop1000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000004',
    'Rajajinagar',
    1,
    '07:20:00',
    '15:30:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000016',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000004',
    'Mahalaxmi Layout',
    2,
    '07:35:00',
    '15:15:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000004',
    'School Campus',
    3,
    '08:00:00',
    '14:30:00',
    now()
  ),
  
  -- Route 5 Stops
  (
    'stop1000-0000-0000-0000-000000000018',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000005',
    'Electronic City Phase 1',
    1,
    '06:40:00',
    '16:00:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000005',
    'Bommanahalli',
    2,
    '06:55:00',
    '15:45:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000005',
    'HSR Layout',
    3,
    '07:10:00',
    '15:30:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000005',
    'Koramangala',
    4,
    '07:30:00',
    '15:10:00',
    now()
  ),
  (
    'stop1000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000005',
    'School Campus',
    5,
    '08:00:00',
    '14:30:00',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VEHICLE ASSIGNMENTS
-- =====================================================

INSERT INTO vehicle_assignments (id, tenant_id, vehicle_id, route_id, assigned_date, status, created_at)
VALUES
  -- Vehicle 1 assigned to Route 1
  (
    'vass1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'veh10000-0000-0000-0000-000000000001',
    'rout1000-0000-0000-0000-000000000001',
    CURRENT_DATE - INTERVAL '3 months',
    'active',
    now() - INTERVAL '3 months'
  ),
  
  -- Vehicle 2 assigned to Route 2
  (
    'vass1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'veh10000-0000-0000-0000-000000000002',
    'rout1000-0000-0000-0000-000000000002',
    CURRENT_DATE - INTERVAL '3 months',
    'active',
    now() - INTERVAL '3 months'
  ),
  
  -- Vehicle 3 assigned to Route 4
  (
    'vass1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'veh10000-0000-0000-0000-000000000003',
    'rout1000-0000-0000-0000-000000000004',
    CURRENT_DATE - INTERVAL '2 months',
    'active',
    now() - INTERVAL '2 months'
  ),
  
  -- Vehicle 4 assigned to Route 3
  (
    'vass1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'veh10000-0000-0000-0000-000000000004',
    'rout1000-0000-0000-0000-000000000003',
    CURRENT_DATE - INTERVAL '2 months',
    'active',
    now() - INTERVAL '2 months'
  ),
  
  -- Vehicle 5 assigned to Route 5
  (
    'vass1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'veh10000-0000-0000-0000-000000000005',
    'rout1000-0000-0000-0000-000000000005',
    CURRENT_DATE - INTERVAL '1 month',
    'active',
    now() - INTERVAL '1 month'
  ),
  
  -- Vehicle 8 assigned to Route 1 (Backup)
  (
    'vass1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'veh10000-0000-0000-0000-000000000008',
    'rout1000-0000-0000-0000-000000000001',
    CURRENT_DATE,
    'active',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STUDENT TRANSPORT REGISTRATIONS
-- =====================================================
-- Note: Replace student IDs with actual student IDs from students table
-- This assumes students exist with IDs from students_test_data.sql

INSERT INTO student_transport (id, tenant_id, student_id, route_id, stop_id, academic_year_id, status, created_at)
VALUES
  -- Students using Route 1 (East Zone)
  (
    'sttr1000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000001', -- Replace with actual student ID
    'rout1000-0000-0000-0000-000000000001',
    'stop1000-0000-0000-0000-000000000002', -- Marathahalli Bridge
    'ay100000-0000-0000-0000-000000000001', -- Replace with actual academic year ID
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000002',
    'rout1000-0000-0000-0000-000000000001',
    'stop1000-0000-0000-0000-000000000003', -- HAL Airport Road
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000003',
    'rout1000-0000-0000-0000-000000000001',
    'stop1000-0000-0000-0000-000000000004', -- Indiranagar
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  
  -- Students using Route 2 (North Zone)
  (
    'sttr1000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000004',
    'rout1000-0000-0000-0000-000000000002',
    'stop1000-0000-0000-0000-000000000007', -- RT Nagar
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000005',
    'rout1000-0000-0000-0000-000000000002',
    'stop1000-0000-0000-0000-000000000008', -- Manyata Tech Park
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  
  -- Students using Route 3 (South Zone)
  (
    'sttr1000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000006',
    'rout1000-0000-0000-0000-000000000003',
    'stop1000-0000-0000-0000-000000000011', -- Jayanagar
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000007',
    'rout1000-0000-0000-0000-000000000003',
    'stop1000-0000-0000-0000-000000000012', -- JP Nagar
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000008',
    'rout1000-0000-0000-0000-000000000003',
    'stop1000-0000-0000-0000-000000000013', -- BTM Layout
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  
  -- Students using Route 4 (West Zone)
  (
    'sttr1000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000009',
    'rout1000-0000-0000-0000-000000000004',
    'stop1000-0000-0000-0000-000000000015', -- Rajajinagar
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000010',
    'rout1000-0000-0000-0000-000000000004',
    'stop1000-0000-0000-0000-000000000016', -- Mahalaxmi Layout
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  
  -- Students using Route 5 (Express)
  (
    'sttr1000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000011',
    'rout1000-0000-0000-0000-000000000005',
    'stop1000-0000-0000-0000-000000000019', -- Bommanahalli
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000012',
    'rout1000-0000-0000-0000-000000000005',
    'stop1000-0000-0000-0000-000000000020', -- HSR Layout
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  ),
  (
    'sttr1000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000001',
    'st100000-0000-0000-0000-000000000013',
    'rout1000-0000-0000-0000-000000000005',
    'stop1000-0000-0000-0000-000000000021', -- Koramangala
    'ay100000-0000-0000-0000-000000000001',
    'active',
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify the data was inserted correctly

-- Check vehicles by status
-- SELECT status, COUNT(*) as count FROM vehicles 
-- WHERE tenant_id = '00000000-0000-0000-0000-000000000001' 
-- GROUP BY status ORDER BY status;

-- Check routes and their stops
-- SELECT r.route_name, r.route_number, COUNT(rs.id) as stop_count
-- FROM routes r
-- LEFT JOIN route_stops rs ON r.id = rs.route_id
-- WHERE r.tenant_id = '00000000-0000-0000-0000-000000000001'
-- GROUP BY r.id, r.route_name, r.route_number
-- ORDER BY r.route_number;

-- Check vehicle assignments
-- SELECT v.vehicle_number, r.route_name, va.assigned_date, va.status
-- FROM vehicle_assignments va
-- JOIN vehicles v ON va.vehicle_id = v.id
-- JOIN routes r ON va.route_id = r.id
-- WHERE va.tenant_id = '00000000-0000-0000-0000-000000000001'
-- ORDER BY va.assigned_date DESC;

-- Check student transport registrations by route
-- SELECT r.route_name, COUNT(st.id) as student_count
-- FROM student_transport st
-- JOIN routes r ON st.route_id = r.id
-- WHERE st.tenant_id = '00000000-0000-0000-0000-000000000001'
-- AND st.status = 'active'
-- GROUP BY r.route_name
-- ORDER BY student_count DESC;

-- Check route stops with timings
-- SELECT r.route_name, rs.stop_name, rs.stop_order, rs.pickup_time, rs.drop_time
-- FROM route_stops rs
-- JOIN routes r ON rs.route_id = r.id
-- WHERE rs.tenant_id = '00000000-0000-0000-0000-000000000001'
-- ORDER BY r.route_name, rs.stop_order;

-- =====================================================
-- NOTES FOR TESTING
-- =====================================================
-- This seed data provides:
-- 
-- 1. **8 Vehicles** - Mix of buses and vans with different statuses
--    - 5 Active buses
--    - 1 Active van
--    - 1 Van in maintenance
--    - 1 Inactive bus
--
-- 2. **6 Routes** - Covering different zones
--    - 5 Active routes
--    - 1 Inactive route
--    - Various distances (8.5 km to 22.5 km)
--    - Different fare structures
--
-- 3. **22 Route Stops** - Multiple stops per route
--    - 3-5 stops per route
--    - Pickup and drop times
--    - Sequential stop ordering
--
-- 4. **6 Vehicle Assignments** - Active assignments
--    - One vehicle per active route
--    - One backup assignment
--
-- 5. **13 Student Transport Registrations**
--    - Students distributed across all active routes
--    - Each student assigned to a specific stop
--
-- Use Cases for Testing:
-- - Create: Add new vehicles, routes, stops
-- - Read: List vehicles by status, routes with stops
-- - Update: Change vehicle assignments, modify routes
-- - Delete: Mark vehicles/routes as inactive
-- - Reports: Students per route, vehicle utilization
-- - Live Tracking: Vehicle locations on routes
-- - Notifications: Late arrivals, route changes
--
-- Prerequisites:
-- - Tenant must exist (00000000-0000-0000-0000-000000000001)
-- - Academic year should exist for student transport
-- - Students should exist for transport registrations
--
-- =====================================================
