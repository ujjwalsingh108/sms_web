import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { getStudentAttendanceStats, getAttendanceRecords } from "../../actions";
import { Calendar, TrendingUp, UserCheck, UserX } from "lucide-react";
import AttendanceCalendar from "@/components/attendance/attendance-calendar";

async function getStudent(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) return null;

  const { data: student } = await supabase
    .from("students")
    .select(
      `
      *,
      class:classes!class_id (id, name),
      section:sections!section_id (id, name)
    `
    )
    .eq("id", id)
    .eq("tenant_id", (member as any).tenant_id)
    .single();

  return student;
}

export default async function StudentAttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ start_date?: string; end_date?: string }>;
}) {
  const { id } = await params;
  const { start_date, end_date } = await searchParams;

  const student = await getStudent(id);

  if (!student) {
    notFound();
  }

  // Default to current month
  const now = new Date();
  const startDate =
    start_date ||
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const endDate =
    end_date ||
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

  const statsResult = await getStudentAttendanceStats(id, startDate, endDate);
  const recordsResult = await getAttendanceRecords({
    student_id: id,
  });

  const stats = statsResult.success ? statsResult.data : null;
  const records = recordsResult.success ? recordsResult.data : [];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Student Attendance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {(student as any).first_name} {(student as any).last_name} •{" "}
          {(student as any).admission_no}
        </p>
      </div>

      {/* Student Info */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {(student as any).first_name} {(student as any).last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admission No</p>
              <p className="font-medium">{(student as any).admission_no}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="font-medium">
                {(student as any).class?.name || "N/A"}
                {(student as any).section?.name &&
                  ` - ${(student as any).section.name}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_days}</div>
              <p className="text-xs text-muted-foreground">Days marked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.present}
              </div>
              <p className="text-xs text-muted-foreground">Days present</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.absent}
              </div>
              <p className="text-xs text-muted-foreground">Days absent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Half Day</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.half_day}
              </div>
              <p className="text-xs text-muted-foreground">Partial days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Attendance %
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.attendance_percentage}%
              </div>
              <p className="text-xs text-muted-foreground">Overall rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <AttendanceCalendar records={records || []} />
        </CardContent>
      </Card>

      {/* Recent Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records && records.length > 0 ? (
              records.slice(0, 10).map((record: any) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {record.remarks && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {record.remarks}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      record.status === "present"
                        ? "default"
                        : record.status === "absent"
                        ? "destructive"
                        : record.status === "half_day"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {record.status === "half_day" ? "Half Day" : record.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No attendance records found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
