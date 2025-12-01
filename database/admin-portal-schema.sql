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
