import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AdmissionPage() {
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

  // Fetch admission applications
  const { data: applications, error: fetchError } = await supabase
    .from("admission_applications")
    .select("*, class:classes!admission_applications_class_id_fkey(name)")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (fetchError) {
    console.error("Error fetching applications:", fetchError);
  }

  type Application = {
    id: string;
    application_no: string;
    first_name: string;
    last_name: string;
    status: string;
    guardian_name: string;
    applied_date: string;
    class: { name: string } | null;
  };

  const typedApplications = (applications as Application[] | null) || [];

  const pendingCount = typedApplications.filter(
    (a) => a.status === "pending"
  ).length;
  const approvedCount = typedApplications.filter(
    (a) => a.status === "approved"
  ).length;
  const rejectedCount = typedApplications.filter(
    (a) => a.status === "rejected"
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Admission Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage student admission applications
          </p>
        </div>
        <Link href="/dashboard/admission/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-6">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Pending Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
              {pendingCount}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Approved Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {approvedCount}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Rejected Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              {rejectedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Application No
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Student Name
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                    Class
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    Guardian
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                    Applied Date
                  </th>
                  <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {typedApplications.length > 0 ? (
                  typedApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-2 md:p-3 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">
                        {app.application_no}
                      </td>
                      <td className="p-2 md:p-3 font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                        {app.class?.name || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {app.guardian_name}
                      </td>
                      <td className="p-2 md:p-3">
                        <span
                          className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap ${
                            app.status === "pending"
                              ? "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 dark:from-orange-900/30 dark:to-yellow-900/30 dark:text-orange-400"
                              : app.status === "approved"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                              : "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                        {new Date(app.applied_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-2 md:p-3">
                        <Link href={`/dashboard/admission/${app.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm"
                    >
                      No applications found. Click "New Application" to create
                      one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
