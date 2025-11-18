import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StudentsTable } from "@/components/students/students-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  // Fetch students
  const { data: students } = await supabase
    .from("students")
    .select("*, class:classes(name), section:sections(name)")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage student records</p>
        </div>
        <Link href="/dashboard/students/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </Link>
      </div>

      <StudentsTable students={students || []} />
    </div>
  );
}
