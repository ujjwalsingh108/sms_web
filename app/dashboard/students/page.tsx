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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student admissions and records
          </p>
        </div>
        <Link href="/dashboard/students/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Student
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Total Students
              </p>
              <p className="text-xl sm:text-2xl font-bold">{totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-bold">{activeStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
              <UserX className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Inactive
              </p>
              <p className="text-xl sm:text-2xl font-bold">
                {inactiveStudents}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Graduated
              </p>
              <p className="text-xl sm:text-2xl font-bold">
                {graduatedStudents}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Students List */}
      <StudentsListClient
        initialStudents={students || []}
        classes={classes || []}
      />
    </div>
  );
}
