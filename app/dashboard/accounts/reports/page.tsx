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

  // Calculate monthly statistics
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const txnDate = new Date(t.transaction_date);
    return (
      txnDate.getMonth() === currentMonth &&
      txnDate.getFullYear() === currentYear
    );
  });

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousMonthTransactions = transactions.filter((t) => {
    const txnDate = new Date(t.transaction_date);
    return (
      txnDate.getMonth() === previousMonth &&
      txnDate.getFullYear() === previousMonthYear
    );
  });

  const currentMonthIncome = currentMonthTransactions
    .filter((t) => t.type === "credit" && t.account_head?.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentMonthExpense = currentMonthTransactions
    .filter((t) => t.type === "debit" && t.account_head?.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const previousMonthIncome = previousMonthTransactions
    .filter((t) => t.type === "credit" && t.account_head?.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const previousMonthExpense = previousMonthTransactions
    .filter((t) => t.type === "debit" && t.account_head?.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const incomeChange =
    previousMonthIncome > 0
      ? ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100
      : 0;

  const expenseChange =
    previousMonthExpense > 0
      ? ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) *
        100
      : 0;

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

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/accounts">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
            Financial Reports
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Analyze income, expenses, and financial trends
          </p>
        </div>
      </div>

      {/* Current Month Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              This Month Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ₹
              {currentMonthIncome.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            {incomeChange !== 0 && (
              <p
                className={`text-xs mt-1 ${
                  incomeChange > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {incomeChange > 0 ? "+" : ""}
                {incomeChange.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              This Month Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              ₹
              {currentMonthExpense.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            {expenseChange !== 0 && (
              <p
                className={`text-xs mt-1 ${
                  expenseChange < 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {expenseChange > 0 ? "+" : ""}
                {expenseChange.toFixed(1)}% from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Net (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl md:text-3xl font-bold ${
                currentMonthIncome - currentMonthExpense >= 0
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent"
              }`}
            >
              ₹
              {(currentMonthIncome - currentMonthExpense).toLocaleString(
                "en-IN",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {monthNames[currentMonth]} {currentYear}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {currentMonthTransactions.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Account Heads */}
      <Card className="glass-effect border-0 shadow-lg">
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
        <Card className="glass-effect border-0 shadow-lg bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
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

        <Card className="glass-effect border-0 shadow-lg bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
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
  );
}
