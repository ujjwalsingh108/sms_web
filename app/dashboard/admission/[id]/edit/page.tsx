import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { AdmissionForm } from "@/components/admission/admission-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdmissionPage({ params }: PageProps) {
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

  // Fetch application details
  const { data: application } = await supabase
    .from("admission_applications")
    .select(
      `
      *,
      class:applied_class_id(id, name),
      academic_year:academic_year_id(id, name)
    `
    )
    .eq("id", id)
    .eq("tenant_id", member.tenant_id)
    .single();

  if (!application) {
    notFound();
  }

  // Fetch classes for dropdown
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .eq("tenant_id", member.tenant_id)
    .order("name");

  // Fetch academic years for dropdown
  const { data: academicYears } = await supabase
    .from("academic_years")
    .select("id, name, is_current")
    .eq("tenant_id", member.tenant_id)
    .order("start_date", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start gap-4">
          <Link href={`/dashboard/admission/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Admission Application
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              Update admission application details
            </p>
          </div>
        </div>

        <AdmissionForm
          classes={classes || []}
          academicYears={academicYears || []}
          tenantId={member.tenant_id}
          initialData={application}
        />
      </div>
    </div>
  );
}
