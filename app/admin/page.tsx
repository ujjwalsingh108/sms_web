import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Activity, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get total schools count
  const { count: totalSchools } = await supabase
    .from("school_instances")
    .select("*", { count: "exact", head: true });

  // Get active schools count
  const { count: activeSchools } = await supabase
    .from("school_instances")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Get pending schools
  const { count: pendingSchools } = await supabase
    .from("school_instances")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Get recent schools
  const { data: recentSchools } = await supabase
    .from("school_instances")
    .select(
      `
      id,
      school_name,
      subdomain,
      status,
      created_at,
      tenant:tenants(name)
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Nescomm Admin Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Schools
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Schools
            </CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeSchools || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Setup
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingSchools || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">+12%</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Schools */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSchools && recentSchools.length > 0 ? (
              recentSchools.map((school: any) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {school.school_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {school.subdomain}.nescomm.com
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        school.status === "active"
                          ? "bg-green-100 text-green-800"
                          : school.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {school.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(school.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No schools created yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
