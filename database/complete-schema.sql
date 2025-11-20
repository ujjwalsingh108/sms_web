-- =====================================================
-- COMPLETE SCHOOL ERP DATABASE SCHEMA
-- =====================================================
-- Note: Tenants, Roles, and Members tables are already created
-- This schema includes all other modules

-- =====================================================
-- ACADEMIC STRUCTURE
-- =====================================================

CREATE TABLE public.academic_years (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT academic_years_pkey PRIMARY KEY (id),
  CONSTRAINT academic_years_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT classes_pkey PRIMARY KEY (id),
  CONSTRAINT classes_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  class_id UUID NOT NULL,
  name TEXT NOT NULL,
  room_number TEXT NULL,
  capacity INTEGER NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT sections_pkey PRIMARY KEY (id),
  CONSTRAINT sections_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT sections_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT subjects_pkey PRIMARY KEY (id),
  CONSTRAINT subjects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.class_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  class_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT class_subjects_pkey PRIMARY KEY (id),
  CONSTRAINT class_subjects_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT class_subjects_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT class_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  CONSTRAINT class_subjects_unique UNIQUE (class_id, subject_id)
) TABLESPACE pg_default;

-- =====================================================
-- STAFF MANAGEMENT
-- =====================================================

CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID NULL,
  employee_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NULL,
  date_of_birth DATE NULL,
  gender TEXT NULL,
  address TEXT NULL,
  qualification TEXT NULL,
  designation TEXT NULL,
  department TEXT NULL,
  date_of_joining DATE NULL,
  salary DECIMAL(10,2) NULL,
  status TEXT DEFAULT 'active'::TEXT,
  photo_url TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT staff_pkey PRIMARY KEY (id),
  CONSTRAINT staff_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT staff_employee_id_unique UNIQUE (tenant_id, employee_id),
  CONSTRAINT staff_gender_check CHECK (gender = ANY (ARRAY['male'::TEXT, 'female'::TEXT, 'other'::TEXT])),
  CONSTRAINT staff_status_check CHECK (status = ANY (ARRAY['active'::TEXT, 'inactive'::TEXT, 'on_leave'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.staff_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  staff_id UUID NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  check_in TIME NULL,
  check_out TIME NULL,
  notes TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT staff_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT staff_attendance_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT staff_attendance_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT staff_attendance_unique UNIQUE (staff_id, date),
  CONSTRAINT staff_attendance_status_check CHECK (status = ANY (ARRAY['present'::TEXT, 'absent'::TEXT, 'half_day'::TEXT, 'on_leave'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- ADMISSION MODULE
-- =====================================================

CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  admission_no TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NULL,
  gender TEXT NULL,
  blood_group TEXT NULL,
  email TEXT NULL,
  phone TEXT NULL,
  address TEXT NULL,
  photo_url TEXT NULL,
  class_id UUID NULL,
  section_id UUID NULL,
  admission_date DATE NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT students_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT students_section_id_fkey FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
  CONSTRAINT students_admission_no_unique UNIQUE (tenant_id, admission_no),
  CONSTRAINT students_gender_check CHECK (gender = ANY (ARRAY['male'::TEXT, 'female'::TEXT, 'other'::TEXT])),
  CONSTRAINT students_status_check CHECK (status = ANY (ARRAY['active'::TEXT, 'inactive'::TEXT, 'graduated'::TEXT, 'transferred'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.guardians (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NULL,
  phone TEXT NULL,
  email TEXT NULL,
  occupation TEXT NULL,
  address TEXT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT guardians_pkey PRIMARY KEY (id),
  CONSTRAINT guardians_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT guardians_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.admission_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  application_no TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NULL,
  gender TEXT NULL,
  class_id UUID NULL,
  guardian_name TEXT NULL,
  guardian_phone TEXT NULL,
  guardian_email TEXT NULL,
  status TEXT DEFAULT 'pending'::TEXT,
  applied_date DATE DEFAULT CURRENT_DATE,
  remarks TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT admission_applications_pkey PRIMARY KEY (id),
  CONSTRAINT admission_applications_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT admission_applications_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT admission_applications_status_check CHECK (status = ANY (ARRAY['pending'::TEXT, 'approved'::TEXT, 'rejected'::TEXT, 'waitlisted'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- TRANSPORT MODULE
-- =====================================================

CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_number TEXT NOT NULL,
  vehicle_type TEXT NULL,
  model TEXT NULL,
  capacity INTEGER NULL,
  driver_name TEXT NULL,
  driver_phone TEXT NULL,
  driver_license TEXT NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT vehicles_pkey PRIMARY KEY (id),
  CONSTRAINT vehicles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT vehicles_vehicle_number_unique UNIQUE (tenant_id, vehicle_number),
  CONSTRAINT vehicles_status_check CHECK (status = ANY (ARRAY['active'::TEXT, 'inactive'::TEXT, 'maintenance'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  route_name TEXT NOT NULL,
  route_number TEXT NULL,
  starting_point TEXT NULL,
  ending_point TEXT NULL,
  distance_km DECIMAL(6,2) NULL,
  fare DECIMAL(10,2) NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT routes_pkey PRIMARY KEY (id),
  CONSTRAINT routes_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT routes_status_check CHECK (status = ANY (ARRAY['active'::TEXT, 'inactive'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.route_stops (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  route_id UUID NOT NULL,
  stop_name TEXT NOT NULL,
  stop_order INTEGER NOT NULL,
  pickup_time TIME NULL,
  drop_time TIME NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT route_stops_pkey PRIMARY KEY (id),
  CONSTRAINT route_stops_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT route_stops_route_id_fkey FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.vehicle_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  route_id UUID NOT NULL,
  assigned_date DATE NOT NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT vehicle_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT vehicle_assignments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_assignments_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  CONSTRAINT vehicle_assignments_route_id_fkey FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.student_transport (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  route_id UUID NOT NULL,
  stop_id UUID NULL,
  academic_year_id UUID NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT student_transport_pkey PRIMARY KEY (id),
  CONSTRAINT student_transport_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT student_transport_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT student_transport_route_id_fkey FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  CONSTRAINT student_transport_stop_id_fkey FOREIGN KEY (stop_id) REFERENCES route_stops(id) ON DELETE SET NULL,
  CONSTRAINT student_transport_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL
) TABLESPACE pg_default;

-- =====================================================
-- FEE MANAGEMENT MODULE
-- =====================================================

CREATE TABLE public.fee_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  class_id UUID NULL,
  amount DECIMAL(10,2) NOT NULL,
  frequency TEXT DEFAULT 'monthly'::TEXT,
  academic_year_id UUID NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fee_structures_pkey PRIMARY KEY (id),
  CONSTRAINT fee_structures_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fee_structures_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT fee_structures_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL,
  CONSTRAINT fee_structures_frequency_check CHECK (frequency = ANY (ARRAY['monthly'::TEXT, 'quarterly'::TEXT, 'yearly'::TEXT, 'one_time'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  fee_structure_id UUID NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT NULL,
  transaction_id TEXT NULL,
  status TEXT DEFAULT 'completed'::TEXT,
  remarks TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fee_payments_pkey PRIMARY KEY (id),
  CONSTRAINT fee_payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fee_payments_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fee_payments_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE SET NULL,
  CONSTRAINT fee_payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT fee_payments_payment_method_check CHECK (payment_method = ANY (ARRAY['cash'::TEXT, 'cheque'::TEXT, 'online'::TEXT, 'card'::TEXT, 'upi'::TEXT])),
  CONSTRAINT fee_payments_status_check CHECK (status = ANY (ARRAY['pending'::TEXT, 'completed'::TEXT, 'failed'::TEXT, 'refunded'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.fee_discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL,
  discount_percentage DECIMAL(5,2) NULL,
  discount_amount DECIMAL(10,2) NULL,
  reason TEXT NULL,
  approved_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fee_discounts_pkey PRIMARY KEY (id),
  CONSTRAINT fee_discounts_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT fee_discounts_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fee_discounts_fee_structure_id_fkey FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE,
  CONSTRAINT fee_discounts_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL
) TABLESPACE pg_default;

-- =====================================================
-- LIBRARY MODULE
-- =====================================================

CREATE TABLE public.library_books (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  isbn TEXT NULL,
  title TEXT NOT NULL,
  author TEXT NULL,
  publisher TEXT NULL,
  category TEXT NULL,
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  rack_number TEXT NULL,
  price DECIMAL(10,2) NULL,
  status TEXT DEFAULT 'available'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT library_books_pkey PRIMARY KEY (id),
  CONSTRAINT library_books_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT library_books_status_check CHECK (status = ANY (ARRAY['available'::TEXT, 'unavailable'::TEXT, 'damaged'::TEXT, 'lost'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.library_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  book_id UUID NOT NULL,
  student_id UUID NULL,
  staff_id UUID NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  fine_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'issued'::TEXT,
  remarks TEXT NULL,
  issued_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT library_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT library_transactions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_book_id_fkey FOREIGN KEY (book_id) REFERENCES library_books(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT library_transactions_issued_by_fkey FOREIGN KEY (issued_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT library_transactions_status_check CHECK (status = ANY (ARRAY['issued'::TEXT, 'returned'::TEXT, 'overdue'::TEXT, 'lost'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- EXAMINATION MODULE
-- =====================================================

CREATE TABLE public.exam_types (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT exam_types_pkey PRIMARY KEY (id),
  CONSTRAINT exam_types_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  exam_type_id UUID NOT NULL,
  name TEXT NOT NULL,
  academic_year_id UUID NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  status TEXT DEFAULT 'scheduled'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT exams_pkey PRIMARY KEY (id),
  CONSTRAINT exams_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT exams_exam_type_id_fkey FOREIGN KEY (exam_type_id) REFERENCES exam_types(id) ON DELETE CASCADE,
  CONSTRAINT exams_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL,
  CONSTRAINT exams_status_check CHECK (status = ANY (ARRAY['scheduled'::TEXT, 'ongoing'::TEXT, 'completed'::TEXT, 'cancelled'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.exam_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  exam_id UUID NOT NULL,
  class_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  room_number TEXT NULL,
  max_marks DECIMAL(6,2) DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT exam_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT exam_schedules_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT exam_schedules_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  CONSTRAINT exam_schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT exam_schedules_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.exam_results (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  exam_schedule_id UUID NOT NULL,
  student_id UUID NOT NULL,
  marks_obtained DECIMAL(6,2) NULL,
  grade TEXT NULL,
  remarks TEXT NULL,
  is_absent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT exam_results_pkey PRIMARY KEY (id),
  CONSTRAINT exam_results_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT exam_results_exam_schedule_id_fkey FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedules(id) ON DELETE CASCADE,
  CONSTRAINT exam_results_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT exam_results_unique UNIQUE (exam_schedule_id, student_id)
) TABLESPACE pg_default;

-- =====================================================
-- TIMETABLE MODULE
-- =====================================================

CREATE TABLE public.timetables (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  class_id UUID NOT NULL,
  section_id UUID NULL,
  academic_year_id UUID NULL,
  day_of_week INTEGER NOT NULL,
  period_number INTEGER NOT NULL,
  subject_id UUID NULL,
  teacher_id UUID NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT timetables_pkey PRIMARY KEY (id),
  CONSTRAINT timetables_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT timetables_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT timetables_section_id_fkey FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
  CONSTRAINT timetables_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE SET NULL,
  CONSTRAINT timetables_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
  CONSTRAINT timetables_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL,
  CONSTRAINT timetables_day_of_week_check CHECK (day_of_week >= 1 AND day_of_week <= 7)
) TABLESPACE pg_default;

-- =====================================================
-- ATTENDANCE MODULE
-- =====================================================

CREATE TABLE public.student_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  class_id UUID NOT NULL,
  section_id UUID NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  remarks TEXT NULL,
  marked_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT student_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT student_attendance_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT student_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT student_attendance_class_id_fkey FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT student_attendance_section_id_fkey FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE SET NULL,
  CONSTRAINT student_attendance_marked_by_fkey FOREIGN KEY (marked_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT student_attendance_unique UNIQUE (student_id, date),
  CONSTRAINT student_attendance_status_check CHECK (status = ANY (ARRAY['present'::TEXT, 'absent'::TEXT, 'half_day'::TEXT, 'late'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- INVENTORY & PURCHASE MODULE
-- =====================================================

CREATE TABLE public.inventory_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT inventory_categories_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_categories_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  category_id UUID NULL,
  item_name TEXT NOT NULL,
  item_code TEXT NULL,
  description TEXT NULL,
  unit TEXT NULL,
  quantity INTEGER DEFAULT 0,
  minimum_quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10,2) NULL,
  location TEXT NULL,
  status TEXT DEFAULT 'available'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT inventory_items_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT inventory_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES inventory_categories(id) ON DELETE SET NULL,
  CONSTRAINT inventory_items_status_check CHECK (status = ANY (ARRAY['available'::TEXT, 'out_of_stock'::TEXT, 'discontinued'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT NULL,
  phone TEXT NULL,
  email TEXT NULL,
  address TEXT NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT suppliers_pkey PRIMARY KEY (id),
  CONSTRAINT suppliers_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  order_number TEXT NOT NULL,
  supplier_id UUID NULL,
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery_date DATE NULL,
  total_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending'::TEXT,
  remarks TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
  CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT purchase_orders_order_number_unique UNIQUE (tenant_id, order_number),
  CONSTRAINT purchase_orders_status_check CHECK (status = ANY (ARRAY['pending'::TEXT, 'approved'::TEXT, 'delivered'::TEXT, 'cancelled'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  purchase_order_id UUID NOT NULL,
  inventory_item_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_order_items_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  CONSTRAINT purchase_order_items_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- =====================================================
-- ACCOUNTS MODULE
-- =====================================================

CREATE TABLE public.account_heads (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT account_heads_pkey PRIMARY KEY (id),
  CONSTRAINT account_heads_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT account_heads_type_check CHECK (type = ANY (ARRAY['income'::TEXT, 'expense'::TEXT, 'asset'::TEXT, 'liability'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  transaction_date DATE NOT NULL,
  account_head_id UUID NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT NULL,
  reference_number TEXT NULL,
  description TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT transactions_account_head_id_fkey FOREIGN KEY (account_head_id) REFERENCES account_heads(id) ON DELETE CASCADE,
  CONSTRAINT transactions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT transactions_type_check CHECK (type = ANY (ARRAY['debit'::TEXT, 'credit'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- RECEPTION/VISITOR MODULE
-- =====================================================

CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  visitor_name TEXT NOT NULL,
  phone TEXT NULL,
  email TEXT NULL,
  purpose TEXT NULL,
  person_to_meet TEXT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  check_out_time TIMESTAMP WITH TIME ZONE NULL,
  id_proof_type TEXT NULL,
  id_proof_number TEXT NULL,
  photo_url TEXT NULL,
  status TEXT DEFAULT 'checked_in'::TEXT,
  remarks TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT visitors_pkey PRIMARY KEY (id),
  CONSTRAINT visitors_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT visitors_status_check CHECK (status = ANY (ARRAY['checked_in'::TEXT, 'checked_out'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.phone_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  caller_name TEXT NOT NULL,
  caller_phone TEXT NULL,
  purpose TEXT NULL,
  person_to_contact TEXT NULL,
  call_date DATE DEFAULT CURRENT_DATE,
  call_time TIME DEFAULT CURRENT_TIME,
  message TEXT NULL,
  status TEXT DEFAULT 'pending'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT phone_logs_pkey PRIMARY KEY (id),
  CONSTRAINT phone_logs_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT phone_logs_status_check CHECK (status = ANY (ARRAY['pending'::TEXT, 'contacted'::TEXT, 'completed'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- INFIRMARY MODULE
-- =====================================================

CREATE TABLE public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  record_date DATE DEFAULT CURRENT_DATE,
  symptoms TEXT NULL,
  diagnosis TEXT NULL,
  treatment TEXT NULL,
  prescription TEXT NULL,
  doctor_name TEXT NULL,
  follow_up_date DATE NULL,
  remarks TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT medical_records_pkey PRIMARY KEY (id),
  CONSTRAINT medical_records_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT medical_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT medical_records_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
) TABLESPACE pg_default;

CREATE TABLE public.medical_checkups (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  checkup_date DATE NOT NULL,
  height DECIMAL(5,2) NULL,
  weight DECIMAL(5,2) NULL,
  blood_pressure TEXT NULL,
  temperature DECIMAL(4,2) NULL,
  vision_test TEXT NULL,
  remarks TEXT NULL,
  conducted_by UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT medical_checkups_pkey PRIMARY KEY (id),
  CONSTRAINT medical_checkups_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT medical_checkups_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT medical_checkups_conducted_by_fkey FOREIGN KEY (conducted_by) REFERENCES auth.users(id) ON DELETE SET NULL
) TABLESPACE pg_default;

-- =====================================================
-- SECURITY MODULE
-- =====================================================

CREATE TABLE public.security_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  incident_date DATE NOT NULL,
  incident_time TIME NOT NULL,
  incident_type TEXT NULL,
  location TEXT NULL,
  description TEXT NULL,
  severity TEXT DEFAULT 'low'::TEXT,
  reported_by TEXT NULL,
  action_taken TEXT NULL,
  status TEXT DEFAULT 'open'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT security_incidents_pkey PRIMARY KEY (id),
  CONSTRAINT security_incidents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT security_incidents_severity_check CHECK (severity = ANY (ARRAY['low'::TEXT, 'medium'::TEXT, 'high'::TEXT, 'critical'::TEXT])),
  CONSTRAINT security_incidents_status_check CHECK (status = ANY (ARRAY['open'::TEXT, 'investigating'::TEXT, 'resolved'::TEXT, 'closed'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.gate_passes (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NULL,
  staff_id UUID NULL,
  pass_date DATE NOT NULL,
  exit_time TIME NOT NULL,
  expected_return_time TIME NULL,
  actual_return_time TIME NULL,
  reason TEXT NULL,
  approved_by UUID NULL,
  status TEXT DEFAULT 'pending'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT gate_passes_pkey PRIMARY KEY (id),
  CONSTRAINT gate_passes_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT gate_passes_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT gate_passes_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT gate_passes_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT gate_passes_status_check CHECK (status = ANY (ARRAY['pending'::TEXT, 'approved'::TEXT, 'rejected'::TEXT, 'returned'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- HOSTEL MODULE
-- =====================================================

CREATE TABLE public.hostels (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  hostel_type TEXT NULL,
  address TEXT NULL,
  total_rooms INTEGER DEFAULT 0,
  warden_name TEXT NULL,
  warden_phone TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT hostels_pkey PRIMARY KEY (id),
  CONSTRAINT hostels_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT hostels_hostel_type_check CHECK (hostel_type = ANY (ARRAY['boys'::TEXT, 'girls'::TEXT, 'mixed'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.hostel_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  hostel_id UUID NOT NULL,
  room_number TEXT NOT NULL,
  floor_number INTEGER NULL,
  room_type TEXT NULL,
  capacity INTEGER DEFAULT 1,
  occupied_beds INTEGER DEFAULT 0,
  monthly_fee DECIMAL(10,2) NULL,
  status TEXT DEFAULT 'available'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT hostel_rooms_pkey PRIMARY KEY (id),
  CONSTRAINT hostel_rooms_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT hostel_rooms_hostel_id_fkey FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  CONSTRAINT hostel_rooms_room_number_unique UNIQUE (hostel_id, room_number),
  CONSTRAINT hostel_rooms_status_check CHECK (status = ANY (ARRAY['available'::TEXT, 'occupied'::TEXT, 'maintenance'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.hostel_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  hostel_id UUID NOT NULL,
  room_id UUID NOT NULL,
  allocation_date DATE DEFAULT CURRENT_DATE,
  checkout_date DATE NULL,
  monthly_fee DECIMAL(10,2) NULL,
  status TEXT DEFAULT 'active'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT hostel_allocations_pkey PRIMARY KEY (id),
  CONSTRAINT hostel_allocations_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT hostel_allocations_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT hostel_allocations_hostel_id_fkey FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
  CONSTRAINT hostel_allocations_room_id_fkey FOREIGN KEY (room_id) REFERENCES hostel_rooms(id) ON DELETE CASCADE,
  CONSTRAINT hostel_allocations_status_check CHECK (status = ANY (ARRAY['active'::TEXT, 'vacated'::TEXT]))
) TABLESPACE pg_default;

-- =====================================================
-- MESS MODULE
-- =====================================================

CREATE TABLE public.mess_menus (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  menu_items TEXT NOT NULL,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_to DATE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT mess_menus_pkey PRIMARY KEY (id),
  CONSTRAINT mess_menus_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT mess_menus_day_of_week_check CHECK (day_of_week >= 1 AND day_of_week <= 7),
  CONSTRAINT mess_menus_meal_type_check CHECK (meal_type = ANY (ARRAY['breakfast'::TEXT, 'lunch'::TEXT, 'snacks'::TEXT, 'dinner'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.mess_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  is_present BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT mess_attendance_pkey PRIMARY KEY (id),
  CONSTRAINT mess_attendance_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT mess_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT mess_attendance_unique UNIQUE (student_id, date, meal_type),
  CONSTRAINT mess_attendance_meal_type_check CHECK (meal_type = ANY (ARRAY['breakfast'::TEXT, 'lunch'::TEXT, 'snacks'::TEXT, 'dinner'::TEXT]))
) TABLESPACE pg_default;

CREATE TABLE public.mess_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  student_id UUID NULL,
  staff_id UUID NULL,
  feedback_date DATE DEFAULT CURRENT_DATE,
  rating INTEGER NULL,
  comments TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT mess_feedback_pkey PRIMARY KEY (id),
  CONSTRAINT mess_feedback_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT mess_feedback_student_id_fkey FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT mess_feedback_staff_id_fkey FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  CONSTRAINT mess_feedback_rating_check CHECK (rating >= 1 AND rating <= 5)
) TABLESPACE pg_default;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Core tables
CREATE INDEX idx_members_user_id ON public.members(user_id);
CREATE INDEX idx_members_tenant_id ON public.members(tenant_id);
CREATE INDEX idx_members_status ON public.members(status);

-- Students
CREATE INDEX idx_students_tenant_id ON public.students(tenant_id);
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_students_section_id ON public.students(section_id);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_students_admission_no ON public.students(tenant_id, admission_no);

-- Staff
CREATE INDEX idx_staff_tenant_id ON public.staff(tenant_id);
CREATE INDEX idx_staff_employee_id ON public.staff(tenant_id, employee_id);
CREATE INDEX idx_staff_status ON public.staff(status);

-- Fee Payments
CREATE INDEX idx_fee_payments_tenant_id ON public.fee_payments(tenant_id);
CREATE INDEX idx_fee_payments_student_id ON public.fee_payments(student_id);
CREATE INDEX idx_fee_payments_payment_date ON public.fee_payments(payment_date);
CREATE INDEX idx_fee_payments_status ON public.fee_payments(status);

-- Library
CREATE INDEX idx_library_transactions_tenant_id ON public.library_transactions(tenant_id);
CREATE INDEX idx_library_transactions_student_id ON public.library_transactions(student_id);
CREATE INDEX idx_library_transactions_status ON public.library_transactions(status);

-- Attendance
CREATE INDEX idx_student_attendance_tenant_id ON public.student_attendance(tenant_id);
CREATE INDEX idx_student_attendance_student_id ON public.student_attendance(student_id);
CREATE INDEX idx_student_attendance_date ON public.student_attendance(date);

-- Exams
CREATE INDEX idx_exam_results_student_id ON public.exam_results(student_id);
CREATE INDEX idx_exam_results_exam_schedule_id ON public.exam_results(exam_schedule_id);

-- Transport
CREATE INDEX idx_student_transport_student_id ON public.student_transport(student_id);
CREATE INDEX idx_student_transport_route_id ON public.student_transport(route_id);

-- Hostel
CREATE INDEX idx_hostel_allocations_student_id ON public.hostel_allocations(student_id);
CREATE INDEX idx_hostel_allocations_status ON public.hostel_allocations(status);

-- Comments for documentation
COMMENT ON TABLE public.tenants IS 'Stores organization/school information in multi-tenant setup';
COMMENT ON TABLE public.roles IS 'Defines user roles: superadmin, admin, teacher, student, parent, etc.';
COMMENT ON TABLE public.members IS 'Maps users to tenants with specific roles';
COMMENT ON TABLE public.students IS 'Student master data with admission details';
COMMENT ON TABLE public.staff IS 'Staff/Employee master data';
COMMENT ON TABLE public.fee_payments IS 'Records all fee payment transactions';
COMMENT ON TABLE public.library_books IS 'Library book catalog';
COMMENT ON TABLE public.exams IS 'Examination schedules and configurations';
COMMENT ON TABLE public.timetables IS 'Class timetable/schedule management';
COMMENT ON TABLE public.hostels IS 'Hostel facility management';
COMMENT ON TABLE public.mess_menus IS 'Mess/cafeteria menu planning';
