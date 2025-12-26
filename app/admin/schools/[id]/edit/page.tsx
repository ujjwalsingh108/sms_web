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
    <div>
      <AdminHeader
        title="Edit School"
        description="Update school details"
        user={user}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/schools">
            <Button variant="outline" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
          </Link>

          <EditSchoolForm school={school} />
        </div>
      </div>
    </div>
  );
}
