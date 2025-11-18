-- School ERP Database Schema
-- This file contains all the table schemas for the School Management System

-- Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NULL,
  admission_no TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT NULL,
  address TEXT NULL,
  city TEXT NULL,
  state TEXT NULL,
  pincode TEXT NULL,
  phone TEXT NULL,
  email TEXT NULL,
  parent_id UUID NULL,
  class_id UUID NULL,
  section_id UUID NULL,
  admission_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'withdrawn')),
  photo_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT students_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT students_section_id_fkey FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
  CONSTRAINT students_admission_no_unique UNIQUE (tenant_id, admission_no)
) TABLESPACE pg_default;

-- Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NULL,
  employee_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  blood_group TEXT NULL,
  address TEXT NULL,
  city TEXT NULL,
  state TEXT NULL,
  pincode TEXT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT NULL,
  qualification TEXT NULL,
  experience_years INTEGER NULL,
  joining_date DATE NOT NULL,
  salary NUMERIC NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  photo_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT staff_pkey PRIMARY KEY (id),
  CONSTRAINT staff_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT staff_employee_id_unique UNIQUE (tenant_id, employee_id)
) TABLESPACE pg_default;

-- Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT classes_pkey PRIMARY KEY (id),
  CONSTRAINT classes_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT classes_name_unique UNIQUE (tenant_id, name)
) TABLESPACE pg_default;

-- Sections Table
CREATE TABLE IF NOT EXISTS public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  class_id UUID NOT NULL,
  name TEXT NOT NULL,
  capacity INTEGER NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT sections_pkey PRIMARY KEY (id),
  CONSTRAINT sections_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT sections_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT sections_name_unique UNIQUE (class_id, name)
) TABLESPACE pg_default;

-- Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT subjects_pkey PRIMARY KEY (id),
  CONSTRAINT subjects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT subjects_code_unique UNIQUE (tenant_id, code)
) TABLESPACE pg_default;

-- Timetable Table
CREATE TABLE IF NOT EXISTS public.timetable (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  class_id UUID NOT NULL,
  section_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  staff_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_no TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT timetable_pkey PRIMARY KEY (id),
  CONSTRAINT timetable_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT timetable_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT timetable_section_id_fkey FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
  CONSTRAINT timetable_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  CONSTRAINT timetable_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Fee Structures Table
CREATE TABLE IF NOT EXISTS public.fee_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  class_id UUID NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time')),
  due_date DATE NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT fee_structures_pkey PRIMARY KEY (id),
  CONSTRAINT fee_structures_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fee_structures_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Fee Payments Table
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL,
  amount_paid NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi', 'bank_transfer', 'cheque')),
  transaction_id TEXT NULL,
  receipt_no TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT fee_payments_pkey PRIMARY KEY (id),
  CONSTRAINT fee_payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fee_payments_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fee_payments_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE,
  CONSTRAINT fee_payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fee_payments_receipt_no_unique UNIQUE (tenant_id, receipt_no)
) TABLESPACE pg_default;

-- Library Books Table
CREATE TABLE IF NOT EXISTS public.library_books (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT NULL,
  category TEXT NOT NULL,
  publisher TEXT NULL,
  publication_year INTEGER NULL,
  total_copies INTEGER NOT NULL,
  available_copies INTEGER NOT NULL,
  rack_no TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT library_books_pkey PRIMARY KEY (id),
  CONSTRAINT library_books_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Library Transactions Table
CREATE TABLE IF NOT EXISTS public.library_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  book_id UUID NOT NULL,
  student_id UUID NULL,
  staff_id UUID NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  fine_amount NUMERIC NULL,
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT library_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT library_transactions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_book_id_fkey FOREIGN KEY (book_id) REFERENCES library_books(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_borrower_check CHECK (
    (student_id IS NOT NULL AND staff_id IS NULL) OR 
    (student_id IS NULL AND staff_id IS NOT NULL)
  )
) TABLESPACE pg_default;

-- Exams Table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('unit_test', 'mid_term', 'final', 'practical', 'other')),
  class_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT exams_pkey PRIMARY KEY (id),
  CONSTRAINT exams_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT exams_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Exam Results Table
CREATE TABLE IF NOT EXISTS public.exam_results (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  exam_id UUID NOT NULL,
  student_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  marks_obtained NUMERIC NOT NULL,
  total_marks NUMERIC NOT NULL,
  grade TEXT NULL,
  remarks TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT exam_results_pkey PRIMARY KEY (id),
  CONSTRAINT exam_results_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT exam_results_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  CONSTRAINT exam_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT exam_results_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  CONSTRAINT exam_results_unique UNIQUE (exam_id, student_id, subject_id)
) TABLESPACE pg_default;

-- Transport Routes Table
CREATE TABLE IF NOT EXISTS public.transport_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  route_name TEXT NOT NULL,
  route_number TEXT NOT NULL,
  starting_point TEXT NOT NULL,
  ending_point TEXT NOT NULL,
  total_distance NUMERIC NULL,
  fare NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT transport_routes_pkey PRIMARY KEY (id),
  CONSTRAINT transport_routes_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT transport_routes_route_number_unique UNIQUE (tenant_id, route_number)
) TABLESPACE pg_default;

-- Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('bus', 'van', 'car')),
  capacity INTEGER NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  route_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT vehicles_route_id_fkey FOREIGN KEY (route_id) REFERENCES transport_routes(id) ON DELETE SET NULL,
  CONSTRAINT vehicles_vehicle_number_unique UNIQUE (tenant_id, vehicle_number)
) TABLESPACE pg_default;

-- Transport Allocations Table
CREATE TABLE IF NOT EXISTS public.transport_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  route_id UUID NOT NULL,
  pickup_point TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT transport_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT transport_allocations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT transport_allocations_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT transport_allocations_route_id_fkey FOREIGN KEY (route_id) REFERENCES transport_routes(id) ON DELETE CASCADE,
  CONSTRAINT transport_allocations_student_unique UNIQUE (student_id)
) TABLESPACE pg_default;

-- Inventory Items Table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  reorder_level NUMERIC NULL,
  price_per_unit NUMERIC NOT NULL,
  supplier TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT inventory_items_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  order_number TEXT NOT NULL,
  supplier TEXT NOT NULL,
  order_date DATE NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'received', 'cancelled')),
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT purchase_orders_order_number_unique UNIQUE (tenant_id, order_number)
) TABLESPACE pg_default;

-- Hostel Buildings Table
CREATE TABLE IF NOT EXISTS public.hostel_buildings (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('boys', 'girls', 'staff')),
  total_rooms INTEGER NOT NULL,
  warden_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT hostel_buildings_pkey PRIMARY KEY (id),
  CONSTRAINT hostel_buildings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT hostel_buildings_warden_id_fkey FOREIGN KEY (warden_id) REFERENCES staff(id) ON DELETE SET NULL
) TABLESPACE pg_default;

-- Hostel Rooms Table
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  building_id UUID NOT NULL,
  room_number TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  occupied INTEGER NOT NULL DEFAULT 0,
  floor INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT hostel_rooms_pkey PRIMARY KEY (id),
  CONSTRAINT hostel_rooms_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT hostel_rooms_building_id_fkey FOREIGN KEY (building_id) REFERENCES hostel_buildings(id) ON DELETE CASCADE,
  CONSTRAINT hostel_rooms_room_number_unique UNIQUE (building_id, room_number)
) TABLESPACE pg_default;

-- Hostel Allocations Table
CREATE TABLE IF NOT EXISTS public.hostel_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  room_id UUID NOT NULL,
  allocation_date DATE NOT NULL,
  checkout_date DATE NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'checkout')),
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT hostel_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT hostel_allocations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT hostel_allocations_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT hostel_allocations_room_id_fkey FOREIGN KEY (room_id) REFERENCES hostel_rooms(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NULL,
  staff_id UUID NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'half_day', 'leave')),
  remarks TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT attendance_pkey PRIMARY KEY (id),
  CONSTRAINT attendance_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT attendance_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT attendance_person_check CHECK (
    (student_id IS NOT NULL AND staff_id IS NULL) OR 
    (student_id IS NULL AND staff_id IS NOT NULL)
  ),
  CONSTRAINT attendance_student_date_unique UNIQUE (student_id, date),
  CONSTRAINT attendance_staff_date_unique UNIQUE (staff_id, date)
) TABLESPACE pg_default;

-- Accounts Table
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  transaction_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi', 'bank_transfer', 'cheque')),
  reference_no TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT accounts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
) TABLESPACE pg_default;

-- Visitors Table
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  purpose TEXT NOT NULL,
  whom_to_meet TEXT NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE NOT NULL,
  check_out TIMESTAMP WITH TIME ZONE NULL,
  id_proof_type TEXT NULL,
  id_proof_number TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT visitors_pkey PRIMARY KEY (id),
  CONSTRAINT visitors_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Medical Records Table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NULL,
  staff_id UUID NULL,
  date DATE NOT NULL,
  complaint TEXT NOT NULL,
  diagnosis TEXT NULL,
  treatment TEXT NULL,
  medicines_prescribed TEXT NULL,
  doctor_name TEXT NULL,
  follow_up_date DATE NULL,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  CONSTRAINT medical_records_pkey PRIMARY KEY (id),
  CONSTRAINT medical_records_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT medical_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT medical_records_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT medical_records_patient_check CHECK (
    (student_id IS NOT NULL AND staff_id IS NULL) OR 
    (student_id IS NULL AND staff_id IS NOT NULL)
  )
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_tenant_id ON public.students(tenant_id);
CREATE INDEX IF NOT EXISTS idx_students_class_section ON public.students(class_id, section_id);
CREATE INDEX IF NOT EXISTS idx_staff_tenant_id ON public.staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student_id ON public.fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_library_transactions_book_id ON public.library_transactions(book_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam_student ON public.exam_results(exam_id, student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_accounts_transaction_date ON public.accounts(transaction_date);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
