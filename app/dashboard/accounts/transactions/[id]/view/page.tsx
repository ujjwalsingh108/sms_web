import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Hash,
  User,
} from "lucide-react";
import Link from "next/link";

type TransactionParams = {
  params: Promise<{ id: string }>;
};

export default async function TransactionViewPage({ params }: TransactionParams) {
  const resolvedParams = await params;
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

  // Fetch transaction details
  const { data: transaction } = await supabase
    .from("transactions")
    .select(
      `
      *,
      account_head:account_heads(id, name, type, description),
      created_by_user:created_by(id, email)
    `
    )
    .eq("id", resolvedParams.id)
    .eq("tenant_id", member.tenant_id)
    .single();

  if (!transaction) {
    notFound();
  }

  type AccountHead = {
    id: string;
    name: string;
    type: string;
    description?: string | null;
  };

  type CreatedByUser = {
    id: string;
    email: string;
  };

  type TransactionDetail = {
    id: string;
    transaction_date: string;
    type: string;
    amount: number;
    payment_method?: string | null;
    reference_number?: string | null;
    description?: string | null;
    created_at: string;
    account_head: AccountHead;
    created_by_user?: CreatedByUser | null;
  };

  const txn = transaction as unknown as TransactionDetail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/dashboard/accounts">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Transaction Details
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            View complete transaction information
          </p>
        </div>

        {/* Transaction Type Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              txn.type === "credit"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {txn.type === "credit" ? "Income Transaction" : "Expense Transaction"}
          </span>
        </div>

        {/* Amount Card */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Transaction Amount</p>
              <p
                className={`text-4xl md:text-6xl font-bold ${
                  txn.type === "credit"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent"
                }`}
              >
                ₹
                {Number(txn.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Basic Details */}
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transaction Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(txn.transaction_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account Head</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{txn.account_head.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Type: {txn.account_head.type.charAt(0).toUpperCase() + txn.account_head.type.slice(1)}</p>
                </div>
              </div>

              {txn.account_head.description && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{txn.account_head.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{txn.payment_method || "Not specified"}</p>
                </div>
              </div>

              {txn.reference_number && (
                <div className="flex items-start gap-3">
                  <Hash className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Reference Number</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 font-mono">{txn.reference_number}</p>
                  </div>
                </div>
              )}

              {txn.created_by_user && (
                <div className="flex items-start gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created By</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{txn.created_by_user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created At</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(txn.created_at).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {txn.description && (
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{txn.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/dashboard/accounts/transactions/${txn.id}/edit`} className="w-full sm:w-auto">
            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">Edit Transaction</Button>
          </Link>
          <Link href="/dashboard/accounts" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">Back to Accounts</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
