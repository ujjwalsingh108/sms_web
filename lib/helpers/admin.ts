import { createClient } from "@/lib/supabase/server";
import { validateSubdomain as validateSubdomainUtil } from "@/lib/utils/validation";

/**
 * Check if current user is a superadmin (Nescomm employee)
 */
export async function isSuperAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: member } = await supabase
    .from("members")
    .select(
      `
      id,
      role:roles(name)
    `
    )
    .eq("user_id", user.id)
    .single();

  if (!member) return false;

  const typedMember = member as { role: { name: string } };
  return typedMember.role.name === "superadmin";
}

/**
 * Check if current user is a company admin (alias for backward compatibility)
 */
export async function isCompanyAdmin(): Promise<boolean> {
  return isSuperAdmin();
}

/**
 * Get school subdomain from headers
 */
export function getSchoolSubdomain(headers: Headers): string | null {
  return headers.get("x-school-subdomain");
}

/**
 * Get tenant by subdomain
 */
export async function getTenantBySubdomain(subdomain: string) {
  const supabase = await createClient();

  const { data: schoolInstance } = await supabase
    .from("school_instances")
    .select(
      `
      id,
      tenant_id,
      subdomain,
      status,
      setup_completed,
      tenant:tenants(*)
    `
    )
    .eq("subdomain", subdomain)
    .eq("status", "active")
    .single();

  return schoolInstance;
}

/**
 * Validate subdomain format
 * Re-exported from validation utility for backward compatibility
 */
export const validateSubdomain = validateSubdomainUtil;

/**
 * Log admin activity
 */
export async function logAdminActivity(params: {
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("admin_activity_logs").insert({
    admin_user_id: user.id,
    action: params.action,
    resource_type: params.resourceType || null,
    resource_id: params.resourceId || null,
    details: params.details || null,
    ip_address: params.ipAddress || null,
  } as never);
}
