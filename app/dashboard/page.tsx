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
    <div className="space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 glass-effect shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5"></div>
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2 font-medium">
            Welcome back, {user.user_metadata.full_name || user.email} 👋
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
              {member.role.display_name}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
              {member.tenant.name}
            </span>
          </div>
        </div>
      </div>

      <DashboardStats tenantId={member.tenant_id} role={member.role.name} />

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <RecentActivity tenantId={member.tenant_id} />
      </div>
    </div>
  );
}
