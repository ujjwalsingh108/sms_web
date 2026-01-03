"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export type ExamType = {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Exam = {
  id: string;
  tenant_id: string;
  exam_type_id: string;
  name: string;
  academic_year_id: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  created_at: string;
  exam_type?: ExamType;
};

export type ExamSchedule = {
  id: string;
  tenant_id: string;
  exam_id: string;
  class_id: string;
  subject_id: string;
  exam_date: string;
  start_time: string | null;
  end_time: string | null;
  room_number: string | null;
  max_marks: number;
  created_at: string;
};

export type ExamResult = {
  id: string;
  tenant_id: string;
  exam_schedule_id: string;
  student_id: string;
  marks_obtained: number | null;
  grade: string | null;
  remarks: string | null;
  is_absent: boolean;
  created_at: string;
  updated_at: string;
};

// =====================================================
// EXAM TYPES CRUD
// =====================================================

export async function getExamTypes() {
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
      .from("exam_types")
      .select("*")
      .eq("tenant_id", member.tenant_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: data as ExamType[] };
  } catch (error) {
    console.error("Error fetching exam types:", error);
    return { success: false, error: "Failed to fetch exam types" };
  }
}

export async function getExamTypeById(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("exam_types")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as ExamType };
  } catch (error) {
    console.error("Error fetching exam type:", error);
    return { success: false, error: "Failed to fetch exam type" };
  }
}

export async function createExamType(formData: {
  name: string;
  description?: string;
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("exam_types")
      .insert({
        tenant_id: member.tenant_id,
        name: formData.name,
        description: formData.description || null,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as ExamType };
  } catch (error) {
    console.error("Error creating exam type:", error);
    return { success: false, error: "Failed to create exam type" };
  }
}

export async function updateExamType(
  id: string,
  formData: {
    name: string;
    description?: string;
  }
) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("exam_types")
      .update({
        name: formData.name,
        description: formData.description || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as ExamType };
  } catch (error) {
    console.error("Error updating exam type:", error);
    return { success: false, error: "Failed to update exam type" };
  }
}

export async function deleteExamType(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { error } = await supabaseAny
      .from("exam_types")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true };
  } catch (error) {
    console.error("Error deleting exam type:", error);
    return { success: false, error: "Failed to delete exam type" };
  }
}

// =====================================================
// EXAMS CRUD
// =====================================================

export async function getExams() {
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("exams")
      .select(
        `
        *,
        exam_type:exam_type_id(id, name)
      `
      )
      .eq("tenant_id", member.tenant_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: data as Exam[] };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return { success: false, error: "Failed to fetch exams" };
  }
}

export async function getExamById(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("exams")
      .select(
        `
        *,
        exam_type:exam_type_id(id, name)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as Exam };
  } catch (error) {
    console.error("Error fetching exam:", error);
    return { success: false, error: "Failed to fetch exam" };
  }
}

export async function createExam(formData: {
  exam_type_id: string;
  name: string;
  academic_year_id?: string;
  start_date?: string;
  end_date?: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("exams")
      .insert({
        tenant_id: member.tenant_id,
        exam_type_id: formData.exam_type_id,
        name: formData.name,
        academic_year_id: formData.academic_year_id || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: formData.status || "scheduled",
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as Exam };
  } catch (error) {
    console.error("Error creating exam:", error);
    return { success: false, error: "Failed to create exam" };
  }
}

export async function updateExam(
  id: string,
  formData: {
    exam_type_id?: string;
    name?: string;
    academic_year_id?: string;
    start_date?: string;
    end_date?: string;
    status?: "scheduled" | "ongoing" | "completed" | "cancelled";
  }
) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("exams")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as Exam };
  } catch (error) {
    console.error("Error updating exam:", error);
    return { success: false, error: "Failed to update exam" };
  }
}

export async function deleteExam(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { error } = await supabaseAny.from("exams").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true };
  } catch (error) {
    console.error("Error deleting exam:", error);
    return { success: false, error: "Failed to delete exam" };
  }
}

// =====================================================
// EXAM SCHEDULES CRUD
// =====================================================

export async function getExamSchedules(examId?: string) {
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    let query = supabaseAny
      .from("exam_schedules")
      .select(
        `
        *,
        exam:exam_id(id, name),
        class:class_id(id, name),
        subject:subject_id(id, name, code)
      `
      )
      .eq("tenant_id", member.tenant_id);

    if (examId) {
      query = query.eq("exam_id", examId);
    }

    const { data, error } = await query.order("exam_date", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as ExamSchedule[] };
  } catch (error) {
    console.error("Error fetching exam schedules:", error);
    return { success: false, error: "Failed to fetch exam schedules" };
  }
}

export async function getExamScheduleById(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("exam_schedules")
      .select(
        `
        *,
        exam:exam_id(id, name),
        class:class_id(id, name),
        subject:subject_id(id, name, code)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as ExamSchedule };
  } catch (error) {
    console.error("Error fetching exam schedule:", error);
    return { success: false, error: "Failed to fetch exam schedule" };
  }
}

