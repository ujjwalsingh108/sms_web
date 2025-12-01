import { createClient } from "@/lib/supabase/server";

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
 */
export function validateSubdomain(subdomain: string): {
  valid: boolean;
  error?: string;
} {
  // Check length
  if (subdomain.length < 3) {
    return { valid: false, error: "Subdomain must be at least 3 characters" };
  }

  if (subdomain.length > 63) {
    return { valid: false, error: "Subdomain must be less than 63 characters" };
  }

  // Check format (alphanumeric and hyphens only, start and end with alphanumeric)
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!subdomainRegex.test(subdomain)) {
    return {
      valid: false,
      error:
        "Subdomain can only contain lowercase letters, numbers, and hyphens. Must start and end with a letter or number.",
    };
  }

  // Check reserved subdomains
  const reserved = [
    "www",
    "api",
    "admin",
    "app",
    "mail",
    "ftp",
    "localhost",
    "staging",
    "dev",
    "test",
  ];
  if (reserved.includes(subdomain)) {
    return { valid: false, error: "This subdomain is reserved" };
  }

  return { valid: true };
}

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
