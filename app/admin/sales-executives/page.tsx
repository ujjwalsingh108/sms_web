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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Sales Executives
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage sales executives and track their performance
          </p>
        </div>
        <Link href="/admin/sales-executives/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Sales Executive
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Executives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {salesExecutives?.length || 0}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Active sales team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {salesExecutives?.reduce(
                (sum: number, exec: any) =>
                  sum + (exec.active_subscriptions_count || 0),
                0
              ) || 0}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₹
              {(
                salesExecutives?.reduce(
                  (sum: number, exec: any) =>
                    sum + (exec.total_revenue_generated || 0),
                  0
                ) || 0
              ).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              All-time revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Commission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₹
              {(
                salesExecutives?.reduce(
                  (sum: number, exec: any) =>
                    sum + (exec.total_commission_earned || 0),
                  0
                ) || 0
              ).toLocaleString("en-IN")}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Paid to executives
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Sales Executives</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            View and manage all sales executives in your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <SalesExecutiveTable data={salesExecutives || []} />
        </CardContent>
      </Card>
    </div>
  );
}
