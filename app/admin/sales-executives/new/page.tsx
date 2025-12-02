import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateSalesExecutiveForm } from "@/components/admin/create-sales-executive-form";

export default async function NewSalesExecutivePage() {
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

  // Get list of sales executives for manager selection
  const { data: managers } = await supabase
    .from("sales_executives")
    .select("id, full_name, employee_code")
    .eq("is_deleted", false)
    .order("full_name");

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
          Add Sales Executive
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Create a new sales executive account
        </p>
      </div>

      <CreateSalesExecutiveForm managers={managers || []} />
    </div>
  );
}
