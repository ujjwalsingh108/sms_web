import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getTenantBySubdomain } from "./admin";

/**
 * Get current user's tenant information
 * For school subdomains, automatically detects tenant from subdomain
 * For multi-tenant users, returns first approved membership
 */
export async function getCurrentTenant() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Check if we're on a school subdomain
  const headersList = await headers();
  const schoolSubdomain = headersList.get("x-school-subdomain");

  if (schoolSubdomain) {
    // We're on a school subdomain - get tenant from school_instances
    const schoolInstance = await getTenantBySubdomain(schoolSubdomain);

    if (!schoolInstance) {
      return null;
    }

    const typedSchoolInstance = schoolInstance as { tenant_id: string };

    // Verify user belongs to this tenant
    const { data: member } = await supabase
      .from("members")
      .select(
        `
        id,
        tenant_id,
        status,
        tenant:tenants(id, name, email, phone),
        role:roles(id, name, display_name)
      `
      )
      .eq("user_id", user.id)
      .eq("tenant_id", typedSchoolInstance.tenant_id)
      .eq("status", "approved")
      .single();

    if (!member) {
      return null;
    }

    return member as {
      id: string;
      tenant_id: string;
      status: string;
      tenant: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
      };
      role: {
        id: string;
        name: string;
        display_name: string | null;
      };
    };
  }

  // Not on a school subdomain - get user's first approved tenant
  const { data: members } = await supabase
    .from("members")
    .select(
      `
      id,
      tenant_id,
      status,
      tenant:tenants(id, name, email, phone),
      role:roles(id, name, display_name)
    `
    )
    .eq("user_id", user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (!members || members.length === 0) {
    return null;
  }

  // Return first approved tenant (primary tenant)
  // For multi-tenant support, store selected tenant in session
  return members[0] as {
    id: string;
    tenant_id: string;
    status: string;
    tenant: {
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
    };
    role: {
      id: string;
      name: string;
      display_name: string | null;
    };
  };
}

/**
 * Require tenant access - redirects if user has no tenant
 */
export async function requireTenant() {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    redirect("/auth/login");
  }

  return tenant;
}

/**
 * Check if user has specific role
 */
export async function userHasRole(roleName: string): Promise<boolean> {
  const tenant = await getCurrentTenant();
  return tenant?.role.name === roleName;
}

/**
 * Check if user has any of the specified roles
 */
export async function userHasAnyRole(roleNames: string[]): Promise<boolean> {
  const tenant = await getCurrentTenant();
  return tenant ? roleNames.includes(tenant.role.name) : false;
}

/**
 * Get all tenants user belongs to (for multi-tenant support)
 */
export async function getUserTenants() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: members } = await supabase
    .from("members")
    .select(
      `
      id,
      tenant_id,
      status,
      tenant:tenants(id, name, email),
      role:roles(id, name, display_name)
    `
    )
    .eq("user_id", user.id)
    .eq("status", "approved");

  return members || [];
}
