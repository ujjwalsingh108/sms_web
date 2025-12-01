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
