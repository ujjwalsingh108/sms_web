-- =====================================================
-- RLS POLICIES FOR MEDICAL TABLES
-- =====================================================
-- This migration adds Row Level Security (RLS) policies
-- to medical_checkups and medical_records tables.

-- Prerequisites: RLS must be enabled on both tables
-- ALTER TABLE public.medical_checkups ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER: Get user's tenant_id from members table
-- =====================================================

-- =====================================================
-- MEDICAL CHECKUPS POLICIES
-- =====================================================

-- Policy: Users can view medical checkups within their tenant
CREATE POLICY "Users can view medical checkups in their tenant"
ON public.medical_checkups
FOR SELECT
TO public
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Medical staff can insert checkups within their tenant
CREATE POLICY "Medical staff can create medical checkups"
ON public.medical_checkups
FOR INSERT
TO public
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Medical staff can update checkups within their tenant
CREATE POLICY "Medical staff can update medical checkups"
ON public.medical_checkups
FOR UPDATE
TO public
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Admin can delete checkups (soft delete via is_deleted flag)
CREATE POLICY "Admin can delete medical checkups"
ON public.medical_checkups
FOR DELETE
TO public
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- =====================================================
-- MEDICAL RECORDS POLICIES
-- =====================================================

-- Policy: Users can view medical records within their tenant
CREATE POLICY "Users can view medical records in their tenant"
ON public.medical_records
FOR SELECT
TO public
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Medical staff can insert records within their tenant
CREATE POLICY "Medical staff can create medical records"
ON public.medical_records
FOR INSERT
TO public
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Medical staff can update records within their tenant
CREATE POLICY "Medical staff can update medical records"
ON public.medical_records
FOR UPDATE
TO public
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- Policy: Admin can delete records (soft delete via is_deleted flag)
CREATE POLICY "Admin can delete medical records"
ON public.medical_records
FOR DELETE
TO public
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.members
    WHERE user_id = auth.uid()
  )
);

-- =====================================================
-- NOTES
-- =====================================================
-- The `user_has_any_role()` function should be a custom function
-- that checks if the authenticated user has any of the specified roles.
--
-- Alternative: If using a helper function that takes tenant_id directly:
-- user_has_any_role(tenant_id, ARRAY['role1', 'role2', ...])
--
-- Ensure RLS is enabled on both tables before applying these policies:
-- ALTER TABLE public.medical_checkups ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
