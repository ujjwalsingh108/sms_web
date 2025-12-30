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

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">
                Total Schools
              </CardTitle>
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                {totalSchools || 0}
              </div>
              <p className="text-xs sm:text-sm text-blue-700 font-medium mt-1">
                All registered schools
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">
                Active Schools
              </CardTitle>
              <div className="h-10 w-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-green-900">
                {activeSchools || 0}
              </div>
              <p className="text-xs sm:text-sm text-green-700 font-medium mt-1">
                Currently operational
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-orange-900">
                Pending Setup
              </CardTitle>
              <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-orange-900">
                {pendingSchools || 0}
              </div>
              <p className="text-xs sm:text-sm text-orange-700 font-medium mt-1">
                Awaiting configuration
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">
                Growth
              </CardTitle>
              <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-purple-900">
                +12%
              </div>
              <p className="text-xs sm:text-sm text-purple-700 font-medium mt-1">
                vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Schools */}
          <Card className="lg:col-span-2 border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Recent Schools
              </CardTitle>
              <Link href="/admin/schools">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-blue-50 transition-colors"
                >
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentSchools && recentSchools.length > 0 ? (
                <div className="space-y-3">
                  {recentSchools.map((school: any) => (
                    <Link 
                      key={school.id}
                      href={`/admin/schools/${school.id}/edit`}
                    >
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-blue-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 gap-3 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {school.school_name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {school.subdomain}.smartschoolerp.xyz
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                              school.status === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : school.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {school.status}
                          </span>
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 shadow-sm">
                            {school.subscription_plan}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(school.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium mb-4">
                    No schools created yet
                  </p>
                  <Link href="/admin/schools/new">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                      Create First School
                    </Button>
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
