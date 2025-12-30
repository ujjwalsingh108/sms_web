import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  Calendar,
} from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get schools by status
  const { data: schoolsData } = await supabase
    .from("school_instances")
    .select("status");

  const schoolsByStatus: Record<string, number> = {};
  schoolsData?.forEach((school: { status: string }) => {
    schoolsByStatus[school.status] = (schoolsByStatus[school.status] || 0) + 1;
  });

  // Get schools by subscription plan
  const { data: plansData } = await supabase
    .from("school_instances")
    .select("subscription_plan");

  const schoolsByPlan: Record<string, number> = {};
  plansData?.forEach((school: { subscription_plan: string }) => {
    schoolsByPlan[school.subscription_plan] =
      (schoolsByPlan[school.subscription_plan] || 0) + 1;
  });

  // Get monthly growth (schools created in last 6 months)
  const monthlyGrowth: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const { count } = await supabase
      .from("school_instances")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString())
      .lte("created_at", monthEnd.toISOString());

    monthlyGrowth.push({
      month: date.toLocaleDateString("en-US", { month: "short" }),
      count: count || 0,
    });
  }

  return (
    <div>
      <AdminHeader
        title="Analytics"
        description="Insights and trends across all schools"
        user={user}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">
                Total Revenue
              </CardTitle>
              <div className="h-10 w-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-green-900">
                ₹0
              </div>
              <p className="text-xs sm:text-sm text-green-700 font-medium mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">
                Monthly Active
              </CardTitle>
              <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                {schoolsByStatus.active || 0}
              </div>
              <p className="text-xs sm:text-sm text-blue-700 font-medium mt-1">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">
                Avg. Setup Time
              </CardTitle>
              <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-purple-900">
                2.5 days
              </div>
              <p className="text-xs sm:text-sm text-purple-700 font-medium mt-1">
                Average
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-orange-900">
                Retention Rate
              </CardTitle>
              <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-orange-900">
                98%
              </div>
              <p className="text-xs sm:text-sm text-orange-700 font-medium mt-1">
                Last 6 months
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schools by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Schools by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schoolsByStatus &&
                  Object.entries(schoolsByStatus).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            status === "active"
                              ? "bg-green-500"
                              : status === "pending"
                              ? "bg-orange-500"
                              : status === "suspended"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="text-sm font-medium capitalize">
                          {status}
                        </span>
                      </div>
                      <div className="text-sm font-bold">{count as number}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Schools by Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schoolsByPlan &&
                  Object.entries(schoolsByPlan).map(([plan, count]) => (
                    <div
                      key={plan}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            plan === "premium"
                              ? "bg-purple-500"
                              : plan === "standard"
                              ? "bg-blue-500"
                              : plan === "basic"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="text-sm font-medium capitalize">
                          {plan}
                        </span>
                      </div>
                      <div className="text-sm font-bold">{count as number}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Growth */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlyGrowth.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="text-xs font-medium text-gray-900">
                      {data.count}
                    </div>
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                      style={{
                        height: `${
                          (data.count /
                            Math.max(...monthlyGrowth.map((m) => m.count), 1)) *
                          200
                        }px`,
                        minHeight: data.count > 0 ? "20px" : "4px",
                      }}
                    />
                    <div className="text-xs text-gray-600">{data.month}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
