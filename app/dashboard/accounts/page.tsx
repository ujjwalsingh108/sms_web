import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AccountsPage() {
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

  // Fetch recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      account_head:account_heads(name, type)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("transaction_date", { ascending: false })
    .limit(50);

  // Fetch account heads
  const { data: accountHeads } = await supabase
    .from("account_heads")
    .select("*")
    .eq("tenant_id", member.tenant_id);

  type AccountHead = {
    name: string;
    type: string;
  };

  type Transaction = {
    id: string;
    transaction_date: string;
    type: string;
    amount: number;
    payment_method?: string | null;
    description?: string | null;
    reference_number?: string | null;
    account_head: AccountHead | null;
  };

  type AccountHeadData = {
    id: string;
    name: string;
    type: string;
    description?: string | null;
  };

  const typedTransactions = (transactions as Transaction[] | null) || [];
  const typedAccountHeads = (accountHeads as AccountHeadData[] | null) || [];

  // Build a lookup map of account heads by id for fallback when joined data is missing
  const accountHeadMap = typedAccountHeads.reduce(
    (acc, h) => ({ ...acc, [h.id]: h }),
    {} as Record<string, AccountHeadData>
  );

  // Calculate income and expense totals directly from transactions based on type
  // 1) total income = sum of amounts where transaction.type === 'credit'
  // 2) total expense = sum of amounts where transaction.type === 'debit'
  const totalIncome = typedTransactions.reduce((sum, t) => {
    return t.type === "credit" ? sum + Number(t.amount) : sum;
  }, 0);

  const totalExpense = typedTransactions.reduce((sum, t) => {
    return t.type === "debit" ? sum + Number(t.amount) : sum;
  }, 0);

  const balance = totalIncome - totalExpense;

  // Group account heads by type
  const incomeHeads = typedAccountHeads.filter((h) => h.type === "income");
  const expenseHeads = typedAccountHeads.filter((h) => h.type === "expense");
  const assetHeads = typedAccountHeads.filter((h) => h.type === "asset");
  const liabilityHeads = typedAccountHeads.filter(
    (h) => h.type === "liability"
  );

  console.log({ typedTransactions, accountHeadMap });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
            Accounts Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage financial transactions and accounts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/dashboard/accounts/transactions/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
          <Link
            href="/dashboard/accounts/account-heads"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:opacity-90 shadow-lg">
              Account Heads
            </Button>
          </Link>
          <Link href="/dashboard/accounts/reports" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 shadow-lg">
              Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-6">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ₹
              {totalIncome.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {incomeHeads.length} income heads
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              ₹
              {totalExpense.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {expenseHeads.length} expense heads
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl md:text-4xl font-bold ${
                balance >= 0
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent"
              }`}
            >
              ₹
              {balance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {balance >= 0 ? "Surplus" : "Deficit"}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {typedTransactions.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Last 50 records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Account Head
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Type
                  </th>
                  <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Amount
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                    Payment Method
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {typedTransactions.length > 0 ? (
                  typedTransactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        {new Date(txn.transaction_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-2 md:p-3 font-medium text-xs md:text-sm text-gray-900 dark:text-gray-100">
                        {txn.account_head?.name || "N/A"}
                      </td>
                      <td className="p-2 md:p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            txn.type === "credit"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {txn.type === "credit" ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td className="p-2 md:p-3 font-semibold text-xs md:text-sm text-right text-gray-900 dark:text-gray-100">
                        ₹
                        {Number(txn.amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell capitalize">
                        {txn.payment_method || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell truncate max-w-xs">
                        {txn.description || "-"}
                      </td>
                      <td className="p-2 md:p-3 text-center">                        
                        <Link
                          href={`/dashboard/accounts/transactions/${txn.id}/view`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm"
                    >
                      No transactions found. Click "Add Transaction" to create
                      your first entry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Account Heads by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Income Accounts */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Income Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {incomeHeads.length > 0 ? (
                incomeHeads.map((head) => (
                  <div
                    key={head.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                          {head.name}
                        </h3>
                        {head.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {head.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Income
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  No income accounts configured
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expense Accounts */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Expense Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenseHeads.length > 0 ? (
                expenseHeads.map((head) => (
                  <div
                    key={head.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                          {head.name}
                        </h3>
                        {head.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {head.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Expense
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  No expense accounts configured
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Asset Accounts */}
        {assetHeads.length > 0 && (
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Asset Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assetHeads.map((head) => (
                  <div
                    key={head.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                          {head.name}
                        </h3>
                        {head.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {head.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Asset
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liability Accounts */}
        {liabilityHeads.length > 0 && (
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                Liability Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {liabilityHeads.map((head) => (
                  <div
                    key={head.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                          {head.name}
                        </h3>
                        {head.description && (
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {head.description}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                        Liability
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
