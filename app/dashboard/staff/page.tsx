import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function StaffPage() {
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

  // Fetch staff
  const { data: staffList } = await supabase
    .from("staff")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(50);

  type Staff = {
    status: string;
  };

  const activeCount =
    (staffList as Staff[] | null)?.filter((s) => s.status === "active")
      .length || 0;
  const inactiveCount =
    (staffList as Staff[] | null)?.filter((s) => s.status === "inactive")
      .length || 0;

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Staff Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage school staff and employees
          </p>
        </div>
        <Link href="/dashboard/staff/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {staffList?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Inactive Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-600">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Staff Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Employee ID
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Name
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                    Designation
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                    Department
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                    Email
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden xl:table-cell">
                    Phone
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Status
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffList && staffList.length > 0 ? (
                  staffList.map((staff: any) => (
                    <tr key={staff.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">
                        {staff.employee_id}
                      </td>
                      <td className="p-3 font-medium">
                        {staff.first_name} {staff.last_name}
                      </td>
                      <td className="p-3">{staff.designation || "N/A"}</td>
                      <td className="p-3">{staff.department || "N/A"}</td>
                      <td className="p-3">{staff.email}</td>
                      <td className="p-3">{staff.phone || "N/A"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            staff.status === "active"
                              ? "bg-green-100 text-green-800"
                              : staff.status === "on_leave"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/staff/${staff.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-500">
                      No staff members found
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
