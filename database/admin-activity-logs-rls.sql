-- =====================================================
-- ADMIN ACTIVITY LOGS RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Superadmins can view all activity logs
CREATE POLICY "Superadmins can view all activity logs"
  ON public.admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    get_user_role() = 'superadmin'
  );

-- Policy 2: Users can view their own activity logs
CREATE POLICY "Users can view their own activity logs"
  ON public.admin_activity_logs FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid());

-- Policy 3: Superadmins can insert activity logs
CREATE POLICY "Superadmins can insert activity logs"
  ON public.admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role() = 'superadmin'
  );

-- Policy 4: Users can insert their own activity logs
CREATE POLICY "Users can insert their own activity logs"
  ON public.admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (admin_user_id = auth.uid());

-- Policy 5: Superadmins can delete activity logs
CREATE POLICY "Superadmins can delete activity logs"
  ON public.admin_activity_logs FOR DELETE
  TO authenticated
  USING (
    get_user_role() = 'superadmin'
  );

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'admin_activity_logs'
ORDER BY policyname;

COMMENT ON TABLE public.admin_activity_logs IS 
'Activity logs for superadmin actions. Tracks all important operations performed by administrators.';
