import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AttendancePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select(`
      *,
      role:role_id(id, name, display_name),
      tenant:tenant_id(id, name, email)
    `)
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as { tenant_id: string } | undefined;

  if (!member) {
    redirect("/login");
  }

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Fetch today's attendance
  const { data: todayAttendance } = await supabase
    .from("student_attendance")
    .select(`
      *,
      student:students(first_name, last_name, roll_number),
      class:classes(name),
      section:sections(name)
    `)
    .eq("tenant_id", member.tenant_id)
    .eq("attendance_date", today)
    .limit(50);

  // Fetch classes
  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .eq("tenant_id", member.tenant_id);

  type Attendance = {
    status: string;
  };

  const presentCount =
    (todayAttendance as Attendance[] | null)?.filter((a) => a.status === "present")
      .length || 0;
  const absentCount =
    (todayAttendance as Attendance[] | null)?.filter((a) => a.status === "absent")
      .length || 0;
  const lateCount =
    (todayAttendance as Attendance[] | null)?.filter((a) => a.status === "late")
      .length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track student attendance and records</p>
        </div>
        <Link href="/dashboard/attendance/mark">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Today&apos;s Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {todayAttendance?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{presentCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{absentCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Late
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{lateCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Attendance ({today})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Roll Number</th>
                  <th className="text-left p-3">Student Name</th>
                  <th className="text-left p-3">Class</th>
                  <th className="text-left p-3">Section</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Remarks</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance && todayAttendance.length > 0 ? (
                  todayAttendance.map((record: any) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono">{record.student?.roll_number}</td>
                      <td className="p-3 font-medium">
                        {record.student?.first_name} {record.student?.last_name}
                      </td>
                      <td className="p-3">{record.class?.name || "N/A"}</td>
                      <td className="p-3">{record.section?.name || "N/A"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : record.status === "late"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {record.remarks || "-"}
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/attendance/edit/${record.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No attendance records for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions by Class */}
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance by Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes && classes.length > 0 ? (
              classes.map((cls: any) => (
                <Link
                  key={cls.id}
                  href={`/dashboard/attendance/mark?class=${cls.id}`}
                >
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Click to mark attendance
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center py-4">
                No classes found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
