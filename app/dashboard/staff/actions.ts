"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { revalidatePath } from "next/cache";
import { getCurrentTenant } from "@/lib/helpers/tenant";

export type Staff = {
  id: string;
  tenant_id: string;
  user_id: string | null;
  employee_id: string;
  salutation?: "Mr." | "Mrs." | "Miss" | "Ms." | "Dr." | "Prof." | null;
  first_name: string;
  last_name: string;
  email: string;
  password?: string | null; // Password hash - should never be included in SELECT queries
  phone: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  address: string | null;
  qualification: string | null;
  department: string | null;
  date_of_joining: string | null;
  salary: number | null;
  status: "active" | "inactive" | "on_leave";
  staff_type:
    | "teacher"
    | "principal"
    | "vice_principal"
    | "clerk"
    | "librarian"
    | "driver"
    | "security"
    | "nurse"
    | "accountant"
    | "lab_assistant"
    | "sports_coach"
    | "counselor"
    | "other"
    | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type StaffAttendance = {
  id: string;
  tenant_id: string;
  staff_id: string;
  date: string;
  status: "present" | "absent" | "half_day" | "on_leave";
  check_in: string | null;
  check_out: string | null;
  notes: string | null;
  created_at: string;
};

// Get all staff with optional filters
export async function getStaff(filters?: {
  department?: string;
  status?: string;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("staff")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.department && filters.department !== "all") {
    query = query.eq("department", filters.department);
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,employee_id.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching staff:", error);
    throw new Error("Failed to fetch staff");
  }

  return data as Staff[];
}

// Get staff by ID
export async function getStaffById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching staff:", error);
    throw new Error("Failed to fetch staff");
  }

  return data as Staff;
}

