import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesExecutiveTable } from "@/components/admin/sales-executive-table";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function SalesExecutivesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user is superadmin
  const { data: member } = await supabase
    .from("members")
    .select("role:roles(name)")
    .eq("user_id", user.id)
    .single<{ role: { name: string } }>();

  if (!member || member.role?.name !== "superadmin") {
    redirect("/");
  }

  // Fetch sales executives
  const { data: salesExecutives } = await (
    supabase.from("sales_executive_dashboard") as any
  )
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="Sales Executives"
        description="Manage sales executives and track their performance"
        user={user}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/admin/sales-executives/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Add Sales Executive
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">
                Total Executives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                {salesExecutives?.length || 0}
              </div>
              <p className="text-xs sm:text-sm text-blue-700 font-medium mt-1">
                Active sales team
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-green-900">
                {salesExecutives?.reduce(
                  (sum: number, exec: any) =>
                    sum + (exec.active_subscriptions_count || 0),
                  0
                ) || 0}
              </div>
              <p className="text-xs sm:text-sm text-green-700 font-medium mt-1">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-purple-900">
                ₹
                {(
                  salesExecutives?.reduce(
                    (sum: number, exec: any) =>
                      sum + (exec.total_revenue_generated || 0),
                    0
                  ) || 0
                ).toLocaleString("en-IN")}
              </div>
              <p className="text-xs sm:text-sm text-purple-700 font-medium mt-1">
                All-time revenue
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-pink-100/50 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-pink-900">
                Total Commission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-pink-900">
                ₹
                {(
                  salesExecutives?.reduce(
                    (sum: number, exec: any) =>
                      sum + (exec.total_commission_earned || 0),
                    0
                  ) || 0
                ).toLocaleString("en-IN")}
              </div>
              <p className="text-xs sm:text-sm text-pink-700 font-medium mt-1">
                Paid to executives
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              Sales Executives
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-medium text-gray-600">
              View and manage all sales executives in your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <SalesExecutiveTable data={salesExecutives || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
