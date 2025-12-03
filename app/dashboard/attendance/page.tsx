import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, UserCheck, UserX, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAttendanceRecords } from "./actions";
import AttendanceFilters from "@/components/attendance/attendance-filters";
import AttendanceTable from "@/components/attendance/attendance-table";

async function getClasses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) return [];

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .eq("tenant_id", (member as any).tenant_id)
    .order("name");

  return classes || [];
}

async function getAttendanceData(searchParams: {
  date?: string;
  class_id?: string;
  section_id?: string;
  status?: string;
}) {
  const today = new Date().toISOString().split("T")[0];
  const date = searchParams.date || today;

  const result = await getAttendanceRecords({
    date,
    class_id: searchParams.class_id,
    section_id: searchParams.section_id,
    status: searchParams.status,
  });

  return result.success ? result.data : [];
}

async function getStats(date?: string) {
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

  const today = new Date().toISOString().split("T")[0];
  const targetDate = date || today;

  const { data: attendance } = await supabase
    .from("student_attendance")
    .select("status")
    .eq("tenant_id", (member as any).tenant_id)
    .eq("date", targetDate);

  const stats = {
    total: attendance?.length || 0,
    present: attendance?.filter((a: any) => a.status === "present").length || 0,
    absent: attendance?.filter((a: any) => a.status === "absent").length || 0,
    halfDay:
      attendance?.filter((a: any) => a.status === "half_day").length || 0,
    late: attendance?.filter((a: any) => a.status === "late").length || 0,
  };

  return stats;
}

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{
    date?: string;
    class_id?: string;
    section_id?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;
  const classes = await getClasses();
  const records = await getAttendanceData(params);
  const stats = await getStats(params.date);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Attendance Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mark and manage student attendance
          </p>
        </div>
        <Link href="/dashboard/attendance/mark">
          <Button className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Students marked</p>
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
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? `${((stats.present / stats.total) * 100).toFixed(1)}%`
                  : "0%"}
              </p>
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
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? `${((stats.absent / stats.total) * 100).toFixed(1)}%`
                  : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Half Day</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.halfDay}
              </div>
              <p className="text-xs text-muted-foreground">
                Partial attendance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Late</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.late}
              </div>
              <p className="text-xs text-muted-foreground">Arrived late</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading filters...</div>}>
            <AttendanceFilters classes={classes} />
          </Suspense>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading records...</div>}>
            <AttendanceTable records={records || []} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
