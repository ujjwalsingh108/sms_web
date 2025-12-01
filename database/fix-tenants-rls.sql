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
