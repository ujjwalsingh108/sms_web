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

  type Transaction = {
    transaction_type: string;
    amount: number;
  };

  const totalIncome =
    (transactions as Transaction[] | null)
      ?.filter((t) => t.transaction_type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpense =
    (transactions as Transaction[] | null)
      ?.filter((t) => t.transaction_type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Accounts Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage financial transactions and accounts
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/dashboard/accounts/transactions/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
          <Link
            href="/dashboard/accounts/account-heads"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              Account Heads
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              ₹{totalIncome.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Total Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-red-600">
              ₹{totalExpense.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl md:text-3xl font-bold ${
                balance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              ₹{balance.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Date
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Account Head
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Type
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Amount
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                    Payment Method
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions && transactions.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  transactions.map((txn: any) => (
                    <tr key={txn.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 md:p-3 text-xs md:text-sm">
                        {new Date(txn.transaction_date).toLocaleDateString()}
                      </td>
                      <td className="p-2 md:p-3 font-medium text-xs md:text-sm">
                        {txn.account_head?.name || "N/A"}
                      </td>
                      <td className="p-2 md:p-3">
                        <span
                          className={`px-1.5 md:px-2 py-1 rounded text-xs ${
                            txn.transaction_type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {txn.transaction_type}
                        </span>
                      </td>
                      <td className="p-2 md:p-3 font-semibold text-xs md:text-sm">
                        ₹{txn.amount}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                        {txn.payment_method || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                        {txn.description || "-"}
                      </td>
                      <td className="p-2 md:p-3">
                        <Link
                          href={`/dashboard/accounts/transactions/${txn.id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
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
                      className="text-center p-8 text-gray-500 text-sm"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Account Heads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Account Heads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {accountHeads && accountHeads.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              accountHeads.map((head: any) => (
                <div
                  key={head.id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{head.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {head.type === "income" ? "Income" : "Expense"} Account
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        head.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {head.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-2 text-center py-4">
                No account heads configured
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
