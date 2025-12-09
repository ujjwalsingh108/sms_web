import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MessPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select(
      `
      *,
      role:role_id(id, name, display_name),
      tenant:tenant_id(id, name, email)
    `
    )
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as { tenant_id: string } | undefined;

  if (!member) {
    redirect("/login");
  }

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Fetch mess menus
  const { data: menus } = await supabase
    .from("mess_menus")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("menu_date", { ascending: false })
    .limit(30);

  // Fetch mess attendance
  const { data: attendance } = await supabase
    .from("mess_attendance")
    .select(
      `
      *,
      student:students(first_name, last_name, roll_number)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .eq("attendance_date", today)
    .limit(50);

  // Fetch mess feedback
  const { data: feedback } = await supabase
    .from("mess_feedback")
    .select(
      `
      *,
      student:students(first_name, last_name)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("feedback_date", { ascending: false })
    .limit(20);

  type Attendance = {
    meal_type: string;
  };

  const breakfastCount =
    (attendance as Attendance[] | null)?.filter(
      (a) => a.meal_type === "breakfast"
    ).length || 0;
  const lunchCount =
    (attendance as Attendance[] | null)?.filter((a) => a.meal_type === "lunch")
      .length || 0;
  const dinnerCount =
    (attendance as Attendance[] | null)?.filter((a) => a.meal_type === "dinner")
      .length || 0;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
            Mess Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage mess menus, attendance, and feedback
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link href="/dashboard/mess/menus/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu
            </Button>
          </Link>
          <Link
            href="/dashboard/mess/attendance/mark"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-6">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Today&apos;s Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {attendance?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Breakfast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {breakfastCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Lunch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{lunchCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Dinner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{dinnerCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mess Menus */}
      <Card>
        <CardHeader>
          <CardTitle>Mess Menus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Meal Type</th>
                  <th className="text-left p-3">Menu Items</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menus && menus.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  menus.map((menu: any) => (
                    <tr key={menu.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(menu.menu_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 capitalize">
                        {menu.meal_type || "N/A"}
                      </td>
                      <td className="p-3 text-sm max-w-md truncate">
                        {menu.menu_items || "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            menu.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {menu.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/mess/menus/${menu.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      No menus found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Mess Attendance ({today})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Roll Number</th>
                  <th className="text-left p-3">Student Name</th>
                  <th className="text-left p-3">Meal Type</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendance && attendance.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  attendance.map((record: any) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono">
                        {record.student?.roll_number || "N/A"}
                      </td>
                      <td className="p-3 font-medium">
                        {record.student
                          ? `${record.student.first_name} ${record.student.last_name}`
                          : "N/A"}
                      </td>
                      <td className="p-3 capitalize">
                        {record.meal_type || "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            record.is_present
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.is_present ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {record.remarks || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      No attendance records for today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedback && feedback.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              feedback.map((fb: any) => (
                <div
                  key={fb.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        {fb.student
                          ? `${fb.student.first_name} ${fb.student.last_name}`
                          : "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(fb.feedback_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Rating:{" "}
                        <span className="font-semibold">
                          {fb.rating || "N/A"}/5
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {fb.comments || "No comments"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No feedback found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
