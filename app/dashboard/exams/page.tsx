import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ExamsPage() {
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

  // Fetch exams
  const { data: exams } = await supabase
    .from("exams")
    .select(`
      *,
      exam_type:exam_types(name),
      academic_year:academic_years(year_name)
    `)
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(30);

  // Fetch exam types
  const { data: examTypes } = await supabase
    .from("exam_types")
    .select("*")
    .eq("tenant_id", member.tenant_id);

  type Exam = {
    status: string;
  };

  const upcomingCount =
    (exams as Exam[] | null)?.filter((e) => e.status === "upcoming").length || 0;
  const ongoingCount =
    (exams as Exam[] | null)?.filter((e) => e.status === "ongoing").length || 0;
  const completedCount =
    (exams as Exam[] | null)?.filter((e) => e.status === "completed").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Examination Management</h1>
          <p className="text-gray-600 mt-1">Manage exams, schedules, and results</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/exams/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </Link>
          <Link href="/dashboard/exams/types">
            <Button variant="outline">
              Exam Types
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {exams?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{upcomingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Ongoing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{ongoingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{completedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Exams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Examinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Exam Name</th>
                  <th className="text-left p-3">Exam Type</th>
                  <th className="text-left p-3">Academic Year</th>
                  <th className="text-left p-3">Start Date</th>
                  <th className="text-left p-3">End Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams && exams.length > 0 ? (
                  exams.map((exam: any) => (
                    <tr key={exam.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{exam.exam_name}</td>
                      <td className="p-3">{exam.exam_type?.name || "N/A"}</td>
                      <td className="p-3">{exam.academic_year?.year_name || "N/A"}</td>
                      <td className="p-3">
                        {exam.start_date
                          ? new Date(exam.start_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {exam.end_date
                          ? new Date(exam.end_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            exam.status === "upcoming"
                              ? "bg-orange-100 text-orange-800"
                              : exam.status === "ongoing"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/exams/${exam.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No exams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Exam Types */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examTypes && examTypes.length > 0 ? (
              examTypes.map((type: any) => (
                <div
                  key={type.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="font-semibold">{type.name}</h3>
                  {type.description && (
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center py-4">
                No exam types configured
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
