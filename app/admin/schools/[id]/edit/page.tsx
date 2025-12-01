import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { EditSchoolForm } from "@/components/admin/edit-school-form";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditSchoolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get school details
  const { data: school, error } = await supabase
    .from("school_instances")
    .select(
      `
      id,
      school_name,
      subdomain,
      status,
      subscription_plan,
      max_students,
      max_staff,
      setup_completed,
      tenant_id,
      tenant:tenants(name, email, phone, address)
    `
    )
    .eq("id", id)
    .single();

  if (error || !school) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AdminHeader title="Edit School" description="Update school details" />

      <div className="max-w-2xl mt-6">
        <Link href="/admin/schools">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schools
          </Button>
        </Link>

        <EditSchoolForm school={school} />
      </div>
    </div>
  );
}
