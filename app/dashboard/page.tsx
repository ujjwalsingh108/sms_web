import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's member record
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

  if (!members || members.length === 0) {
    redirect("/login");
  }

  const member = members[0] as {
    tenant_id: string;
    role: { id: string; name: string; display_name: string };
    tenant: { id: string; name: string; email: string };
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Welcome back, {user.user_metadata.full_name || user.email}
        </p>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5">
          Role: {member.role.display_name} | Organization: {member.tenant.name}
        </p>
      </div>

      <DashboardStats tenantId={member.tenant_id} role={member.role.name} />

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <RecentActivity tenantId={member.tenant_id} />
      </div>
    </div>
  );
}
