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
