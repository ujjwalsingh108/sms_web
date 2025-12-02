import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EditSalesExecutiveForm } from "@/components/admin/edit-sales-executive-form";

export default async function EditSalesExecutivePage({
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
    redirect("/login");
  }

  // Check if user is superadmin
  const { data: member } = await supabase
    .from("members")
    .select("role:roles(name)")
    .eq("user_id", user.id)
    .single<{ role: { name: string } }>();

  if (!member || member.role?.name !== "superadmin") {
    redirect("/");
  }

  // Fetch sales executive
  const { data: salesExecutive } = await supabase
    .from("sales_executives")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (!salesExecutive) {
    notFound();
  }

  // Get list of sales executives for manager selection
  const { data: managers } = await supabase
    .from("sales_executives")
    .select("id, full_name, employee_code")
    .eq("is_deleted", false)
    .neq("id", id)
    .order("full_name");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
          Edit Sales Executive
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Update sales executive information
        </p>
      </div>

      <EditSalesExecutiveForm
        salesExecutive={salesExecutive}
        managers={managers || []}
      />
    </div>
  );
}
