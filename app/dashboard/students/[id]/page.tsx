import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentDetailView } from "@/components/students/student-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getStudentById } from "../actions";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
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

  const result = await getStudentById(id);

  if (!result.success || !result.data) {
    redirect("/dashboard/students");
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <Link href="/dashboard/students">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Button>
        </Link>
      </div>

      <StudentDetailView student={result.data} />
    </div>
  );
}
