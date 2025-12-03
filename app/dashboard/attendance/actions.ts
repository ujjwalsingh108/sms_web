"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type MemberWithTenant = { tenant_id: string };

interface MarkAttendanceData {
  student_id: string;
  class_id: string;
  section_id?: string;
  date: string;
  status: "present" | "absent" | "half_day" | "late";
  remarks?: string;
}

interface BulkAttendanceData {
  class_id: string;
  section_id?: string;
  date: string;
  attendance: {
    student_id: string;
    status: "present" | "absent" | "half_day" | "late";
    remarks?: string;
  }[];
}

// Mark attendance for a single student
export async function markAttendance(data: MarkAttendanceData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get tenant_id from member
  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "Member not found" };
  }

  // Check if attendance already exists for this date
  const { data: existing } = await supabase
    .from("student_attendance")
    .select("id")
    .eq("student_id", data.student_id)
    .eq("date", data.date)
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .single();

  if (existing) {
    // Update existing attendance
    const { error } = await supabase
      .from("student_attendance")
      // @ts-expect-error - Supabase type inference issue
      .update({
        status: data.status,
        remarks: data.remarks || null,
      })
      .eq("id", (existing as any).id)
      .eq("tenant_id", (member as MemberWithTenant).tenant_id);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // Create new attendance record
    const { error } = await supabase
      .from("student_attendance")
      // @ts-expect-error - Supabase type inference issue
      .insert({
        tenant_id: (member as MemberWithTenant).tenant_id,
        student_id: data.student_id,
        class_id: data.class_id,
        section_id: data.section_id || null,
        date: data.date,
        status: data.status,
        remarks: data.remarks || null,
        marked_by: user.id,
      });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/dashboard/attendance");
  return { success: true };
}

// Mark attendance for multiple students (bulk)
export async function markBulkAttendance(data: BulkAttendanceData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get tenant_id from member
  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "Member not found" };
  }

  // Get existing attendance records for this date
  const studentIds = data.attendance.map((a) => a.student_id);
  const { data: existingRecords } = await supabase
    .from("student_attendance")
    .select("id, student_id")
    .eq("date", data.date)
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .in("student_id", studentIds);

  const existingMap = new Map(
    (existingRecords || []).map((r: any) => [r.student_id, r.id])
  );

  const updates = [];
  const inserts = [];

  for (const attendance of data.attendance) {
    const existingId = existingMap.get(attendance.student_id);

    if (existingId) {
      updates.push({
        id: existingId,
        status: attendance.status,
        remarks: attendance.remarks || null,
      });
    } else {
      inserts.push({
        tenant_id: (member as MemberWithTenant).tenant_id,
        student_id: attendance.student_id,
        class_id: data.class_id,
        section_id: data.section_id || null,
        date: data.date,
        status: attendance.status,
        remarks: attendance.remarks || null,
        marked_by: user.id,
      });
    }
  }

  // Perform updates
  if (updates.length > 0) {
    for (const update of updates) {
      const { error } = await supabase
        .from("student_attendance")
        // @ts-expect-error - Supabase type inference issue
        .update({
          status: update.status,
          remarks: update.remarks,
        })
        .eq("id", update.id)
        .eq("tenant_id", (member as MemberWithTenant).tenant_id);

      if (error) {
        return { success: false, error: error.message };
      }
    }
  }

  // Perform inserts
  if (inserts.length > 0) {
    const { error } = await supabase
      .from("student_attendance")
      // @ts-expect-error - Supabase type inference issue
      .insert(inserts);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/dashboard/attendance");
  return { success: true };
}

// Get attendance records with filters
export async function getAttendanceRecords(params: {
  date?: string;
  class_id?: string;
  section_id?: string;
  student_id?: string;
  status?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get tenant_id from member
  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "Member not found" };
  }

  let query = supabase
    .from("student_attendance")
    .select(
      `
      *,
      student:students!student_id (
        id,
        admission_no,
        first_name,
        last_name,
        class:classes!class_id (id, name),
        section:sections!section_id (id, name)
      )
    `
    )
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (params.date) {
    query = query.eq("date", params.date);
  }

  if (params.class_id) {
    query = query.eq("class_id", params.class_id);
  }

  if (params.section_id) {
    query = query.eq("section_id", params.section_id);
  }

  if (params.student_id) {
    query = query.eq("student_id", params.student_id);
  }

  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data: records, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: records };
}

