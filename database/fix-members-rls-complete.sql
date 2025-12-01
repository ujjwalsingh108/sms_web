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
