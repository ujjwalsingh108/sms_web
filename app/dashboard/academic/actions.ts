"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Get admin client with service role key
function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createAdminClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type Class = {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Section = {
  id: string;
  tenant_id: string;
  class_id: string;
  name: string;
  room_number: string | null;
  capacity: number | null;
  created_at: string;
};

export type ClassWithSections = Class & {
  sections?: Section[];
};

export type AcademicYear = {
  id: string;
  tenant_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
};

export type Subject = {
  id: string;
  tenant_id: string;
  name: string;
  code: string;
  description: string | null;
  created_at: string;
};

export type ClassSubject = {
  id: string;
  tenant_id: string;
  class_id: string;
  subject_id: string;
  created_at: string;
};

export type SubjectWithClasses = Subject & {
  classes?: Class[];
  class_count?: number;
};

// =====================================================
// ACADEMIC YEAR CRUD OPERATIONS
// =====================================================

export async function getAcademicYears() {
  try {
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
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .eq("tenant_id", (member as any).tenant_id)
      .order("start_date", { ascending: false });

    if (error) throw error;

    return { success: true, data: data as AcademicYear[] };
  } catch (error) {
    console.error("Error fetching academic years:", error);
    return { success: false, error: "Failed to fetch academic years" };
  }
}

export async function getAcademicYearById(id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as AcademicYear };
  } catch (error) {
    console.error("Error fetching academic year:", error);
    return { success: false, error: "Failed to fetch academic year" };
  }
}

export async function createAcademicYear(formData: {
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  tenant_id: string;
}) {
  try {
    const adminClient = getAdminClient();

    // If setting this as current, unset all other current years for this tenant
    if (formData.is_current) {
      await adminClient
        .from("academic_years")
        .update({ is_current: false })
        .eq("tenant_id", formData.tenant_id);
    }

    const { data, error } = await adminClient
      .from("academic_years")
      .insert([formData])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true, data };
  } catch (error) {
    console.error("Error creating academic year:", error);
    return { success: false, error: "Failed to create academic year" };
  }
}

export async function updateAcademicYear(
  id: string,
  formData: {
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    tenant_id: string;
  }
) {
  try {
    const adminClient = getAdminClient();

    // If setting this as current, unset all other current years for this tenant
    if (formData.is_current) {
      await adminClient
        .from("academic_years")
        .update({ is_current: false })
        .eq("tenant_id", formData.tenant_id)
        .neq("id", id);
    }

    const { data, error } = await adminClient
      .from("academic_years")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true, data };
  } catch (error) {
    console.error("Error updating academic year:", error);
    return { success: false, error: "Failed to update academic year" };
  }
}

export async function deleteAcademicYear(id: string) {
  try {
    const adminClient = getAdminClient();

    const { error } = await adminClient
      .from("academic_years")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true };
  } catch (error) {
    console.error("Error deleting academic year:", error);
    return { success: false, error: "Failed to delete academic year" };
  }
}

// =====================================================
// CLASS CRUD OPERATIONS
// =====================================================

export async function getClasses() {
  try {
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
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabase
      .from("classes")
      .select(
        `
        *,
        sections:sections(id, name, room_number, capacity)
      `
      )
      .eq("tenant_id", (member as any).tenant_id)
      .order("name", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as ClassWithSections[] };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { success: false, error: "Failed to fetch classes" };
  }
}

