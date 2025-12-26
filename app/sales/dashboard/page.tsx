import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, IndianRupee, ShoppingCart, Target } from "lucide-react";
import { SalesExecutiveTransactionList } from "@/components/sales/sales-transaction-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SalesExecutive,
  SalesTransactionWithSchool,
  SalesTarget,
} from "@/lib/types/sales-executive";

export default async function SalesDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sales/login");
  }

  // Get sales executive profile
  const { data: salesExec } = (await supabase
    .from("sales_executives")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .single()) as { data: SalesExecutive | null };

  if (!salesExec) {
    redirect("/sales/login");
  }

  // Get transactions
  const { data: transactions } = (await supabase
    .from("sales_transactions")
    .select(
      `
      *,
      school:school_instances(school_name, subdomain)
    `
    )
    .eq("sales_executive_id", salesExec.id)
    .order("created_at", { ascending: false })
    .limit(10)) as { data: SalesTransactionWithSchool[] | null };

  // Get current month stats
  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const { data: currentMonthTransactions } = (await supabase
    .from("sales_transactions")
    .select("final_amount, commission_amount")
    .eq("sales_executive_id", salesExec.id)
    .gte("subscription_start_date", currentMonthStart.toISOString())) as {
    data:
      | Pick<SalesTransactionWithSchool, "final_amount" | "commission_amount">[]
      | null;
  };

  const currentMonthSales = currentMonthTransactions?.length || 0;
  const currentMonthRevenue =
    currentMonthTransactions?.reduce(
      (sum, t) => sum + (t.final_amount || 0),
      0
    ) || 0;
  const currentMonthCommission =
    currentMonthTransactions?.reduce(
      (sum, t) => sum + (t.commission_amount || 0),
      0
    ) || 0;

  // Get pending commission
  const { data: pendingCommissionData } = (await supabase
    .from("sales_transactions")
    .select("commission_amount")
    .eq("sales_executive_id", salesExec.id)
    .in("commission_status", ["pending", "approved"])) as {
    data: Pick<SalesTransactionWithSchool, "commission_amount">[] | null;
  };

  const pendingCommission =
    pendingCommissionData?.reduce(
      (sum, t) => sum + (t.commission_amount || 0),
      0
    ) || 0;

  // Get current month target
  const { data: currentTarget } = (await supabase
    .from("sales_targets")
    .select("*")
    .eq("sales_executive_id", salesExec.id)
    .gte("end_date", new Date().toISOString())
    .lte("start_date", new Date().toISOString())
    .single()) as { data: SalesTarget | null };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sales Portal
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium">
                Welcome, {salesExec.full_name} ({salesExec.employee_code})
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/sales/profile" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-10 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
                >
                  Profile
                </Button>
              </Link>
              <form
                action="/auth/signout"
                method="post"
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto h-10 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">
                Total Sales
              </CardTitle>
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                {salesExec.total_sales_count}
              </div>
              <p className="text-xs sm:text-sm text-blue-700 font-medium mt-1">
                {salesExec.active_subscriptions_count} active
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">
                Total Revenue
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-green-900">
                ₹
                {(salesExec.total_revenue_generated || 0).toLocaleString(
                  "en-IN"
                )}
              </div>
              <p className="text-xs sm:text-sm text-green-700 font-medium mt-1">
                All-time
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">
                Commission Earned
              </CardTitle>
              <IndianRupee className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-purple-900">
                ₹
                {(salesExec.total_commission_earned || 0).toLocaleString(
                  "en-IN"
                )}
              </div>
              <p className="text-xs sm:text-sm text-purple-700 font-medium mt-1">
                Paid
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-pink-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-pink-900">
                Pending Commission
              </CardTitle>
              <IndianRupee className="h-5 w-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-pink-900">
                ₹{pendingCommission.toLocaleString("en-IN")}
              </div>
              <p className="text-xs sm:text-sm text-pink-700 font-medium mt-1">
                To be paid
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Month Performance */}
        <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              This Month's Performance
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-medium text-gray-600">
              {new Date().toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
                <p className="text-sm font-semibold text-blue-700 mb-2">
                  Sales Count
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                  {currentMonthSales}
                </p>
                {currentTarget && (
                  <p className="text-xs text-blue-600 font-medium mt-2">
                    Target: {currentTarget.target_sales_count} (
                    {Math.round(
                      (currentMonthSales / currentTarget.target_sales_count) *
                        100
                    )}
                    %)
                  </p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
                <p className="text-sm font-semibold text-green-700 mb-2">
                  Revenue
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">
                  ₹{currentMonthRevenue.toLocaleString("en-IN")}
                </p>
                {currentTarget && (
                  <p className="text-xs text-green-600 font-medium mt-2">
                    Target: ₹
                    {currentTarget.target_revenue.toLocaleString("en-IN")} (
                    {Math.round(
                      (currentMonthRevenue / currentTarget.target_revenue) * 100
                    )}
                    %)
                  </p>
                )}
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
                <p className="text-sm font-semibold text-purple-700 mb-2">
                  Commission
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-900">
                  ₹{currentMonthCommission.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Tabs */}
        <Tabs defaultValue="all" className="space-y-5">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-purple-200 p-1 h-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg px-4 py-2 text-sm font-medium"
            >
              All Transactions
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg px-4 py-2 text-sm font-medium"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg px-4 py-2 text-sm font-medium"
            >
              Pending Approval
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Your latest sales transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesExecutiveTransactionList data={transactions || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Active Subscriptions
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Currently active school subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesExecutiveTransactionList
                  data={
                    transactions?.filter((t) => t.sale_status === "active") ||
                    []
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  Pending Approval
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Transactions awaiting admin approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesExecutiveTransactionList
                  data={
                    transactions?.filter(
                      (t) => t.approval_status === "pending"
                    ) || []
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
