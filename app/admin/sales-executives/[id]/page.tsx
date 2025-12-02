import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { SalesTransactionTable } from "@/components/admin/sales-transaction-table";
import { CommissionPaymentTable } from "@/components/admin/commission-payment-table";
import { DeleteSalesExecutiveButton } from "@/components/admin/delete-sales-executive-button";

export default async function SalesExecutiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Fetch sales executive
  const { data: salesExecutive } = await supabase
    .from("sales_executives")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single<any>();

  if (!salesExecutive) {
    notFound();
  }

  // Fetch transactions
  const { data: transactions } = await supabase
    .from("sales_transactions")
    .select(
      `
      *,
      school:school_instances(school_name, subdomain)
    `
    )
    .eq("sales_executive_id", id)
    .order("created_at", { ascending: false });

  // Fetch commission payments
  const { data: payments } = await supabase
    .from("commission_payments")
    .select("*")
    .eq("sales_executive_id", id)
    .order("payment_date", { ascending: false });

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    on_leave: "bg-yellow-500",
    terminated: "bg-red-500",
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            {salesExecutive.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {salesExecutive.employee_code}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href={`/admin/sales-executives/${id}/edit`}
            className="flex-1 sm:flex-none"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <DeleteSalesExecutiveButton executiveId={id} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Sales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {salesExecutive.total_sales_count}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {salesExecutive.active_subscriptions_count} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Revenue Generated
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₹
              {(salesExecutive.total_revenue_generated || 0).toLocaleString(
                "en-IN"
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Total revenue
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
              {(salesExecutive.total_commission_earned || 0).toLocaleString(
                "en-IN"
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Paid commission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Commission Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {salesExecutive.commission_type === "percentage"
                ? `${salesExecutive.commission_rate}%`
                : `₹${salesExecutive.fixed_commission_amount?.toLocaleString(
                    "en-IN"
                  )}`}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">
              {salesExecutive.commission_type}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{salesExecutive.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{salesExecutive.phone}</span>
              {salesExecutive.alternate_phone && (
                <span className="text-sm text-muted-foreground">
                  • {salesExecutive.alternate_phone}
                </span>
              )}
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p>{salesExecutive.address_line1}</p>
                {salesExecutive.address_line2 && (
                  <p>{salesExecutive.address_line2}</p>
                )}
                <p>
                  {salesExecutive.city}, {salesExecutive.state}{" "}
                  {salesExecutive.postal_code}
                </p>
                <p>{salesExecutive.country}</p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Assigned Region</p>
              <p className="font-medium">
                {salesExecutive.assigned_region || "Not assigned"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Employment Status</p>
              <Badge
                className={
                  statusColors[
                    salesExecutive.employment_status as keyof typeof statusColors
                  ]
                }
              >
                {salesExecutive.employment_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joining Date</p>
              <p className="font-medium">
                {new Date(salesExecutive.joining_date).toLocaleDateString(
                  "en-IN",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesExecutive.bank_name ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{salesExecutive.bank_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Holder
                  </p>
                  <p className="font-medium">
                    {salesExecutive.account_holder_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Number
                  </p>
                  <p className="font-medium font-mono">
                    {salesExecutive.account_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IFSC Code</p>
                  <p className="font-medium font-mono">
                    {salesExecutive.ifsc_code}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No bank details provided</p>
            )}
            {salesExecutive.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{salesExecutive.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Commission Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Transactions</CardTitle>
              <CardDescription>
                All sales made by this executive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesTransactionTable data={transactions || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Payments</CardTitle>
              <CardDescription>
                Payment history for this executive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommissionPaymentTable data={payments || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