export async function getClassById(id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("classes")
      .select(
        `
        *,
        sections:sections(id, name, room_number, capacity)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as ClassWithSections };
  } catch (error) {
    console.error("Error fetching class:", error);
    return { success: false, error: "Failed to fetch class" };
  }
}

export async function createClass(formData: {
  name: string;
  description?: string;
}) {
  try {
    const supabase = await createClient();
    const adminClient = getAdminClient();

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
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await adminClient
      .from("classes")
      .insert({
        tenant_id: (member as any).tenant_id,
        name: formData.name,
        description: formData.description || null,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true, data: data as Class };
  } catch (error) {
    console.error("Error creating class:", error);
    return { success: false, error: "Failed to create class" };
  }
}

export async function updateClass(
  id: string,
  formData: {
    name?: string;
    description?: string;
  }
) {
  try {
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("classes")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true, data: data as Class };
  } catch (error) {
    console.error("Error updating class:", error);
    return { success: false, error: "Failed to update class" };
  }
}

export async function deleteClass(id: string) {
  try {
    const adminClient = getAdminClient();

    const { error } = await adminClient.from("classes").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true };
  } catch (error) {
    console.error("Error deleting class:", error);
    return { success: false, error: "Failed to delete class" };
  }
}

// =====================================================
// SECTION CRUD OPERATIONS
// =====================================================

export async function getSections(classId?: string) {
  try {
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
      return { success: false, error: "No organization found" };
    }

    let query = supabase
      .from("sections")
      .select(
        `
        *,
        class:class_id(id, name)
      `
      )
      .eq("tenant_id", (member as any).tenant_id);

    if (classId) {
      query = query.eq("class_id", classId);
    }

    const { data, error } = await query.order("name", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching sections:", error);
    return { success: false, error: "Failed to fetch sections" };
  }
}

export async function getSectionById(id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("sections")
      .select(
        `
        *,
        class:class_id(id, name)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching section:", error);
    return { success: false, error: "Failed to fetch section" };
  }
}

export async function createSection(formData: {
  class_id: string;
  name: string;
  room_number?: string;
  capacity?: number;
}) {
  try {
    const supabase = await createClient();
    const adminClient = getAdminClient();

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
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await adminClient
      .from("sections")
      .insert({
        tenant_id: (member as any).tenant_id,
        class_id: formData.class_id,
        name: formData.name,
        room_number: formData.room_number || null,
        capacity: formData.capacity || null,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true, data: data as Section };
  } catch (error) {
    console.error("Error creating section:", error);
    return { success: false, error: "Failed to create section" };
  }
}

export async function updateSection(
  id: string,
  formData: {
    class_id?: string;
    name?: string;
    room_number?: string;
    capacity?: number;
  }
) {
  try {
    const adminClient = getAdminClient();

    const { data, error } = await adminClient
      .from("sections")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true, data: data as Section };
  } catch (error) {
    console.error("Error updating section:", error);
    return { success: false, error: "Failed to update section" };
  }
}

export async function deleteSection(id: string) {
  try {
    const adminClient = getAdminClient();

    const { error } = await adminClient.from("sections").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true };
  } catch (error) {
    console.error("Error deleting section:", error);
    return { success: false, error: "Failed to delete section" };
  }
}

// =====================================================
// STATISTICS
// =====================================================

