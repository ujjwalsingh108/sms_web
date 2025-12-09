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
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Fee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage fee structures and student payments
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            asChild
            className="success-gradient text-white hover:opacity-90 shadow-lg"
          >
            <Link href="/dashboard/fees/structures/new">
              <Plus className="mr-2 h-4 w-4" />
              New Fee Structure
            </Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 shadow-lg"
          >
            <Link href="/dashboard/fees/payments/new">
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fee Structures
            </CardTitle>
            <div className="p-2 rounded-lg success-gradient">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {totalStructures}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {activeStructures} active
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Collected
            </CardTitle>
            <div className="p-2 rounded-lg primary-gradient">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ₹{totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {payments?.filter((p: any) => p.status === "completed").length ||
                0}{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pending Payments
            </CardTitle>
            <div className="p-2 rounded-lg warning-gradient">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
              {pendingPayments}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recent Payments
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              {payments?.slice(0, 30).length || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="glass-effect border-0 shadow-lg rounded-xl">
        <FeesListClient
          structures={structures || []}
          payments={payments || []}
        />
      </div>
    </div>
  );
}
