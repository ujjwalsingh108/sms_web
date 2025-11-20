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
  const { data: applications } = await supabase
    .from("admission_applications")
    .select("*, class:classes(name)")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(50);

  type Application = {
    status: string;
  };

  const pendingCount =
    (applications as Application[] | null)?.filter(
      (a) => a.status === "pending"
    ).length || 0;
  const approvedCount =
    (applications as Application[] | null)?.filter(
      (a) => a.status === "approved"
    ).length || 0;
  const rejectedCount =
    (applications as Application[] | null)?.filter(
      (a) => a.status === "rejected"
    ).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admission Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage student admission applications
          </p>
        </div>
        <Link href="/dashboard/admission/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Pending Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">
              {pendingCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Approved Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {approvedCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Rejected Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Application No
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Student Name
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                    Class
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                    Guardian
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Status
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                    Applied Date
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications && applications.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  applications.map((app: any) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 md:p-3 text-xs md:text-sm">
                        {app.application_no}
                      </td>
                      <td className="p-2 md:p-3 font-medium text-xs md:text-sm">
                        {app.first_name} {app.last_name}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                        {app.class?.name || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                        {app.guardian_name}
                      </td>
                      <td className="p-2 md:p-3">
                        <span
                          className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs whitespace-nowrap ${
                            app.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : app.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                        {new Date(app.applied_date).toLocaleDateString()}
                      </td>
                      <td className="p-2 md:p-3">
                        <Link href={`/dashboard/admission/${app.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No applications found
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
