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
