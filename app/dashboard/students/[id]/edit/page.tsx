import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditStudentForm } from "@/components/students/edit-student-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getStudentById, getClasses } from "../../actions";

interface EditStudentPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const { id } = await params;
  
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

  const [studentResult, classesResult] = await Promise.all([
    getStudentById(id),
    getClasses(),
  ]);

  if (!studentResult.success || !studentResult.data) {
    redirect("/dashboard/students");
  }

  const classes = classesResult.success ? classesResult.data : [];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href={`/dashboard/students/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Student Details
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Edit Student</CardTitle>
        </CardHeader>
        <CardContent>
          <EditStudentForm student={studentResult.data} classes={classes || []} />
        </CardContent>
      </Card>
    </div>
  );
}
