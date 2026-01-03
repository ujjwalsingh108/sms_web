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
-- LIBRARY REPORTS SCHEMA
-- =====================================================
-- This schema supports generating and managing library reports
-- with various report types and configurations

-- Create library_reports table
CREATE TABLE IF NOT EXISTS public.library_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  description TEXT NULL,
  date_from DATE NULL,
  date_to DATE NULL,
  filters JSONB NULL DEFAULT '{}'::jsonb,
  generated_by UUID NULL,
  generated_at TIMESTAMP WITH TIME ZONE NULL,
  file_url TEXT NULL,
  status TEXT NULL DEFAULT 'draft'::TEXT,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
  is_deleted BOOLEAN NULL DEFAULT false,
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  deleted_by UUID NULL,
  CONSTRAINT library_reports_pkey PRIMARY KEY (id),
  CONSTRAINT library_reports_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT library_reports_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT library_reports_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT library_reports_status_check CHECK (
    status = ANY (ARRAY[
      'draft'::TEXT,
      'generating'::TEXT,
      'completed'::TEXT,
      'failed'::TEXT
    ])
  ),
  CONSTRAINT library_reports_type_check CHECK (
    report_type = ANY (ARRAY[
      'books_inventory'::TEXT,
      'issued_books'::TEXT,
      'overdue_books'::TEXT,
      'returned_books'::TEXT,
      'student_history'::TEXT,
      'popular_books'::TEXT,
      'fine_collection'::TEXT,
      'monthly_summary'::TEXT,
      'annual_summary'::TEXT
    ])
  )
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_library_reports_tenant_id 
  ON public.library_reports USING btree (tenant_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_report_type 
  ON public.library_reports USING btree (report_type) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_status 
  ON public.library_reports USING btree (status) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_generated_at 
  ON public.library_reports USING btree (generated_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_library_reports_is_deleted 
  ON public.library_reports USING btree (is_deleted) TABLESPACE pg_default
  WHERE (is_deleted = false);

-- Enable RLS
ALTER TABLE public.library_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view library reports in their tenant"
  ON public.library_reports FOR SELECT
  USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Librarians can manage library reports"
  ON public.library_reports FOR ALL
  USING (
    tenant_id = public.user_tenant_id() AND
    (
      public.user_has_role('superadmin') OR
      public.user_has_role('admin') OR
      public.user_has_role('librarian')
    )
  );

-- Add comments
COMMENT ON TABLE public.library_reports IS 'Stores library report configurations and generated reports';
COMMENT ON COLUMN public.library_reports.report_type IS 'Type of report: books_inventory, issued_books, overdue_books, returned_books, student_history, popular_books, fine_collection, monthly_summary, annual_summary';
COMMENT ON COLUMN public.library_reports.filters IS 'JSON object containing report-specific filters';
COMMENT ON COLUMN public.library_reports.status IS 'Report status: draft, generating, completed, failed';


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
-- NESCOMM ADMIN PORTAL - ADDITIONAL SCHEMA
-- =====================================================

-- Table to track school instances with subdomains
CREATE TABLE IF NOT EXISTS public.school_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  subdomain TEXT NOT NULL,
  school_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_user_id UUID NULL,
  status TEXT DEFAULT 'pending'::TEXT,
  setup_completed BOOLEAN DEFAULT false,
  subscription_plan TEXT DEFAULT 'trial'::TEXT,
  subscription_start DATE NULL,
  subscription_end DATE NULL,
  max_students INTEGER DEFAULT 100,
  max_staff INTEGER DEFAULT 20,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT school_instances_pkey PRIMARY KEY (id),
  CONSTRAINT school_instances_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  CONSTRAINT school_instances_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT school_instances_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT school_instances_subdomain_unique UNIQUE (subdomain),
  CONSTRAINT school_instances_tenant_id_unique UNIQUE (tenant_id),
  CONSTRAINT school_instances_status_check CHECK (status = ANY (ARRAY['pending'::TEXT, 'active'::TEXT, 'suspended'::TEXT, 'cancelled'::TEXT])),
  CONSTRAINT school_instances_subscription_plan_check CHECK (subscription_plan = ANY (ARRAY['trial'::TEXT, 'basic'::TEXT, 'standard'::TEXT, 'premium'::TEXT]))
) TABLESPACE pg_default;

-- Table to track company admin activities
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NULL,
  resource_id UUID NULL,
  details JSONB NULL,
  ip_address TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT admin_activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT admin_activity_logs_admin_user_id_fkey FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Note: Using existing 'superadmin' role for Nescomm employees
-- Note: Using existing 'admin' role for school administrators
-- These roles should already exist in your roles table

-- Create Nescomm parent tenant if not exists
INSERT INTO public.tenants (name, email)
VALUES ('Nescomm', 'admin@smartschoolerp.xyz')
ON CONFLICT (email) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_school_instances_subdomain ON public.school_instances(subdomain);
CREATE INDEX IF NOT EXISTS idx_school_instances_tenant_id ON public.school_instances(tenant_id);
CREATE INDEX IF NOT EXISTS idx_school_instances_status ON public.school_instances(status);
CREATE INDEX IF NOT EXISTS idx_school_instances_created_by ON public.school_instances(created_by);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON public.admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at);

