import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TimetablePage() {
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

  // Fetch timetables
  const { data: timetables } = await supabase
    .from("timetables")
    .select(
      `
      *,
      class:classes(name),
      section:sections(name),
      subject:subjects(name),
      teacher:staff(first_name, last_name)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(50);

  // Fetch classes for quick access
  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .eq("tenant_id", member.tenant_id);

  // Get unique days count
  const uniqueDays = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timetables?.map((t: any) => t.day_of_week) || []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Timetable Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage class schedules and periods
          </p>
        </div>
        <Link href="/dashboard/timetable/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Period
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Periods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {timetables?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {uniqueDays.size}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {classes?.length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timetable View */}
      <Card>
        <CardHeader>
          <CardTitle>Class Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Day</th>
                  <th className="text-left p-3">Period</th>
                  <th className="text-left p-3">Time</th>
                  <th className="text-left p-3">Class</th>
                  <th className="text-left p-3">Section</th>
                  <th className="text-left p-3">Subject</th>
                  <th className="text-left p-3">Teacher</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timetables && timetables.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  timetables.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        {item.day_of_week === 1
                          ? "Monday"
                          : item.day_of_week === 2
                          ? "Tuesday"
                          : item.day_of_week === 3
                          ? "Wednesday"
                          : item.day_of_week === 4
                          ? "Thursday"
                          : item.day_of_week === 5
                          ? "Friday"
                          : item.day_of_week === 6
                          ? "Saturday"
                          : "Sunday"}
                      </td>
                      <td className="p-3">{item.period_number || "N/A"}</td>
                      <td className="p-3 text-sm">
                        {item.start_time} - {item.end_time}
                      </td>
                      <td className="p-3">{item.class?.name || "N/A"}</td>
                      <td className="p-3">{item.section?.name || "N/A"}</td>
                      <td className="p-3">{item.subject?.name || "N/A"}</td>
                      <td className="p-3">
                        {item.teacher
                          ? `${item.teacher.first_name} ${item.teacher.last_name}`
                          : "Not Assigned"}
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/timetable/${item.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-500">
                      No timetable entries found
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
          <CardTitle>View Timetable by Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes && classes.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              classes.map((cls: any) => (
                <Link
                  key={cls.id}
                  href={`/dashboard/timetable/view?class=${cls.id}`}
                >
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      View full timetable
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
