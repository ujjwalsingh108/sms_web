import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default async function AccountHeadsPage() {
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

  // Fetch all account heads
  const { data: accountHeads } = await supabase
    .from("account_heads")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("type", { ascending: true })
    .order("name", { ascending: true });

  type AccountHeadData = {
    id: string;
    name: string;
    type: "income" | "expense" | "asset" | "liability";
    description?: string | null;
    created_at: string;
  };

  const typedAccountHeads = (accountHeads as AccountHeadData[] | null) || [];

  // Group by type
  const incomeHeads = typedAccountHeads.filter((h) => h.type === "income");
  const expenseHeads = typedAccountHeads.filter((h) => h.type === "expense");
  const assetHeads = typedAccountHeads.filter((h) => h.type === "asset");
  const liabilityHeads = typedAccountHeads.filter(
    (h) => h.type === "liability"
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "expense":
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case "asset":
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case "liability":
        return <FileText className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "expense":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "asset":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "liability":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
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
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Account Heads
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
                Manage income, expense, asset, and liability accounts
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/accounts/account-heads/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Account Head
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Income Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {incomeHeads.length}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Expense Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                {expenseHeads.length}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Asset Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {assetHeads.length}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Liability Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                {liabilityHeads.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* All Account Heads Table */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              All Account Heads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Name
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                      Description
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                      Created
                    </th>
                    <th className="text-center p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typedAccountHeads.length > 0 ? (
                    typedAccountHeads.map((head) => (
                      <tr
                        key={head.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(head.type)}
                            <span className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">
                              {head.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                              head.type
                            )}`}
                          >
                            {head.type.charAt(0).toUpperCase() +
                              head.type.slice(1)}
                          </span>
                        </td>
                        <td className="p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                          {head.description || "-"}
                        </td>
                        <td className="p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                          {new Date(head.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <Link
                            href={`/dashboard/accounts/account-heads/${head.id}/edit`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm"
                      >
                        No account heads found. Click "Add Account Head" to
                        create your first account.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
