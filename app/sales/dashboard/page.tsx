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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Sales Portal</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Welcome, {salesExec.full_name} ({salesExec.employee_code})
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href="/sales/profile" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full sm:w-auto">
                  Profile
                </Button>
              </Link>
              <form
                action="/auth/signout"
                method="post"
                className="flex-1 sm:flex-none"
              >
                <Button variant="ghost" className="w-full sm:w-auto">
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Sales
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {salesExec.total_sales_count}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {salesExec.active_subscriptions_count} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹
                {(salesExec.total_revenue_generated || 0).toLocaleString(
                  "en-IN"
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                All-time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Commission Earned
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹
                {(salesExec.total_commission_earned || 0).toLocaleString(
                  "en-IN"
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Pending Commission
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ₹{pendingCommission.toLocaleString("en-IN")}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                To be paid
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Month Performance */}
        <Card>
          <CardHeader>
            <CardTitle>This Month's Performance</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sales Count
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {currentMonthSales}
                </p>
                {currentTarget && (
                  <p className="text-xs text-muted-foreground">
                    Target: {currentTarget.target_sales_count} (
                    {Math.round(
                      (currentMonthSales / currentTarget.target_sales_count) *
                        100
                    )}
                    %)
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Revenue
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  ₹{currentMonthRevenue.toLocaleString("en-IN")}
                </p>
                {currentTarget && (
                  <p className="text-xs text-muted-foreground">
                    Target: ₹
                    {currentTarget.target_revenue.toLocaleString("en-IN")} (
                    {Math.round(
                      (currentMonthRevenue / currentTarget.target_revenue) * 100
                    )}
                    %)
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Commission
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  ₹{currentMonthCommission.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest sales transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesExecutiveTransactionList data={transactions || []} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>
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
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval</CardTitle>
                <CardDescription>
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