-- RLS Policies for school_instances
ALTER TABLE public.school_instances ENABLE ROW LEVEL SECURITY;

-- Superadmins can see all school instances
CREATE POLICY "Superadmins can view all schools"
  ON public.school_instances FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      INNER JOIN public.roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Superadmins can create school instances
CREATE POLICY "Superadmins can create schools"
  ON public.school_instances FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members m
      INNER JOIN public.roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Superadmins can update school instances
CREATE POLICY "Superadmins can update schools"
  ON public.school_instances FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      INNER JOIN public.roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Comments
COMMENT ON TABLE public.school_instances IS 'Tracks school instances created by superadmins. Each school gets its own subdomain (e.g., dps-ranchi.smartschoolerp.xyz).';
COMMENT ON TABLE public.admin_activity_logs IS 'Audit log for superadmin activities';
COMMENT ON COLUMN public.school_instances.subdomain IS 'Unique subdomain for the school (e.g., dps-ranchi). Full URL: {subdomain}.smartschoolerp.xyz';


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

-- =====================================================
-- FIX AUTO-CREATE USER TRIGGER FUNCTION
-- =====================================================

-- Drop and recreate the function with proper logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_tenant_id uuid;
  user_role_name text;
  role_id uuid;
BEGIN
  -- Get the role from user metadata (set during signup)
  user_role_name := COALESCE(NEW.raw_user_meta_data->>'role', 'admin');

  -- Get the role ID
  SELECT id INTO role_id
  FROM public.roles
  WHERE name = user_role_name
  LIMIT 1;

  -- If role doesn't exist, use admin as default
  IF role_id IS NULL THEN
    SELECT id INTO role_id
    FROM public.roles
    WHERE name = 'admin'
    LIMIT 1;
  END IF;

  -- ONLY auto-create tenant for superadmins (Nescomm employees)
  -- For school admins, the tenant is already created by the create school form
  IF user_role_name = 'superadmin' THEN
    -- Create a default tenant for the superadmin
    INSERT INTO public.tenants (name, email, created_by)
    VALUES (
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) || '''s Organization',
      NEW.email,
      NEW.id
    )
    RETURNING id INTO new_tenant_id;

    -- Create member record for superadmin
    INSERT INTO public.members (user_id, tenant_id, role_id, status)
    VALUES (
      NEW.id,
      new_tenant_id,
      role_id,
      'approved'  -- Superadmins are auto-approved
    );
  END IF;
  
  -- For non-superadmin users (school admins, teachers, etc.),
  -- the member record will be created by the application logic
  -- So we just return without creating anything

  RETURN NEW;
END;
$$;

-- Ensure the trigger is properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 
'Auto-creates tenant and member for superadmin users only. School admins are handled by application logic.';

-- =====================================================
-- FIX MEMBERS TABLE RLS POLICIES - NO RECURSION
-- =====================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can insert members" ON public.members;
DROP POLICY IF EXISTS "Admins can update members" ON public.members;
DROP POLICY IF EXISTS "Users can view members in their tenant" ON public.members;
DROP POLICY IF EXISTS "Admins can delete members" ON public.members;
DROP POLICY IF EXISTS "Superadmins can insert members" ON public.members;
DROP POLICY IF EXISTS "Superadmins can view all members" ON public.members;
DROP POLICY IF EXISTS "Superadmins can update members" ON public.members;
DROP POLICY IF EXISTS "Superadmins can delete members" ON public.members;
DROP POLICY IF EXISTS "Users can view their own member record" ON public.members;
DROP POLICY IF EXISTS "Admins can insert members to their tenant" ON public.members;
DROP POLICY IF EXISTS "Admins can update members in their tenant" ON public.members;
DROP POLICY IF EXISTS "Admins can delete members in their tenant" ON public.members;
DROP POLICY IF EXISTS "Allow initial member creation" ON public.members;

-- Temporarily disable RLS to allow setup
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;

-- Create a helper function that won't cause recursion
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT r.name
  FROM public.members m
  INNER JOIN public.roles r ON m.role_id = r.id
  WHERE m.user_id = auth.uid()
  AND m.status = 'approved'
  LIMIT 1;
$$;

-- Create a helper function to get user's tenant
CREATE OR REPLACE FUNCTION public.get_user_tenant()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT tenant_id
  FROM public.members
  WHERE user_id = auth.uid()
  AND status = 'approved'
  LIMIT 1;
$$;

-- Re-enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own member record
CREATE POLICY "Users can view their own member record"
  ON public.members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: Users can view members in same tenant (using helper function - no recursion)
CREATE POLICY "Users can view members in their tenant"
  ON public.members FOR SELECT
  TO authenticated
  USING (
    tenant_id = get_user_tenant()
    OR get_user_role() = 'superadmin'
  );

-- Policy 3: Allow users to insert their first member record (account creation)
CREATE POLICY "Allow initial member creation"
  ON public.members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.members
      WHERE user_id = auth.uid()
    )
  );

-- Policy 4: Superadmins can insert any member
CREATE POLICY "Superadmins can insert members"
  ON public.members FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role() = 'superadmin'
  );

-- Policy 5: Admins can insert members to their tenant
CREATE POLICY "Admins can insert members to their tenant"
  ON public.members FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role() = 'admin'
    AND tenant_id = get_user_tenant()
  );

-- Policy 6: Superadmins can update any member
CREATE POLICY "Superadmins can update members"
  ON public.members FOR UPDATE
  TO authenticated
  USING (get_user_role() = 'superadmin');

-- Policy 7: Admins can update members in their tenant
CREATE POLICY "Admins can update members in their tenant"
  ON public.members FOR UPDATE
  TO authenticated
  USING (
    get_user_role() = 'admin'
    AND tenant_id = get_user_tenant()
  );

-- Policy 8: Superadmins can delete any member
CREATE POLICY "Superadmins can delete members"
  ON public.members FOR DELETE
  TO authenticated
  USING (get_user_role() = 'superadmin');

-- Policy 9: Admins can delete members in their tenant
CREATE POLICY "Admins can delete members in their tenant"
  ON public.members FOR DELETE
  TO authenticated
  USING (
    get_user_role() = 'admin'
    AND tenant_id = get_user_tenant()
  );

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'members'
ORDER BY policyname;

COMMENT ON TABLE public.members IS 
'Members table with RLS policies. Superadmins can manage all members. Admins can manage members in their tenant.';

-- =====================================================
-- TENANTS TABLE RLS POLICIES FIX
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Superadmins can insert tenants" ON public.tenants;
DROP POLICY IF EXISTS "Superadmins can view all tenants" ON public.tenants;
DROP POLICY IF EXISTS "Superadmins can update tenants" ON public.tenants;
DROP POLICY IF EXISTS "Members can view their tenant" ON public.tenants;

-- Enable RLS (if not already enabled)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Policy: Superadmins can view all tenants
CREATE POLICY "Superadmins can view all tenants"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      INNER JOIN public.roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Policy: Superadmins can insert tenants
CREATE POLICY "Superadmins can insert tenants"
  ON public.tenants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.members m
      INNER JOIN public.roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Policy: Superadmins can update tenants
CREATE POLICY "Superadmins can update tenants"
  ON public.tenants FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      INNER JOIN public.roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Policy: Members can view their own tenant
CREATE POLICY "Members can view their tenant"
  ON public.tenants FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT tenant_id FROM public.members
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Superadmins can delete tenants
CREATE POLICY "Superadmins can delete tenants"
  ON public.tenants FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      INNER JOIN public.roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Verify policies are active
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'tenants'
ORDER BY policyname;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('school_created', 'school_updated', 'school_deleted', 'activity', 'system', 'info')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Superadmins can view all notifications
CREATE POLICY "Superadmins can view all notifications"
  ON notifications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      JOIN roles r ON m.role_id = r.id
      WHERE m.user_id = auth.uid()
      AND r.name = 'superadmin'
    )
  );

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert notifications
CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to create notification for all superadmins
CREATE OR REPLACE FUNCTION notify_superadmins(
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT,
  notification_action_url TEXT DEFAULT NULL,
  notification_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, action_url, metadata)
  SELECT m.user_id, notification_title, notification_message, notification_type, notification_action_url, notification_metadata
  FROM members m
  JOIN roles r ON m.role_id = r.id
  WHERE r.name = 'superadmin';
END;
$$;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET read = true
  WHERE user_id = target_user_id AND read = false;
END;
$$;

-- Trigger to create notifications when school is created
CREATE OR REPLACE FUNCTION notify_school_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM notify_superadmins(
    'New School Created',
    'A new school "' || NEW.school_name || '" has been added to the platform.',
    'school_created',
    '/admin/schools',
    jsonb_build_object('school_id', NEW.id, 'subdomain', NEW.subdomain)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_school_created
AFTER INSERT ON school_instances
FOR EACH ROW
EXECUTE FUNCTION notify_school_created();

-- Trigger to create notifications when school is updated
CREATE OR REPLACE FUNCTION notify_school_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify if significant fields changed
  IF (OLD.status IS DISTINCT FROM NEW.status) OR 
     (OLD.subscription_plan IS DISTINCT FROM NEW.subscription_plan) OR
     (OLD.school_name IS DISTINCT FROM NEW.school_name) THEN
    PERFORM notify_superadmins(
      'School Updated',
      'School "' || NEW.school_name || '" has been updated.',
      'school_updated',
      '/admin/schools',
      jsonb_build_object('school_id', NEW.id, 'subdomain', NEW.subdomain)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_school_updated
AFTER UPDATE ON school_instances
FOR EACH ROW
EXECUTE FUNCTION notify_school_updated();

-- Trigger to create notifications when school is deleted
CREATE OR REPLACE FUNCTION notify_school_deleted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM notify_superadmins(
    'School Deleted',
    'School "' || OLD.school_name || '" has been removed from the platform.',
    'school_deleted',
    '/admin/schools',
    jsonb_build_object('school_name', OLD.school_name, 'subdomain', OLD.subdomain, 'status', OLD.status)
  );
  RETURN OLD;
END;
$$;

CREATE TRIGGER trigger_notify_school_deleted
BEFORE DELETE ON school_instances
FOR EACH ROW
EXECUTE FUNCTION notify_school_deleted();

-- Trigger to create notifications for important activity logs
CREATE OR REPLACE FUNCTION notify_important_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify for certain critical actions
  IF NEW.action IN ('CREATE_SCHOOL', 'DELETE_SCHOOL', 'UPDATE_SCHOOL') THEN
    -- Don't create duplicate notifications if school triggers already fired
    -- This is a backup in case triggers fail
    RETURN NEW;
  END IF;
  
  -- Notify for other important activities
  IF NEW.action IN ('SYSTEM_ERROR', 'SECURITY_ALERT', 'DATA_BREACH') THEN
    PERFORM notify_superadmins(
      'Important Activity: ' || NEW.action,
      'An important activity was logged. Please review.',
      'activity',
      '/admin/activity',
      jsonb_build_object('activity_id', NEW.id, 'action', NEW.action)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_important_activity
AFTER INSERT ON admin_activity_logs
FOR EACH ROW
EXECUTE FUNCTION notify_important_activity();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Complete School ERP System
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_checkups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_feedback ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get user's tenant_id from members table
CREATE OR REPLACE FUNCTION user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.members
  WHERE user_id = auth.uid()
  AND status = 'approved'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user has specific role
CREATE OR REPLACE FUNCTION user_has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.roles r ON m.role_id = r.id
    WHERE m.user_id = auth.uid()
    AND m.status = 'approved'
    AND r.name = role_name
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user has any of the specified roles
CREATE OR REPLACE FUNCTION user_has_any_role(role_names TEXT[])
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.roles r ON m.role_id = r.id
    WHERE m.user_id = auth.uid()
    AND m.status = 'approved'
    AND r.name = ANY(role_names)
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- ACADEMIC STRUCTURE POLICIES
-- =====================================================

-- Academic Years
CREATE POLICY "Users can view academic years in their tenant"
  ON public.academic_years FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can insert academic years"
  ON public.academic_years FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Admins can update academic years"
  ON public.academic_years FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Superadmins can delete academic years"
  ON public.academic_years FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- Classes
CREATE POLICY "Users can view classes in their tenant"
  ON public.classes FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can insert classes"
  ON public.classes FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Admins can update classes"
  ON public.classes FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Superadmins can delete classes"
  ON public.classes FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- Sections
CREATE POLICY "Users can view sections in their tenant"
  ON public.sections FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage sections"
  ON public.sections FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Subjects
CREATE POLICY "Users can view subjects in their tenant"
  ON public.subjects FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage subjects"
  ON public.subjects FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Class Subjects
CREATE POLICY "Users can view class subjects in their tenant"
  ON public.class_subjects FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage class subjects"
  ON public.class_subjects FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- STAFF MANAGEMENT POLICIES
-- =====================================================

-- Staff
CREATE POLICY "Users can view staff in their tenant"
  ON public.staff FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can insert staff"
  ON public.staff FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Admins can update staff"
  ON public.staff FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Superadmins can delete staff"
  ON public.staff FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- Staff Attendance
CREATE POLICY "Users can view staff attendance in their tenant"
  ON public.staff_attendance FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage staff attendance"
  ON public.staff_attendance FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- ADMISSION MODULE POLICIES
-- =====================================================

-- Students
CREATE POLICY "Users can view students in their tenant"
  ON public.students FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can insert students"
  ON public.students FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Admins can update students"
  ON public.students FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Superadmins can delete students"
  ON public.students FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- Guardians
CREATE POLICY "Users can view guardians in their tenant"
  ON public.guardians FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage guardians"
  ON public.guardians FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Admission Applications
CREATE POLICY "Users can view admission applications in their tenant"
  ON public.admission_applications FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage admission applications"
  ON public.admission_applications FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- TRANSPORT MODULE POLICIES
-- =====================================================

-- Vehicles
CREATE POLICY "Users can view vehicles in their tenant"
  ON public.vehicles FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage vehicles"
  ON public.vehicles FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'driver'])
  );

-- Routes
CREATE POLICY "Users can view routes in their tenant"
  ON public.routes FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage routes"
  ON public.routes FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Route Stops
CREATE POLICY "Users can view route stops in their tenant"
  ON public.route_stops FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage route stops"
  ON public.route_stops FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Vehicle Assignments
CREATE POLICY "Users can view vehicle assignments in their tenant"
  ON public.vehicle_assignments FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage vehicle assignments"
  ON public.vehicle_assignments FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Student Transport
CREATE POLICY "Users can view student transport in their tenant"
  ON public.student_transport FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage student transport"
  ON public.student_transport FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- FEE MANAGEMENT POLICIES
-- =====================================================

-- Fee Structures
CREATE POLICY "Users can view fee structures in their tenant"
  ON public.fee_structures FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage fee structures"
  ON public.fee_structures FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'accountant'])
  );

-- Fee Payments
CREATE POLICY "Users can view fee payments in their tenant"
  ON public.fee_payments FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Accountants can insert fee payments"
  ON public.fee_payments FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'accountant'])
  );

CREATE POLICY "Accountants can update fee payments"
  ON public.fee_payments FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'accountant'])
  );

CREATE POLICY "Superadmins can delete fee payments"
  ON public.fee_payments FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- Fee Discounts
CREATE POLICY "Users can view fee discounts in their tenant"
  ON public.fee_discounts FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage fee discounts"
  ON public.fee_discounts FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'accountant'])
  );

-- =====================================================
-- LIBRARY MODULE POLICIES
-- =====================================================

-- Library Books
CREATE POLICY "Users can view library books in their tenant"
  ON public.library_books FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Librarians can manage library books"
  ON public.library_books FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'librarian'])
  );

-- Library Transactions
CREATE POLICY "Users can view library transactions in their tenant"
  ON public.library_transactions FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Librarians can manage library transactions"
  ON public.library_transactions FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'librarian'])
  );

-- =====================================================
-- EXAMINATION MODULE POLICIES
-- =====================================================

-- Exam Types
CREATE POLICY "Users can view exam types in their tenant"
  ON public.exam_types FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage exam types"
  ON public.exam_types FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Exams
CREATE POLICY "Users can view exams in their tenant"
  ON public.exams FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage exams"
  ON public.exams FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Exam Schedules
CREATE POLICY "Users can view exam schedules in their tenant"
  ON public.exam_schedules FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage exam schedules"
  ON public.exam_schedules FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Exam Results
CREATE POLICY "Users can view exam results in their tenant"
  ON public.exam_results FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Teachers can insert exam results"
  ON public.exam_results FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'teacher'])
  );

CREATE POLICY "Teachers can update exam results"
  ON public.exam_results FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'teacher'])
  );

CREATE POLICY "Admins can delete exam results"
  ON public.exam_results FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- TIMETABLE MODULE POLICIES
-- =====================================================

-- Timetables
CREATE POLICY "Users can view timetables in their tenant"
  ON public.timetables FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage timetables"
  ON public.timetables FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- ATTENDANCE MODULE POLICIES
-- =====================================================

-- Student Attendance
CREATE POLICY "Users can view student attendance in their tenant"
  ON public.student_attendance FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Teachers can insert student attendance"
  ON public.student_attendance FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'teacher'])
  );

CREATE POLICY "Teachers can update student attendance"
  ON public.student_attendance FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'teacher'])
  );

CREATE POLICY "Admins can delete student attendance"
  ON public.student_attendance FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- INVENTORY & PURCHASE POLICIES
-- =====================================================

-- Inventory Categories
CREATE POLICY "Users can view inventory categories in their tenant"
  ON public.inventory_categories FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage inventory categories"
  ON public.inventory_categories FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Inventory Items
CREATE POLICY "Users can view inventory items in their tenant"
  ON public.inventory_items FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage inventory items"
  ON public.inventory_items FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Suppliers
CREATE POLICY "Users can view suppliers in their tenant"
  ON public.suppliers FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage suppliers"
  ON public.suppliers FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Purchase Orders
CREATE POLICY "Users can view purchase orders in their tenant"
  ON public.purchase_orders FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage purchase orders"
  ON public.purchase_orders FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Purchase Order Items
CREATE POLICY "Users can view purchase order items in their tenant"
  ON public.purchase_order_items FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage purchase order items"
  ON public.purchase_order_items FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- ACCOUNTS MODULE POLICIES
-- =====================================================

-- Account Heads
CREATE POLICY "Users can view account heads in their tenant"
  ON public.account_heads FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage account heads"
  ON public.account_heads FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'accountant'])
  );

-- Transactions
CREATE POLICY "Users can view transactions in their tenant"
  ON public.transactions FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Accountants can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'accountant'])
  );

CREATE POLICY "Accountants can update transactions"
  ON public.transactions FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'accountant'])
  );

CREATE POLICY "Admins can delete transactions"
  ON public.transactions FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- RECEPTION/VISITOR POLICIES
-- =====================================================

-- Visitors
CREATE POLICY "Users can view visitors in their tenant"
  ON public.visitors FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Reception staff can manage visitors"
  ON public.visitors FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Phone Logs
CREATE POLICY "Users can view phone logs in their tenant"
  ON public.phone_logs FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Reception staff can manage phone logs"
  ON public.phone_logs FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- INFIRMARY MODULE POLICIES
-- =====================================================

-- Medical Records
CREATE POLICY "Users can view medical records in their tenant"
  ON public.medical_records FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Medical staff can manage medical records"
  ON public.medical_records FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Medical Checkups
CREATE POLICY "Users can view medical checkups in their tenant"
  ON public.medical_checkups FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Medical staff can manage medical checkups"
  ON public.medical_checkups FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- SECURITY MODULE POLICIES
-- =====================================================

-- Security Incidents
CREATE POLICY "Users can view security incidents in their tenant"
  ON public.security_incidents FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Security staff can manage security incidents"
  ON public.security_incidents FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Gate Passes
CREATE POLICY "Users can view gate passes in their tenant"
  ON public.gate_passes FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Authorized staff can manage gate passes"
  ON public.gate_passes FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin', 'teacher'])
  );

-- =====================================================
-- HOSTEL MODULE POLICIES
-- =====================================================

-- Hostels
CREATE POLICY "Users can view hostels in their tenant"
  ON public.hostels FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage hostels"
  ON public.hostels FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Hostel Rooms
CREATE POLICY "Users can view hostel rooms in their tenant"
  ON public.hostel_rooms FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage hostel rooms"
  ON public.hostel_rooms FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Hostel Allocations
CREATE POLICY "Users can view hostel allocations in their tenant"
  ON public.hostel_allocations FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage hostel allocations"
  ON public.hostel_allocations FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- MESS MODULE POLICIES
-- =====================================================

-- Mess Menus
CREATE POLICY "Users can view mess menus in their tenant"
  ON public.mess_menus FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Admins can manage mess menus"
  ON public.mess_menus FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Mess Attendance
CREATE POLICY "Users can view mess attendance in their tenant"
  ON public.mess_attendance FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "Mess staff can manage mess attendance"
  ON public.mess_attendance FOR ALL
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Mess Feedback
CREATE POLICY "Users can view mess feedback in their tenant"
  ON public.mess_feedback FOR SELECT
  USING (tenant_id = user_tenant_id());

CREATE POLICY "All authenticated users can insert mess feedback"
  ON public.mess_feedback FOR INSERT
  WITH CHECK (tenant_id = user_tenant_id());

CREATE POLICY "Admins can update mess feedback"
  ON public.mess_feedback FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

CREATE POLICY "Admins can delete mess feedback"
  ON public.mess_feedback FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on helper functions
GRANT EXECUTE ON FUNCTION user_tenant_id() TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_any_role(TEXT[]) TO authenticated;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Core Tables: Tenants, Roles, Members
-- =====================================================

-- Enable RLS on core tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TENANTS TABLE POLICIES
-- =====================================================

-- Users can view their own tenant
CREATE POLICY "Users can view their own tenant"
  ON public.tenants FOR SELECT
  USING (id = user_tenant_id());

-- Superadmins can insert new tenants
CREATE POLICY "Superadmins can insert tenants"
  ON public.tenants FOR INSERT
  WITH CHECK (user_has_role('superadmin'));

-- Superadmins can update their own tenant
CREATE POLICY "Superadmins can update their tenant"
  ON public.tenants FOR UPDATE
  USING (
    id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- Superadmins can delete their own tenant (with caution)
CREATE POLICY "Superadmins can delete their tenant"
  ON public.tenants FOR DELETE
  USING (
    id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- =====================================================
-- ROLES TABLE POLICIES
-- =====================================================

-- All authenticated users can view roles
CREATE POLICY "All users can view roles"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

-- Only superadmins can insert roles
CREATE POLICY "Superadmins can insert roles"
  ON public.roles FOR INSERT
  WITH CHECK (user_has_role('superadmin'));

-- Only superadmins can update roles
CREATE POLICY "Superadmins can update roles"
  ON public.roles FOR UPDATE
  USING (user_has_role('superadmin'));

-- Only superadmins can delete roles
CREATE POLICY "Superadmins can delete roles"
  ON public.roles FOR DELETE
  USING (user_has_role('superadmin'));

-- =====================================================
-- MEMBERS TABLE POLICIES
-- =====================================================

-- Users can view members in their tenant
CREATE POLICY "Users can view members in their tenant"
  ON public.members FOR SELECT
  USING (tenant_id = user_tenant_id());

-- Superadmins and admins can insert members
CREATE POLICY "Admins can insert members"
  ON public.members FOR INSERT
  WITH CHECK (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Superadmins and admins can update members
CREATE POLICY "Admins can update members"
  ON public.members FOR UPDATE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_any_role(ARRAY['superadmin', 'admin'])
  );

-- Only superadmins can delete members
CREATE POLICY "Superadmins can delete members"
  ON public.members FOR DELETE
  USING (
    tenant_id = user_tenant_id() AND
    user_has_role('superadmin')
  );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON POLICY "Users can view their own tenant" ON public.tenants IS 
  'Users can only view the tenant they belong to based on their membership';

COMMENT ON POLICY "All users can view roles" ON public.roles IS 
  'All authenticated users can view available roles for UI purposes';

COMMENT ON POLICY "Users can view members in their tenant" ON public.members IS 
  'Users can view all members within their organization/tenant';

  -- Row Level Security Policies for School ERP
-- Apply these policies to secure your database tables

-- ============================================
-- HELPER FUNCTION
-- ============================================

-- Function to check if user belongs to a tenant
CREATE OR REPLACE FUNCTION public.user_tenant_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT tenant_id FROM public.members
  WHERE user_id = auth.uid()
  AND status = 'approved'
  LIMIT 1;
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members m
    JOIN public.roles r ON m.role_id = r.id
    WHERE m.user_id = auth.uid()
    AND m.status = 'approved'
    AND r.name = role_name
  );
$$;

-- ============================================
-- STUDENTS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view students from their tenant"
ON public.students
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can insert students"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

CREATE POLICY "Admins can update students"
ON public.students
FOR UPDATE
TO authenticated
USING (tenant_id = public.user_tenant_id())
WITH CHECK (
  public.user_has_role('superadmin')
  OR public.user_has_role('admin')
);

CREATE POLICY "Admins can delete students"
ON public.students
FOR DELETE
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- STAFF TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view staff from their tenant"
ON public.staff
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can manage staff"
ON public.staff
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- CLASSES TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view classes"
ON public.classes
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can manage classes"
ON public.classes
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- SECTIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view sections"
ON public.sections
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can manage sections"
ON public.sections
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- SUBJECTS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can manage subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- FEE STRUCTURES TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view fee structures"
ON public.fee_structures
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins and accountants can manage fee structures"
ON public.fee_structures
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('accountant')
  )
);

-- ============================================
-- FEE PAYMENTS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view fee payments from their tenant"
ON public.fee_payments
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Authorized users can create fee payments"
ON public.fee_payments
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('accountant')
  )
);

CREATE POLICY "Authorized users can update fee payments"
ON public.fee_payments
FOR UPDATE
TO authenticated
USING (tenant_id = public.user_tenant_id())
WITH CHECK (
  public.user_has_role('superadmin')
  OR public.user_has_role('admin')
  OR public.user_has_role('accountant')
);

-- ============================================
-- LIBRARY BOOKS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view library books"
ON public.library_books
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Librarians can manage books"
ON public.library_books
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('librarian')
  )
);

-- ============================================
-- LIBRARY TRANSACTIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view library transactions"
ON public.library_transactions
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Librarians can manage transactions"
ON public.library_transactions
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('librarian')
  )
);

-- ============================================
-- EXAMS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view exams"
ON public.exams
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Teachers can manage exams"
ON public.exams
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('teacher')
  )
);

-- ============================================
-- EXAM RESULTS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view exam results"
ON public.exam_results
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Teachers can manage exam results"
ON public.exam_results
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('teacher')
  )
);

-- ============================================
-- TRANSPORT ROUTES TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view transport routes"
ON public.transport_routes
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can manage transport routes"
ON public.transport_routes
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- ATTENDANCE TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Teachers can manage attendance"
ON public.attendance
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('teacher')
  )
);

-- ============================================
-- ACCOUNTS TABLE POLICIES
-- ============================================

CREATE POLICY "Authorized users can view accounts"
ON public.accounts
FOR SELECT
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('accountant')
  )
);

CREATE POLICY "Accountants can manage accounts"
ON public.accounts
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
    OR public.user_has_role('accountant')
  )
);

-- ============================================
-- VISITORS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view visitors"
ON public.visitors
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can manage visitors"
ON public.visitors
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- MEDICAL RECORDS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view medical records"
ON public.medical_records
FOR SELECT
TO authenticated
USING (tenant_id = public.user_tenant_id());

CREATE POLICY "Admins can manage medical records"
ON public.medical_records
FOR ALL
TO authenticated
USING (
  tenant_id = public.user_tenant_id()
  AND (
    public.user_has_role('superadmin')
    OR public.user_has_role('admin')
  )
);

-- ============================================
-- Apply similar patterns for remaining tables:
-- - vehicles
-- - transport_allocations
-- - inventory_items
-- - purchase_orders
-- - hostel_buildings
-- - hostel_rooms
-- - hostel_allocations
-- - timetable
-- ============================================

-- Note: Adjust policies based on your specific security requirements






