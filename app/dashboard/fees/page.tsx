import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FeesTable } from "@/components/fees/fees-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FeesPage() {
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

  // Fetch fee payments
  const { data: payments } = await supabase
    .from("fee_payments")
    .select(
      "*, student:students(first_name, last_name, admission_no), fee_structure:fee_structures(name)"
    )
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Calculate statistics
  const totalCollected =
    payments?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;
  const completedPayments =
    payments?.filter((p) => p.status === "completed").length || 0;
  const pendingPayments =
    payments?.filter((p) => p.status === "pending").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-1">
            Manage fee collection and payments
          </p>
        </div>
        <Link href="/dashboard/fees/collect">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Collect Fee
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{totalCollected.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingPayments}
            </div>
          </CardContent>
        </Card>
      </div>

      <FeesTable payments={payments || []} />
    </div>
  );
}
