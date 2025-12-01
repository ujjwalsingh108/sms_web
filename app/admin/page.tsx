import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Activity,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      subscription_plan,
      created_at,
      tenant:tenants(name, email)
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  // Get recent activity logs
  const { data: recentActivity } = await supabase
    .from("admin_activity_logs")
    .select(
      `
      id,
      action,
      resource_type,
      created_at,
      admin_user_id
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Welcome to Nescomm Admin Portal"
        user={user}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Schools
              </CardTitle>
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSchools || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                All registered schools
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Schools
              </CardTitle>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeSchools || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Currently operational
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Setup
              </CardTitle>
              <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingSchools || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting configuration
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Growth
              </CardTitle>
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">+12%</div>
              <p className="text-xs text-gray-500 mt-1">vs last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Schools */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Schools</CardTitle>
              <Link href="/admin/schools">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentSchools && recentSchools.length > 0 ? (
                <div className="space-y-3">
                  {recentSchools.map((school: any) => (
                    <div
                      key={school.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {school.school_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {school.subdomain}.smartschoolerp.xyz
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            school.status === "active"
                              ? "bg-green-100 text-green-800"
                              : school.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {school.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {school.subscription_plan}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(school.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No schools created yet</p>
                  <Link href="/admin/schools/new">
                    <Button className="mt-4">Create First School</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
