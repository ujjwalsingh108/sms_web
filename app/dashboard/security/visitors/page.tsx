import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, LogIn, LogOut, Clock } from "lucide-react";

export default async function VisitorsPage() {
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

  const { data: visitors } = await supabase
    .from("visitors")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .is("is_deleted", false)
    .order("check_in_time", { ascending: false })
    .limit(100);

  // Calculate statistics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkedInVisitors =
    visitors?.filter((v: any) => v.status === "checked_in").length || 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkedOutVisitors =
    visitors?.filter((v: any) => v.status === "checked_out").length || 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const todayVisitors =
    visitors?.filter((v: any) => {
      const checkInDate = new Date(v.check_in_time).toDateString();
      const today = new Date().toDateString();
      return checkInDate === today;
    }).length || 0;
  const totalVisitors = visitors?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/security">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Visitor Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage visitor check-ins and logs
              </p>
            </div>
          </div>
          <Link href="/dashboard/security/visitors/new">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <UserPlus className="mr-2 h-4 w-4" />
              Log New Visitor
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-300">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <LogIn className="h-4 w-4 text-green-600" />
                Checked In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {checkedInVisitors}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <LogOut className="h-4 w-4 text-blue-600" />
                Checked Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {checkedOutVisitors}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Today&apos;s Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {todayVisitors}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {totalVisitors}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visitors Table */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Visitors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Visitor Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Purpose
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                      Phone
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                      Check-in
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                      Check-out
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visitors && visitors.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    visitors.map((visitor: any) => (
                      <tr
                        key={visitor.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-4">
                          <span className="text-sm font-medium">
                            {new Date(visitor.visit_date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {visitor.visitor_name}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {visitor.purpose || "N/A"}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {visitor.phone || "N/A"}
                          </span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                            {visitor.check_in_time || "N/A"}
                          </span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          {visitor.check_out_time ? (
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                              {visitor.check_out_time}
                            </span>
                          ) : (
                            <span className="text-sm text-orange-600 font-semibold">
                              In Campus
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              visitor.status === "checked_in"
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
                            }`}
                          >
                            {visitor.status === "checked_in" ? (
                              <LogIn className="h-3 w-3" />
                            ) : (
                              <LogOut className="h-3 w-3" />
                            )}
                            {visitor.status === "checked_in"
                              ? "Checked In"
                              : "Checked Out"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/security/visitors/${visitor.id}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300"
                              >
                                View
                              </Button>
                            </Link>
                            <Link
                              href={`/dashboard/security/visitors/${visitor.id}/edit`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 transition-all duration-300"
                              >
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center p-8 text-gray-500 dark:text-gray-400"
                      >
                        No visitor records found
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
