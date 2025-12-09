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
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
            Attendance Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Mark and manage student attendance
          </p>
        </div>
        <Link href="/dashboard/attendance/mark">
          <Button className="w-full sm:w-auto primary-gradient text-white hover:opacity-90 shadow-lg">
            <Calendar className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total
              </CardTitle>
              <div className="p-2 rounded-lg primary-gradient">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stats.total}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Students marked
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Present
              </CardTitle>
              <div className="p-2 rounded-lg success-gradient">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {stats.present}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.total > 0
                  ? `${((stats.present / stats.total) * 100).toFixed(1)}%`
                  : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Absent
              </CardTitle>
              <div className="p-2 rounded-lg danger-gradient">
                <UserX className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                {stats.absent}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.total > 0
                  ? `${((stats.absent / stats.total) * 100).toFixed(1)}%`
                  : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Half Day
              </CardTitle>
              <div className="p-2 rounded-lg warning-gradient">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                {stats.halfDay}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Partial attendance
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Late
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
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
