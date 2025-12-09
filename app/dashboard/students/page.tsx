import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentsListClient } from "@/components/students/students-list-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudents, getClasses } from "./actions";
import { Users, UserCheck, UserX, GraduationCap, Plus } from "lucide-react";
import Link from "next/link";

export default async function StudentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "approved");

  if (!members || members.length === 0) {
    redirect("/login");
  }

  // Fetch students and classes
  const [studentsResult, classesResult] = await Promise.all([
    getStudents(),
    getClasses(),
  ]);

  const students = studentsResult.success ? studentsResult.data : [];
  const classes = classesResult.success ? classesResult.data : [];

  // Calculate stats
  const totalStudents = students?.length || 0;
  const activeStudents =
    students?.filter((s: any) => s.status === "active").length || 0;
  const inactiveStudents =
    students?.filter((s: any) => s.status === "inactive").length || 0;
  const graduatedStudents =
    students?.filter((s: any) => s.status === "graduated").length || 0;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage student admissions and records
          </p>
        </div>
        <Link href="/dashboard/students/new">
          <Button className="w-full sm:w-auto primary-gradient text-white hover:opacity-90 shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            New Student
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 sm:p-6 stat-card-hover glass-effect border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl primary-gradient">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Total Students
              </p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {totalStudents}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 stat-card-hover glass-effect border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl success-gradient">
              <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Active
              </p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {activeStudents}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 stat-card-hover glass-effect border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl danger-gradient">
              <UserX className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Inactive
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
                {inactiveStudents}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 stat-card-hover glass-effect border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Graduated
              </p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {graduatedStudents}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Students List */}
      <div className="glass-effect border-0 shadow-lg rounded-xl">
        <StudentsListClient
          initialStudents={students || []}
          classes={classes || []}
        />
      </div>
    </div>
  );
}
