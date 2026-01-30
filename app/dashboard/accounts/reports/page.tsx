import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default async function AccountsReportsPage() {
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

  // Fetch all transactions
  const { data: allTransactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      account_head:account_heads(name, type)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("transaction_date", { ascending: false });

  type AccountHead = {
    name: string;
    type: string;
  };

  type Transaction = {
    id: string;
    transaction_date: string;
    type: string;
    amount: number;
    account_head: AccountHead | null;
  };

  const transactions = (allTransactions as Transaction[] | null) || [];


  // --- Use same statistics logic as accounts page ---
  const totalIncome = transactions.reduce((sum, t) => {
    return t.type === "credit" ? sum + Number(t.amount) : sum;
  }, 0);

  const totalExpense = transactions.reduce((sum, t) => {
    return t.type === "debit" ? sum + Number(t.amount) : sum;
  }, 0);

  const balance = totalIncome - totalExpense;

  // Group account heads by type (optional, for display)
  // const incomeHeads = ...
  // const expenseHeads = ...

  // Top account heads by transaction volume
  const accountHeadStats = transactions.reduce((acc, txn) => {
    if (!txn.account_head) return acc;

    const key = txn.account_head.name;
    if (!acc[key]) {
      acc[key] = {
        name: txn.account_head.name,
        type: txn.account_head.type,
        totalAmount: 0,
        transactionCount: 0,
      };
    }

    acc[key].totalAmount += Number(txn.amount);
    acc[key].transactionCount += 1;

    return acc;
  }, {} as Record<string, { name: string; type: string; totalAmount: number; transactionCount: number }>);

  const topAccountHeads = Object.values(accountHeadStats)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Monthly aggregates for insights
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prev = new Date(currentYear, currentMonth - 1);
  const prevMonth = prev.getMonth();
  const prevYear = prev.getFullYear();

  const currentMonthIncome = transactions
    .filter((t) => {
      const d = new Date(t.transaction_date);
      return (
        d.getMonth() === currentMonth && d.getFullYear() === currentYear &&
        t.type === "credit"
      );
    })
    .reduce((s, t) => s + Number(t.amount), 0);

  const previousMonthIncome = transactions
    .filter((t) => {
      const d = new Date(t.transaction_date);
      return (
        d.getMonth() === prevMonth && d.getFullYear() === prevYear &&
        t.type === "credit"
      );
    })
    .reduce((s, t) => s + Number(t.amount), 0);

  const incomeChange =
    previousMonthIncome === 0
      ? previousMonthIncome === currentMonthIncome
        ? 0
        : 100
      : ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;

  const currentMonthExpense = transactions
    .filter((t) => {
      const d = new Date(t.transaction_date);
      return (
        d.getMonth() === currentMonth && d.getFullYear() === currentYear &&
        t.type === "debit"
      );
    })
    .reduce((s, t) => s + Number(t.amount), 0);

  const previousMonthExpense = transactions
    .filter((t) => {
      const d = new Date(t.transaction_date);
      return (
        d.getMonth() === prevMonth && d.getFullYear() === prevYear &&
        t.type === "debit"
      );
    })
    .reduce((s, t) => s + Number(t.amount), 0);

  const expenseChange =
    previousMonthExpense === 0
      ? previousMonthExpense === currentMonthExpense
        ? 0
        : 100
      : ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/accounts">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Financial Reports
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
                Analyze income, expenses, and financial trends
              </p>
            </div>
          </div>
        </div>

        {/* Statistics (same as accounts page) */}
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
                {transactions.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Account Heads */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Top 10 Account Heads by Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Rank
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Account Head
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="text-right p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total Amount
                    </th>
                    <th className="text-center p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Transactions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topAccountHeads.length > 0 ? (
                    topAccountHeads.map((head, index) => (
                      <tr
                        key={head.name}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs md:text-sm font-bold">
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">
                          {head.name}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              head.type === "income"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : head.type === "expense"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : head.type === "asset"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                            }`}
                          >
                            {head.type.charAt(0).toUpperCase() +
                              head.type.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-sm md:text-base text-right text-gray-900 dark:text-gray-100">
                          ₹
                          {head.totalAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-3 text-center text-gray-700 dark:text-gray-300">
                          {head.transactionCount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm"
                      >
                        No transaction data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-green-50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Income Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Current Month:</strong> ₹
                {currentMonthIncome.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Previous Month:</strong> ₹
                {previousMonthIncome.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Change:</strong>{" "}
                <span
                  className={
                    incomeChange > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {incomeChange > 0 ? "+" : ""}
                  {incomeChange.toFixed(2)}%
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Expense Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Current Month:</strong> ₹
                {currentMonthExpense.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Previous Month:</strong> ₹
                {previousMonthExpense.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Change:</strong>{" "}
                <span
                  className={
                    expenseChange < 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {expenseChange > 0 ? "+" : ""}
                  {expenseChange.toFixed(2)}%
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
