"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type Timetable = {
  id: string;
  tenant_id: string;
  class_id: string;
  section_id: string | null;
  academic_year_id: string | null;
  day_of_week: number;
  period_number: number;
  subject_id: string | null;
  teacher_id: string | null;
  start_time: string;
  end_time: string;
  room_number: string | null;
  is_lunch_break: boolean;
  created_at: string;
};

export type TimetableWithDetails = Timetable & {
  class?: { id: string; name: string };
  section?: { id: string; name: string } | null;
  subject?: { id: string; name: string; code: string | null } | null;
  teacher?: { id: string; first_name: string; last_name: string } | null;
};

export type Class = {
  id: string;
  name: string;
  description: string | null;
};

export type Section = {
  id: string;
  class_id: string;
  name: string;
  room_number: string | null;
};

export type Subject = {
  id: string;
  name: string;
  code: string | null;
};

export type Teacher = {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
};

export type AcademicYear = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
};

// =====================================================
// TIMETABLE CRUD
// =====================================================

export async function getTimetables(classId?: string, sectionId?: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member }: { data: { tenant_id: string } | null } =
      await supabaseAny
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    let query = supabaseAny
      .from("timetables")
      .select(
        `
        *,
        class:class_id(id, name),
        section:section_id(id, name),
        subject:subject_id(id, name, code),
        teacher:teacher_id(id, first_name, last_name, employee_id)
      `
      )
      .eq("tenant_id", member.tenant_id);

    if (classId) {
      query = query.eq("class_id", classId);
    }

    if (sectionId) {
      query = query.eq("section_id", sectionId);
    }

    const { data, error } = await query
      .order("day_of_week", { ascending: true })
      .order("period_number", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as TimetableWithDetails[] };
  } catch (error) {
    console.error("Error fetching timetables:", error);
    return { success: false, error: "Failed to fetch timetables" };
  }
}

export async function getTimetableById(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("timetables")
      .select(
        `
        *,
        class:class_id(id, name),
        section:section_id(id, name),
        subject:subject_id(id, name, code),
        teacher:teacher_id(id, first_name, last_name, employee_id)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as TimetableWithDetails };
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return { success: false, error: "Failed to fetch timetable" };
  }
}

export async function createTimetable(formData: {
  class_id: string;
  section_id?: string;
  academic_year_id?: string;
  day_of_week: number;
  period_number: number;
  subject_id?: string;
  teacher_id?: string;
  start_time: string;
  end_time: string;
  room_number?: string;
  is_lunch_break?: boolean;
}) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member }: { data: { tenant_id: string } | null } =
      await supabaseAny
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("timetables")
      .insert({
        tenant_id: member.tenant_id,
        class_id: formData.class_id,
        section_id: formData.section_id || null,
        academic_year_id: formData.academic_year_id || null,
        day_of_week: formData.day_of_week,
        period_number: formData.period_number,
        subject_id: formData.subject_id || null,
        teacher_id: formData.teacher_id || null,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room_number: formData.room_number || null,
        is_lunch_break: formData.is_lunch_break || false,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/timetable");
    return { success: true, data: data as Timetable };
  } catch (error) {
    console.error("Error creating timetable:", error);
    return { success: false, error: "Failed to create timetable entry" };
  }
}

export async function updateTimetable(
  id: string,
  formData: {
    class_id?: string;
    section_id?: string;
    academic_year_id?: string;
    day_of_week?: number;
    period_number?: number;
    subject_id?: string;
    teacher_id?: string;
    start_time?: string;
    end_time?: string;
    room_number?: string;
    is_lunch_break?: boolean;
  }
) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("timetables")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/timetable");
    return { success: true, data: data as Timetable };
  } catch (error) {
    console.error("Error updating timetable:", error);
    return { success: false, error: "Failed to update timetable entry" };
  }
}

export async function deleteTimetable(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { error } = await supabaseAny
      .from("timetables")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/timetable");
    return { success: true };
  } catch (error) {
    console.error("Error deleting timetable:", error);
    return { success: false, error: "Failed to delete timetable entry" };
  }
}

export async function bulkCreateTimetable(entries: {
  class_id: string;
  section_id?: string;
  academic_year_id?: string;
  entries: {
    day_of_week: number;
    period_number: number;
    subject_id?: string;
    teacher_id?: string;
    start_time: string;
    end_time: string;
    room_number?: string;
    is_lunch_break?: boolean;
  }[];
}) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member }: { data: { tenant_id: string } | null } =
      await supabaseAny
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const timetableEntries = entries.entries.map((entry) => ({
      tenant_id: member.tenant_id,
      class_id: entries.class_id,
      section_id: entries.section_id || null,
      academic_year_id: entries.academic_year_id || null,
      day_of_week: entry.day_of_week,
      period_number: entry.period_number,
      subject_id: entry.subject_id || null,
      teacher_id: entry.teacher_id || null,
      start_time: entry.start_time,
      end_time: entry.end_time,
      room_number: entry.room_number || null,
      is_lunch_break: entry.is_lunch_break || false,
    }));

    const { data, error } = await supabaseAny
      .from("timetables")
      .insert(timetableEntries)
      .select();

    if (error) throw error;

    revalidatePath("/dashboard/timetable");
    return { success: true, data: data as Timetable[] };
  } catch (error) {
    console.error("Error creating bulk timetable:", error);
    return { success: false, error: "Failed to create timetable entries" };
  }
}

export async function deleteTimetableByClass(
  classId: string,
  sectionId?: string
) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    let query = supabaseAny.from("timetables").delete().eq("class_id", classId);

    if (sectionId) {
      query = query.eq("section_id", sectionId);
    }

    const { error } = await query;

    if (error) throw error;

    revalidatePath("/dashboard/timetable");
    return { success: true };
  } catch (error) {
    console.error("Error deleting timetables:", error);
    return { success: false, error: "Failed to delete timetables" };
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export async function getClasses() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member }: { data: { tenant_id: string } | null } =
      await supabaseAny
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("classes")
      .select("*")
      .eq("tenant_id", member.tenant_id)
      .order("name", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Class[] };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { success: false, error: "Failed to fetch classes" };
  }
}

export async function getSectionsByClass(classId: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("sections")
      .select("*")
      .eq("class_id", classId)
      .order("name", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Section[] };
  } catch (error) {
    console.error("Error fetching sections:", error);
    return { success: false, error: "Failed to fetch sections" };
  }
}

export async function getSubjects() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member }: { data: { tenant_id: string } | null } =
      await supabaseAny
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("subjects")
      .select("*")
      .eq("tenant_id", member.tenant_id)
      .order("name", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Subject[] };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return { success: false, error: "Failed to fetch subjects" };
  }
}

export async function getTeachers() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member }: { data: { tenant_id: string } | null } =
      await supabaseAny
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("staff")
      .select("id, first_name, last_name, employee_id")
      .eq("tenant_id", member.tenant_id)
      .eq("status", "active")
      .order("first_name", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Teacher[] };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return { success: false, error: "Failed to fetch teachers" };
  }
}

export async function getAcademicYears() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: member }: { data: { tenant_id: string } | null } =
      await supabaseAny
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("academic_years")
      .select("*")
      .eq("tenant_id", member.tenant_id)
      .order("is_current", { ascending: false })
      .order("start_date", { ascending: false });

    if (error) throw error;

    return { success: true, data: data as AcademicYear[] };
  } catch (error) {
    console.error("Error fetching academic years:", error);
    return { success: false, error: "Failed to fetch academic years" };
  }
}
