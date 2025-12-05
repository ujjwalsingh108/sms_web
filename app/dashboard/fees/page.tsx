import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { getFeeStructures, getFeePayments } from "./actions";
import FeesListClient from "@/components/fees/fees-list-client";

export default async function FeesPage() {
  const [structuresResult, paymentsResult] = await Promise.all([
    getFeeStructures(),
    getFeePayments(),
  ]);

  const structures = structuresResult.success ? structuresResult.data : [];
  const payments = paymentsResult.success ? paymentsResult.data : [];

  // Calculate stats
  const totalStructures = structures?.length || 0;
  const activeStructures =
    structures?.filter((s: any) => s.status === "active").length || 0;

  const totalCollected =
    payments
      ?.filter((p: any) => p.status === "completed")
      .reduce((sum: number, p: any) => sum + Number(p.amount_paid), 0) || 0;

  const pendingPayments =
    payments?.filter((p: any) => p.status === "pending").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-muted-foreground">
            Manage fee structures and student payments
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard/fees/structures/new">
              <Plus className="mr-2 h-4 w-4" />
              New Fee Structure
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/fees/payments/new">
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fee Structures
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStructures}</div>
            <p className="text-xs text-muted-foreground">
              {activeStructures} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Collected
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments?.filter((p: any) => p.status === "completed").length ||
                0}{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Payments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments?.slice(0, 30).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <FeesListClient structures={structures || []} payments={payments || []} />
    </div>
  );
}
