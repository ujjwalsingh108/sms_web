"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CreateStudentData, UpdateStudentData } from "@/lib/types/modules";

type MemberWithTenant = { tenant_id: string };

export async function getStudents(filters?: {
  class_id?: string;
  section_id?: string;
  status?: string;
  search?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get user's tenant
  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  let query = supabase
    .from("students")
    .select(
      `
      *,
      class:classes(id, name),
      section:sections(id, name)
    `
    )
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (filters?.class_id) {
    query = query.eq("class_id", filters.class_id);
  }

  if (filters?.section_id) {
    query = query.eq("section_id", filters.section_id);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,admission_no.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
    );
  }

  const { data: students, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: students };
}

export async function getStudentById(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: student, error } = await supabase
    .from("students")
    .select(
      `
      *,
      class:classes(id, name),
      section:sections(id, name),
      guardians(*)
    `
    )
    .eq("id", id)
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("is_deleted", false)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: student };
}

export async function createStudent(data: CreateStudentData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  // Check if admission number already exists
  const { data: existing } = await supabase
    .from("students")
    .select("id")
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("admission_no", data.admission_no)
    .eq("is_deleted", false)
    .single();

  if (existing) {
    return { success: false, error: "Admission number already exists" };
  }

  // Extract guardians data
  const { guardians, ...studentData } = data;

  // Insert student
  const { data: student, error: studentError } = await supabase
    .from("students")
    // @ts-expect-error - Supabase type inference issue with insert
    .insert({
      ...studentData,
      tenant_id: (member as MemberWithTenant).tenant_id,
      status: data.status || "active",
    })
    .select()
    .single();

  if (studentError) {
    return { success: false, error: studentError.message };
  }

  // Insert guardians if provided
  if (guardians && guardians.length > 0) {
    const guardiansData = guardians.map((guardian) => ({
      ...guardian,
      tenant_id: (member as MemberWithTenant).tenant_id,
      student_id: (student as any).id,
    }));

    const { error: guardiansError } = await supabase
      .from("guardians")
      // @ts-expect-error - Supabase type inference issue with insert
      .insert(guardiansData);

    if (guardiansError) {
      // Rollback: delete the student
      await supabase
        .from("students")
        .delete()
        .eq("id", (student as any).id);
      return { success: false, error: guardiansError.message };
    }
  }

  revalidatePath("/dashboard/students");
  return { success: true, data: student };
}

export async function updateStudent(data: UpdateStudentData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { id, guardians, ...studentData } = data;

  // Update student
  const { data: student, error: studentError } = await supabase
    .from("students")
    // @ts-expect-error - Supabase type inference issue
    .update({
      ...studentData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .select()
    .single();

  if (studentError) {
    return { success: false, error: studentError.message };
  }

  revalidatePath("/dashboard/students");
  revalidatePath(`/dashboard/students/${id}`);
  return { success: true, data: student };
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  // Soft delete
  const { error } = await supabase
    .from("students")
    // @ts-expect-error - Supabase type inference issue
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
    })
    .eq("id", id)
    .eq("tenant_id", (member as MemberWithTenant).tenant_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function restoreStudent(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { error } = await supabase
    .from("students")
    // @ts-expect-error - Supabase type inference issue
    .update({
      is_deleted: false,
      deleted_at: null,
      deleted_by: null,
    })
    .eq("id", id)
    .eq("tenant_id", (member as MemberWithTenant).tenant_id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

// Guardian management
export async function addGuardian(studentId: string, guardianData: any) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: guardian, error } = await supabase
    .from("guardians")
    .insert({
      ...guardianData,
      tenant_id: (member as MemberWithTenant).tenant_id,
      student_id: studentId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/students/${studentId}`);
  return { success: true, data: guardian };
}

export async function updateGuardian(id: string, guardianData: any) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: guardian, error } = await supabase
    .from("guardians")
    // @ts-expect-error - Supabase type inference issue with update
    .update(guardianData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: guardian };
}

export async function deleteGuardian(id: string, studentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Soft delete
  const { error } = await supabase
    .from("guardians")
    // @ts-expect-error - Supabase type inference issue with update
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      deleted_by: user.id,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/students/${studentId}`);
  return { success: true };
}

// Get classes and sections for dropdowns
export async function getClasses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: classes, error } = await supabase
    .from("classes")
    .select("id, name")
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("is_deleted", false)
    .order("name");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: classes };
}

export async function getSectionsByClass(classId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "No tenant found" };
  }

  const { data: sections, error } = await supabase
    .from("sections")
    .select("id, name")
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("class_id", classId)
    .eq("is_deleted", false)
    .order("name");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: sections };
}
