"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Staff = {
  id: string;
  tenant_id: string;
  user_id: string | null;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | null;
  address: string | null;
  qualification: string | null;
  designation: string | null;
  department: string | null;
  date_of_joining: string | null;
  salary: number | null;
  status: "active" | "inactive" | "on_leave";
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
  designation?: string;
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

  if (filters?.designation && filters.designation !== "all") {
    query = query.eq("designation", filters.designation);
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

  const staffData = {
    employee_id: formData.get("employee_id") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | null,
    date_of_birth: formData.get("date_of_birth") as string | null,
    gender: formData.get("gender") as "male" | "female" | "other" | null,
    address: formData.get("address") as string | null,
    qualification: formData.get("qualification") as string | null,
    designation: formData.get("designation") as string | null,
    department: formData.get("department") as string | null,
    date_of_joining: formData.get("date_of_joining") as string | null,
    salary: formData.get("salary")
      ? parseFloat(formData.get("salary") as string)
      : null,
    status:
      (formData.get("status") as "active" | "inactive" | "on_leave") ||
      "active",
    photo_url: formData.get("photo_url") as string | null,
  };

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("staff")
    .insert([staffData])
    .select()
    .single();

  if (error) {
    console.error("Error creating staff:", error);
    throw new Error("Failed to create staff");
  }

  revalidatePath("/dashboard/staff");
  return data as Staff;
}

// Update staff member
export async function updateStaff(id: string, formData: FormData) {
  const supabase = await createClient();

  const staffData = {
    employee_id: formData.get("employee_id") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | null,
    date_of_birth: formData.get("date_of_birth") as string | null,
    gender: formData.get("gender") as "male" | "female" | "other" | null,
    address: formData.get("address") as string | null,
    qualification: formData.get("qualification") as string | null,
    designation: formData.get("designation") as string | null,
    department: formData.get("department") as string | null,
    date_of_joining: formData.get("date_of_joining") as string | null,
    salary: formData.get("salary")
      ? parseFloat(formData.get("salary") as string)
      : null,
    status:
      (formData.get("status") as "active" | "inactive" | "on_leave") ||
      "active",
    photo_url: formData.get("photo_url") as string | null,
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
    throw new Error("Failed to update staff");
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
        designation,
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

// Get unique designations
export async function getDesignations() {
  const supabase = await createClient();

  const supabaseAny: any = supabase;
  const { data, error } = await supabaseAny
    .from("staff")
    .select("designation")
    .not("designation", "is", null);

  if (error) {
    console.error("Error fetching designations:", error);
    return [];
  }

  const designations = [...new Set(data.map((s: any) => s.designation))].filter(
    Boolean
  );
  return designations as string[];
}