// Create new staff member
export async function createStaff(formData: FormData) {
  const supabase = await createClient();
  const supabaseAdmin = createServiceRoleClient();

  // Get current tenant - CRITICAL: Required for tenant_id
  const tenant = await getCurrentTenant();
  if (!tenant) {
    throw new Error("No tenant found. Please log in again.");
  }

  // Extract email and password
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const staffType = (formData.get("staff_type") as string) || "teacher";

  if (!email || !password) {
    throw new Error("Email and password are required for staff creation");
  }

  // Step 1: Create Supabase Auth user using service role
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        role: staffType, // Use actual staff type (teacher, principal, etc.)
        tenant_id: tenant.tenant_id,
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
      },
    });

  if (authError || !authData.user) {
    console.error("Error creating auth user:", authError);
    throw new Error(
      `Failed to create user account: ${authError?.message || "Unknown error"}`
    );
  }

  const userId = authData.user.id;

  // Handle photo upload
  let photoUrl: string | null = null;
  const photoFile = formData.get("photo") as File | null;

  if (photoFile && photoFile.size > 0) {
    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `staff/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("staff-photos")
      .upload(filePath, photoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      throw new Error("Failed to upload photo");
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("staff-photos").getPublicUrl(filePath);

    photoUrl = publicUrl;
  }

  // Step 2: Create staff record with user_id
  try {
    const staffData = {
      tenant_id: tenant.tenant_id, // CRITICAL: Add tenant_id
      user_id: userId, // Link to auth user
      employee_id: formData.get("employee_id") as string,
      salutation: formData.get("salutation") as string | null,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string | null,
      date_of_birth: formData.get("date_of_birth") as string | null,
      gender: formData.get("gender") as "male" | "female" | "other" | null,
      address: formData.get("address") as string | null,
      qualification: formData.get("qualification") as string | null,
      department: formData.get("department") as string | null,
      date_of_joining: formData.get("date_of_joining") as string | null,
      salary: formData.get("salary")
        ? parseFloat(formData.get("salary") as string)
        : null,
      status:
        (formData.get("status") as "active" | "inactive" | "on_leave") ||
        "active",
      staff_type:
        (formData.get("staff_type") as
          | "teacher"
          | "principal"
          | "vice_principal"
          | "clerk"
          | "librarian"
          | "driver"
          | "security"
          | "nurse"
          | "accountant"
          | "lab_assistant"
          | "sports_coach"
          | "counselor"
          | "other") || "teacher",
      photo_url: photoUrl,
    };

    const supabaseAny: any = supabase;
    const { data, error } = await supabaseAny
      .from("staff")
      .insert([staffData])
      .select()
      .single();

    if (error) {
      console.error("Error creating staff:", error);
      // Rollback: Delete the auth user since staff creation failed
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error(`Failed to create staff: ${error.message}`);
    }

    revalidatePath("/dashboard/staff");
    return data as Staff;
  } catch (staffError) {
    // Rollback: Delete the auth user if anything went wrong
    console.error("Error in staff creation process:", staffError);
    try {
      await supabaseAdmin.auth.admin.deleteUser(userId);
    } catch (deleteError) {
      console.error("Failed to cleanup auth user:", deleteError);
    }
    throw staffError;
  }
}

// Update staff member
export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createClient();

  // Get existing staff to check for old photo
  const { data: existingStaff } = await supabase
    .from("staff")
    .select("photo_url")
    .eq("id", id)
    .single<{ photo_url: string | null }>();

  // Handle photo upload
  let photoUrl: string | null = existingStaff?.photo_url || null;
  const photoFile = formData.get("photo") as File | null;

  if (photoFile && photoFile.size > 0) {
    // Delete old photo if exists
    if (existingStaff?.photo_url) {
      const oldFilePath = existingStaff.photo_url.split("/staff-photos/").pop();
      if (oldFilePath) {
        await supabase.storage
          .from("staff-photos")
          .remove([`staff/${oldFilePath}`]);
      }
    }

    // Upload new photo
    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `staff/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("staff-photos")
      .upload(filePath, photoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading photo:", uploadError);
      throw new Error("Failed to upload photo");
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("staff-photos").getPublicUrl(filePath);

    photoUrl = publicUrl;
  }

  const staffData = {
    employee_id: formData.get("employee_id") as string,
    salutation: formData.get("salutation") as string | null,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | null,
    date_of_birth: formData.get("date_of_birth") as string | null,
    gender: formData.get("gender") as "male" | "female" | "other" | null,
    address: formData.get("address") as string | null,
    qualification: formData.get("qualification") as string | null,
    department: formData.get("department") as string | null,
    date_of_joining: formData.get("date_of_joining") as string | null,
    salary: formData.get("salary")
      ? parseFloat(formData.get("salary") as string)
      : null,
    status:
      (formData.get("status") as "active" | "inactive" | "on_leave") ||
      "active",
    staff_type:
      (formData.get("staff_type") as
        | "teacher"
        | "principal"
        | "vice_principal"
        | "clerk"
        | "librarian"
        | "driver"
        | "security"
        | "nurse"
        | "accountant"
        | "lab_assistant"
        | "sports_coach"
        | "counselor"
        | "other") || "teacher",
    photo_url: photoUrl,
    updated_at: new Date().toISOString(),
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("staff")
    .update(staffData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating staff:", error);
    throw new Error(`Failed to update staff: ${error.message}`);
  }

  revalidatePath("/dashboard/staff");
  revalidatePath(`/dashboard/staff/${id}`);
  return data as Staff;
}

// Delete staff member
export async function deleteStaff(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("staff").delete().eq("id", id);

  if (error) {
    console.error("Error deleting staff:", error);
    throw new Error("Failed to delete staff");
  }

  revalidatePath("/dashboard/staff");
}

// Get staff statistics
export async function getStaffStats() {
  const supabase = await createClient();

  const [
    { count: totalStaff },
    { count: activeStaff },
    { count: onLeave },
    { count: inactiveStaff },
  ] = await Promise.all([
    supabase.from("staff").select("*", { count: "exact", head: true }),
    supabase
      .from("staff")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("staff")
      .select("*", { count: "exact", head: true })
      .eq("status", "on_leave"),
    supabase
      .from("staff")
      .select("*", { count: "exact", head: true })
      .eq("status", "inactive"),
  ]);

  return {
    total: totalStaff || 0,
    active: activeStaff || 0,
    onLeave: onLeave || 0,
    inactive: inactiveStaff || 0,
  };
}

// Mark staff attendance
export async function markStaffAttendance(formData: FormData) {
  const supabase = await createClient();

  const attendanceData = {
    staff_id: formData.get("staff_id") as string,
    date: formData.get("date") as string,
    status: formData.get("status") as
      | "present"
      | "absent"
      | "half_day"
      | "on_leave",
    check_in: formData.get("check_in") as string | null,
    check_out: formData.get("check_out") as string | null,
    notes: formData.get("notes") as string | null,
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("staff_attendance")
    .upsert([attendanceData], { onConflict: "staff_id,date" })
    .select()
    .single();
  if (error) {
    console.error("Error marking attendance:", error);
    throw new Error("Failed to mark attendance");
  }

  revalidatePath("/dashboard/staff/attendance");
  return data as StaffAttendance;
}

// Get staff attendance records
export async function getStaffAttendance(filters?: {
  staffId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("staff_attendance")
    .select(
      `
      *,
      staff:staff_id (
        id,
        employee_id,
        first_name,
        last_name,
        department
      )
    `
    )
    .order("date", { ascending: false });

  if (filters?.staffId) {
    query = query.eq("staff_id", filters.staffId);
  }

  if (filters?.startDate) {
    query = query.gte("date", filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte("date", filters.endDate);
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching attendance:", error);
    throw new Error("Failed to fetch attendance");
  }

  return data;
}

// Get staff attendance stats for a specific staff member
export async function getStaffAttendanceStats(staffId: string, month?: string) {
  const supabase = await createClient();

  const startDate = month
    ? `${month}-01`
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0];
  const endDate = month
    ? new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0)
        .toISOString()
        .split("T")[0]
    : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

  const [
    { count: totalDays },
    { count: presentDays },
    { count: absentDays },
    { count: halfDays },
    { count: leaveDays },
  ] = await Promise.all([
    supabase
      .from("staff_attendance")
      .select("*", { count: "exact", head: true })
      .eq("staff_id", staffId)
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("staff_attendance")
      .select("*", { count: "exact", head: true })
      .eq("staff_id", staffId)
      .eq("status", "present")
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("staff_attendance")
      .select("*", { count: "exact", head: true })
      .eq("staff_id", staffId)
      .eq("status", "absent")
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("staff_attendance")
      .select("*", { count: "exact", head: true })
      .eq("staff_id", staffId)
      .eq("status", "half_day")
      .gte("date", startDate)
      .lte("date", endDate),
    supabase
      .from("staff_attendance")
      .select("*", { count: "exact", head: true })
      .eq("staff_id", staffId)
      .eq("status", "on_leave")
      .gte("date", startDate)
      .lte("date", endDate),
  ]);

  return {
    total: totalDays || 0,
    present: presentDays || 0,
    absent: absentDays || 0,
    halfDay: halfDays || 0,
    onLeave: leaveDays || 0,
    attendancePercentage: totalDays
      ? ((presentDays || 0) / (totalDays || 1)) * 100
      : 0,
  };
}

// Get unique departments
export async function getDepartments() {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("staff")
    .select("department")
    .not("department", "is", null);

  if (error) {
    console.error("Error fetching departments:", error);
    return [];
  }

  const departments = [...new Set(data.map((s: any) => s.department))].filter(
    Boolean
  );
  return departments as string[];
}
