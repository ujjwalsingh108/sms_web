"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteSchool(
  schoolId: string,
  schoolName: string,
  subdomain: string
) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Get school details before deletion for logging
    const { data: schoolData } = (await supabase
      .from("school_instances")
      .select("*")
      .eq("id", schoolId)
      .single()) as {
      data: { status: string; subscription_plan: string } | null;
    };

    // Delete the school instance
    const { error: deleteError } = await supabase
      .from("school_instances")
      .delete()
      .eq("id", schoolId);

    if (deleteError) throw deleteError;

    // Log the deletion activity
    await supabase.from("admin_activity_logs").insert({
      admin_user_id: user.id,
      action: "DELETE_SCHOOL",
      resource_type: "school_instance",
      resource_id: schoolId,
      details: {
        school_name: schoolName,
        subdomain: subdomain,
        previous_status: schoolData?.status,
        subscription_plan: schoolData?.subscription_plan,
        deleted_at: new Date().toISOString(),
      },
    } as never);

    revalidatePath("/admin/schools");
    return { success: true };
  } catch (error) {
    console.error("Error deleting school:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete school",
    };
  }
}

export async function updateSchool(
  schoolId: string,
  tenantId: string,
  formData: {
    school_name: string;
    status: string;
    subscription_plan: string;
    max_students: number;
    max_staff: number;
    tenant_name: string;
    tenant_phone: string;
    tenant_address: string;
  },
  originalData: {
    school_name: string;
    status: string;
    subscription_plan: string;
    max_students: number;
    max_staff: number;
    subdomain: string;
    tenant: {
      name: string;
      phone: string | null;
      address: string | null;
    };
  }
) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Track what changed for logging
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    if (formData.school_name !== originalData.school_name) {
      changes.school_name = {
        from: originalData.school_name,
        to: formData.school_name,
      };
    }
    if (formData.status !== originalData.status) {
      changes.status = { from: originalData.status, to: formData.status };
    }
    if (formData.subscription_plan !== originalData.subscription_plan) {
      changes.subscription_plan = {
        from: originalData.subscription_plan,
        to: formData.subscription_plan,
      };
    }
    if (formData.max_students !== originalData.max_students) {
      changes.max_students = {
        from: originalData.max_students,
        to: formData.max_students,
      };
    }
    if (formData.max_staff !== originalData.max_staff) {
      changes.max_staff = {
        from: originalData.max_staff,
        to: formData.max_staff,
      };
    }
    if (formData.tenant_name !== originalData.tenant.name) {
      changes.tenant_name = {
        from: originalData.tenant.name,
        to: formData.tenant_name,
      };
    }
    if (formData.tenant_phone !== (originalData.tenant.phone || "")) {
      changes.tenant_phone = {
        from: originalData.tenant.phone,
        to: formData.tenant_phone,
      };
    }
    if (formData.tenant_address !== (originalData.tenant.address || "")) {
      changes.tenant_address = {
        from: originalData.tenant.address,
        to: formData.tenant_address,
      };
    }

    // Update school instance
    const { error: schoolError } = await supabase
      .from("school_instances")
      .update({
        school_name: formData.school_name,
        status: formData.status,
        subscription_plan: formData.subscription_plan,
        max_students: formData.max_students,
        max_staff: formData.max_staff,
      } as never)
      .eq("id", schoolId);

    if (schoolError) throw schoolError;

    // Update tenant info
    const { error: tenantError } = await supabase
      .from("tenants")
      .update({
        name: formData.tenant_name,
        phone: formData.tenant_phone || null,
        address: formData.tenant_address || null,
      } as never)
      .eq("id", tenantId);

    if (tenantError) throw tenantError;

    // Log the update activity
    await supabase.from("admin_activity_logs").insert({
      admin_user_id: user.id,
      action: "UPDATE_SCHOOL",
      resource_type: "school_instance",
      resource_id: schoolId,
      details: {
        school_name: formData.school_name,
        subdomain: originalData.subdomain,
        changes,
        updated_at: new Date().toISOString(),
      },
    } as never);

    revalidatePath("/admin/schools");
    revalidatePath(`/admin/schools/${schoolId}/edit`);
    return { success: true };
  } catch (error) {
    console.error("Error updating school:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update school",
    };
  }
}