export async function createExamSchedule(formData: {
  exam_id: string;
  class_id: string;
  subject_id: string;
  exam_date: string;
  start_time?: string;
  end_time?: string;
  room_number?: string;
  max_marks?: number;
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("exam_schedules")
      .insert({
        tenant_id: member.tenant_id,
        exam_id: formData.exam_id,
        class_id: formData.class_id,
        subject_id: formData.subject_id,
        exam_date: formData.exam_date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        room_number: formData.room_number || null,
        max_marks: formData.max_marks || 100,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as ExamSchedule };
  } catch (error) {
    console.error("Error creating exam schedule:", error);
    return { success: false, error: "Failed to create exam schedule" };
  }
}

export async function updateExamSchedule(
  id: string,
  formData: {
    exam_id?: string;
    class_id?: string;
    subject_id?: string;
    exam_date?: string;
    start_time?: string;
    end_time?: string;
    room_number?: string;
    max_marks?: number;
  }
) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("exam_schedules")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as ExamSchedule };
  } catch (error) {
    console.error("Error updating exam schedule:", error);
    return { success: false, error: "Failed to update exam schedule" };
  }
}

export async function deleteExamSchedule(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { error } = await supabaseAny
      .from("exam_schedules")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true };
  } catch (error) {
    console.error("Error deleting exam schedule:", error);
    return { success: false, error: "Failed to delete exam schedule" };
  }
}

// =====================================================
// EXAM RESULTS
// =====================================================

export async function getExamResults(
  examScheduleId?: string,
  studentId?: string
) {
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    let query = supabaseAny
      .from("exam_results")
      .select(
        `
        *,
        student:student_id(id, admission_no, first_name, last_name),
        exam_schedule:exam_schedule_id(
          id,
          exam_date,
          max_marks,
          exam:exam_id(id, name),
          class:class_id(id, name),
          subject:subject_id(id, name, code)
        )
      `
      )
      .eq("tenant_id", member.tenant_id);

    if (examScheduleId) {
      query = query.eq("exam_schedule_id", examScheduleId);
    }

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return { success: true, data: data as ExamResult[] };
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return { success: false, error: "Failed to fetch exam results" };
  }
}

export async function updateExamResult(
  id: string,
  formData: {
    marks_obtained?: number;
    grade?: string;
    remarks?: string;
    is_absent?: boolean;
  }
) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data, error } = await supabaseAny
      .from("exam_results")
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as ExamResult };
  } catch (error) {
    console.error("Error updating exam result:", error);
    return { success: false, error: "Failed to update exam result" };
  }
}

export async function bulkCreateExamResults(
  resultsData: {
    exam_schedule_id: string;
    student_id: string;
    marks_obtained: number;
    grade: string | null;
    remarks: string | null;
  }[]
) {
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const resultsToUpsert = resultsData.map((result) => ({
      tenant_id: member.tenant_id,
      exam_schedule_id: result.exam_schedule_id,
      student_id: result.student_id,
      marks_obtained: result.marks_obtained,
      grade: result.grade,
      remarks: result.remarks,
      is_absent: false,
    }));

    const { data, error } = await supabaseAny
      .from("exam_results")
      .upsert(resultsToUpsert, {
        onConflict: "exam_schedule_id,student_id",
      })
      .select();

    if (error) throw error;

    revalidatePath("/dashboard/exams");
    return { success: true, data: data as ExamResult[] };
  } catch (error) {
    console.error("Error creating exam results:", error);
    return { success: false, error: "Failed to create exam results" };
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
      await supabase
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
      .order("name");

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { success: false, error: "Failed to fetch classes" };
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
      await supabase
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
      .order("name");

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return { success: false, error: "Failed to fetch subjects" };
  }
}

export async function getStudentsByClass(classId: string) {
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const { data, error } = await supabaseAny
      .from("students")
      .select("id, admission_no, first_name, last_name")
      .eq("tenant_id", member.tenant_id)
      .eq("class_id", classId)
      .eq("status", "active")
      .order("first_name");

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: "Failed to fetch students" };
  }
}

export async function getExamStats() {
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
      await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

    if (!member) {
      return { success: false, error: "No organization found" };
    }

    const [totalExams, scheduledExams, ongoingExams, completedExams] =
      await Promise.all([
        supabaseAny
          .from("exams")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", member.tenant_id),
        supabaseAny
          .from("exams")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", member.tenant_id)
          .eq("status", "scheduled"),
        supabaseAny
          .from("exams")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", member.tenant_id)
          .eq("status", "ongoing"),
        supabaseAny
          .from("exams")
          .select("*", { count: "exact", head: true })
          .eq("tenant_id", member.tenant_id)
          .eq("status", "completed"),
      ]);

    return {
      success: true,
      data: {
        total: totalExams.count || 0,
        scheduled: scheduledExams.count || 0,
        ongoing: ongoingExams.count || 0,
        completed: completedExams.count || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching exam stats:", error);
    return { success: false, error: "Failed to fetch exam stats" };
  }
}