export async function getAcademicStats() {
  try {
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
      return { success: false, error: "No organization found" };
    }

    const tenantId = (member as any).tenant_id;

    // Get class count
    const { count: classCount } = await supabase
      .from("classes")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    // Get section count
    const { count: sectionCount } = await supabase
      .from("sections")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    // Get student count
    const { count: studentCount } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active");

    // Get subject count
    const { count: subjectCount } = await supabase
      .from("subjects")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    return {
      success: true,
      data: {
        classCount: classCount || 0,
        sectionCount: sectionCount || 0,
        studentCount: studentCount || 0,
        subjectCount: subjectCount || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}

// =====================================================
// SUBJECTS CRUD OPERATIONS
// =====================================================

export async function getSubjects() {
  try {
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
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabase
      .from("subjects")
      .select(
        `
        *,
        class_subjects (
          class_id,
          classes (
            id,
            name
          )
        )
      `
      )
      .eq("tenant_id", (member as any).tenant_id)
      .order("name", { ascending: true });

    if (error) throw error;

    // Transform data to include class count and class names
    const subjects = data?.map((subject: any) => ({
      ...subject,
      class_count: subject.class_subjects?.length || 0,
      classes: subject.class_subjects?.map((cs: any) => cs.classes) || [],
    }));

    return { success: true, data: subjects as SubjectWithClasses[] };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return { success: false, error: "Failed to fetch subjects" };
  }
}

export async function getSubjectById(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("subjects")
      .select(
        `
        *,
        class_subjects (
          class_id,
          classes (
            id,
            name
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    // Transform data to include classes array
    const subject = {
      ...data,
      classes: data.class_subjects?.map((cs: any) => cs.classes) || [],
      class_ids: data.class_subjects?.map((cs: any) => cs.class_id) || [],
    };

    return { success: true, data: subject };
  } catch (error) {
    console.error("Error fetching subject:", error);
    return { success: false, error: "Failed to fetch subject" };
  }
}

export async function createSubject(formData: {
  name: string;
  code: string;
  description?: string;
  class_ids?: string[];
}) {
  try {
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
      return { success: false, error: "No organization found" };
    }

    // Check if subject code already exists
    const { data: existing } = await supabase
      .from("subjects")
      .select("id")
      .eq("tenant_id", (member as any).tenant_id)
      .eq("code", formData.code)
      .single();

    if (existing) {
      return { success: false, error: "Subject code already exists" };
    }

    const { class_ids, ...subjectData } = formData;

    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .insert({
        ...subjectData,
        tenant_id: (member as any).tenant_id,
      })
      .select()
      .single();

    if (subjectError) throw subjectError;

    // Create class-subject mappings if class_ids provided
    if (class_ids && class_ids.length > 0) {
      const classSubjects = class_ids.map((class_id) => ({
        tenant_id: (member as any).tenant_id,
        class_id,
        subject_id: subject.id,
      }));

      const { error: mappingError } = await supabase
        .from("class_subjects")
        .insert(classSubjects);

      if (mappingError) throw mappingError;
    }

    revalidatePath("/dashboard/academic");
    return { success: true, data: subject as Subject };
  } catch (error) {
    console.error("Error creating subject:", error);
    return { success: false, error: "Failed to create subject" };
  }
}

export async function updateSubject(
  id: string,
  formData: {
    name?: string;
    code?: string;
    description?: string;
    class_ids?: string[];
  }
) {
  try {
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
      return { success: false, error: "No organization found" };
    }

    const tenantId = (member as any).tenant_id;

    // Check if code is being changed and if new code already exists
    if (formData.code) {
      const { data: existing } = await supabase
        .from("subjects")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("code", formData.code)
        .neq("id", id)
        .single();

      if (existing) {
        return { success: false, error: "Subject code already exists" };
      }
    }

    const { class_ids, ...subjectData } = formData;

    // Update subject
    const { data: subject, error: subjectError } = await supabase
      .from("subjects")
      .update(subjectData)
      .eq("id", id)
      .select()
      .single();

    if (subjectError) throw subjectError;

    // Update class-subject mappings if class_ids provided
    if (class_ids !== undefined) {
      // Delete existing mappings
      const { error: deleteError } = await supabase
        .from("class_subjects")
        .delete()
        .eq("subject_id", id);

      if (deleteError) throw deleteError;

      // Create new mappings
      if (class_ids.length > 0) {
        const classSubjects = class_ids.map((class_id) => ({
          tenant_id: tenantId,
          class_id,
          subject_id: id,
        }));

        const { error: mappingError } = await supabase
          .from("class_subjects")
          .insert(classSubjects);

        if (mappingError) throw mappingError;
      }
    }

    revalidatePath("/dashboard/academic");
    return { success: true, data: subject as Subject };
  } catch (error) {
    console.error("Error updating subject:", error);
    return { success: false, error: "Failed to update subject" };
  }
}

export async function deleteSubject(id: string) {
  try {
    const adminClient = getAdminClient();

    // First delete all class-subject mappings
    const { error: mappingError } = await adminClient
      .from("class_subjects")
      .delete()
      .eq("subject_id", id);

    if (mappingError) throw mappingError;

    // Then delete the subject
    const { error } = await adminClient.from("subjects").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/academic");
    return { success: true };
  } catch (error) {
    console.error("Error deleting subject:", error);
    return { success: false, error: "Failed to delete subject" };
  }
}
