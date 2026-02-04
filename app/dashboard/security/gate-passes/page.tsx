import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";

export default async function GatePassesPage() {
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

  // Fetch all gate passes with student/staff info
  const { data: gatePasses } = await supabase
    .from("gate_passes")
    .select(
      `
      *,
      student:student_id(id, first_name, last_name, admission_no),
      staff:staff_id(id, first_name, last_name, employee_id)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .is("is_deleted", false)
    .order("created_at", { ascending: false });

  type Student = {
    id: string;
    first_name: string;
    last_name: string;
    admission_no: string;
  };

  type Staff = {
    id: string;
    first_name: string;
    last_name: string;
    employee_id: string;
  };

  type GatePass = {
    id: string;
    pass_date: string;
    exit_time: string;
    expected_return_time: string | null;
    actual_return_time: string | null;
    reason: string | null;
    status: string;
    created_at: string;
    student: Student | null;
    staff: Staff | null;
  };

  const typedGatePasses = (gatePasses as GatePass[] | null) || [];

  // Calculate statistics
  const pendingPasses = typedGatePasses.filter(
    (p) => p.status === "pending"
  ).length;
  const approvedPasses = typedGatePasses.filter(
    (p) => p.status === "approved"
  ).length;
  const rejectedPasses = typedGatePasses.filter(
    (p) => p.status === "rejected"
  ).length;
  const returnedPasses = typedGatePasses.filter(
    (p) => p.status === "returned"
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "returned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />;
      case "pending":
        return <Clock className="h-3 w-3 md:h-4 md:w-4" />;
      case "rejected":
        return <XCircle className="h-3 w-3 md:h-4 md:w-4" />;
      case "returned":
        return <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/security">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gate Passes
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage student and staff exit permissions
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/security/gate-passes/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Issue Gate Pass
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {pendingPasses}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {approvedPasses}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <XCircle className="h-3 w-3 md:h-4 md:w-4" />
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {rejectedPasses}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Returned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {returnedPasses}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gate Passes Table */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              All Gate Passes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Issued Date
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Person
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                      Type
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                      Purpose
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                      Exit Date
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-center p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typedGatePasses.length > 0 ? (
                    typedGatePasses.map((pass) => (
                      <tr
                        key={pass.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                          {new Date(pass.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {pass.student
                              ? `${pass.student.first_name} ${pass.student.last_name}`
                              : pass.staff
                              ? `${pass.staff.first_name} ${pass.staff.last_name}`
                              : "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {pass.student
                              ? `Student - ${pass.student.admission_no}`
                              : pass.staff
                              ? `Staff - ${pass.staff.employee_id}`
                              : ""}
                          </div>
                        </td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell capitalize">
                          {pass.exit_time || "N/A"}
                        </td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell max-w-xs truncate">
                          {pass.reason || "N/A"}
                        </td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                          {pass.pass_date
                            ? new Date(pass.pass_date).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${getStatusColor(
                              pass.status
                            )}`}
                          >
                            {getStatusIcon(pass.status)}
                            {pass.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Link
                            href={`/dashboard/security/gate-passes/${pass.id}`}
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
                        No gate passes found. Click &quot;Issue Gate Pass&quot;
                        to create your first gate pass.
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