// Get attendance statistics for a student
export async function getStudentAttendanceStats(
  studentId: string,
  startDate?: string,
  endDate?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get tenant_id from member
  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "Member not found" };
  }

  let query = supabase
    .from("student_attendance")
    .select("status, date")
    .eq("student_id", studentId)
    .eq("tenant_id", (member as MemberWithTenant).tenant_id);

  if (startDate) {
    query = query.gte("date", startDate);
  }

  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data: records, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  const stats = {
    total_days: records?.length || 0,
    present: records?.filter((r: any) => r.status === "present").length || 0,
    absent: records?.filter((r: any) => r.status === "absent").length || 0,
    half_day: records?.filter((r: any) => r.status === "half_day").length || 0,
    late: records?.filter((r: any) => r.status === "late").length || 0,
    attendance_percentage: 0,
  };

  if (stats.total_days > 0) {
    stats.attendance_percentage = parseFloat(
      (
        ((stats.present + stats.half_day * 0.5 + stats.late) /
          stats.total_days) *
        100
      ).toFixed(2)
    );
  }

  return { success: true, data: stats };
}

// Get attendance statistics for a class
export async function getClassAttendanceStats(
  classId: string,
  date: string,
  sectionId?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get tenant_id from member
  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "Member not found" };
  }

  // Get all students in the class
  let studentQuery = supabase
    .from("students")
    .select("id")
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("class_id", classId)
    .eq("status", "active");

  if (sectionId) {
    studentQuery = studentQuery.eq("section_id", sectionId);
  }

  const { data: students, error: studentsError } = await studentQuery;

  if (studentsError) {
    return { success: false, error: studentsError.message };
  }

  const totalStudents = students?.length || 0;

  // Get attendance for the date
  let attendanceQuery = supabase
    .from("student_attendance")
    .select("status")
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("class_id", classId)
    .eq("date", date);

  if (sectionId) {
    attendanceQuery = attendanceQuery.eq("section_id", sectionId);
  }

  const { data: attendance, error: attendanceError } = await attendanceQuery;

  if (attendanceError) {
    return { success: false, error: attendanceError.message };
  }

  const stats = {
    total_students: totalStudents,
    marked: attendance?.length || 0,
    present: attendance?.filter((a: any) => a.status === "present").length || 0,
    absent: attendance?.filter((a: any) => a.status === "absent").length || 0,
    half_day:
      attendance?.filter((a: any) => a.status === "half_day").length || 0,
    late: attendance?.filter((a: any) => a.status === "late").length || 0,
    not_marked: totalStudents - (attendance?.length || 0),
  };

  return { success: true, data: stats };
}

// Get students for attendance marking
export async function getStudentsForAttendance(
  classId: string,
  sectionId?: string,
  date?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get tenant_id from member
  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    return { success: false, error: "Member not found" };
  }

  // Get all students in the class
  let query = supabase
    .from("students")
    .select(
      `
      id,
      admission_no,
      first_name,
      last_name,
      class:classes!class_id (id, name),
      section:sections!section_id (id, name)
    `
    )
    .eq("tenant_id", (member as MemberWithTenant).tenant_id)
    .eq("class_id", classId)
    .eq("status", "active")
    .order("admission_no");

  if (sectionId) {
    query = query.eq("section_id", sectionId);
  }

  const { data: students, error: studentsError } = await query;

  if (studentsError) {
    return { success: false, error: studentsError.message };
  }

  // If date is provided, get existing attendance
  if (date) {
    const studentIds = (students || []).map((s: any) => s.id);

    let attendanceQuery = supabase
      .from("student_attendance")
      .select("student_id, status, remarks")
      .eq("tenant_id", (member as MemberWithTenant).tenant_id)
      .eq("date", date)
      .in("student_id", studentIds);

    const { data: attendance } = await attendanceQuery;

    const attendanceMap = new Map(
      (attendance || []).map((a: any) => [
        a.student_id,
        { status: a.status, remarks: a.remarks },
      ])
    );

    const studentsWithAttendance = (students || []).map((student: any) => ({
      ...student,
      attendance: attendanceMap.get(student.id) || null,
    }));

    return { success: true, data: studentsWithAttendance };
  }

  return { success: true, data: students };
}
