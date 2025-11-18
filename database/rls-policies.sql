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
