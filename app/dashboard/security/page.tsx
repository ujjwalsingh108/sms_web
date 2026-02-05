import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function SecurityPage() {
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

  // Fetch security incidents
  const { data: incidents } = await supabase
    .from("security_incidents")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("incident_date", { ascending: false })
    .limit(30);

  // Fetch gate passes
  const { data: gatePasses } = await supabase
    .from("gate_passes")
    .select(
      `
      *,
      student:student_id(first_name, last_name, admission_no),
      staff:staff_id(first_name, last_name, employee_id)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .is("is_deleted", false)
    .order("pass_date", { ascending: false })
    .limit(30);

  // Fetch visitors - ordered by check-in time, most recent first
  const { data: allVisitors } = await supabase
    .from("visitors")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .is("is_deleted", false)
    .order("check_in_time", { ascending: false })
    .limit(20);

  // Filter today's visitors
  const today = new Date().toDateString();
  const todayVisitors = (allVisitors as unknown as any[])?.filter((v) => {
    const visitorDate = new Date(v.check_in_time).toDateString();
    return visitorDate === today;
  }) || [];

  // Filter active (checked-in) visitors
  const activeVisitors = todayVisitors.filter(
    (v) => v.status === "checked_in"
  );

  type Incident = {
    severity: string;
  };

  const criticalIncidents =
    (incidents as Incident[] | null)?.filter((i) => i.severity === "critical")
      .length || 0;

  type GatePass = {
    status: string;
  };

  const activeGatePasses =
    (gatePasses as GatePass[] | null)?.filter((g) => g.status === "active")
      .length || 0;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Security Management
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
              Manage incidents, gate passes, and visitor logs
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/dashboard/security/incidents/new"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
            </Link>
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
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {incidents?.length || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Critical Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {criticalIncidents}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Gate Passes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {activeGatePasses}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Today&apos;s Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {todayVisitors?.length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Security Incidents */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Recent Security Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Severity</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents && incidents.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    incidents.map((incident: any) => (
                      <tr
                        key={incident.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          {new Date(
                            incident.incident_date
                          ).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {incident.incident_type || "N/A"}
                        </td>
                        <td className="p-3 text-sm max-w-xs truncate">
                          {incident.description || "N/A"}
                        </td>
                        <td className="p-3">{incident.location || "N/A"}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              incident.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : incident.severity === "high"
                                ? "bg-orange-100 text-orange-800"
                                : incident.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {incident.severity}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              incident.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : incident.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {incident.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/security/incidents/${incident.id}`}
                            >
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link
                              href={`/dashboard/security/incidents/${incident.id}/edit`}
                            >
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white shadow-md hover:shadow-lg transition-all"
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
                      <td colSpan={7} className="text-center p-8 text-gray-500">
                        No incidents reported
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Gate Passes */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Recent Gate Passes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Issued Date</th>
                    <th className="text-left p-3">Person</th>
                    <th className="text-left p-3">Exit Time</th>
                    <th className="text-left p-3">Expected Return</th>
                    <th className="text-left p-3">Reason</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gatePasses && gatePasses.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    gatePasses.map((pass: any) => {
                      const person = pass.student || pass.staff;
                      return (
                        <tr key={pass.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            {new Date(pass.pass_date + "T00:00:00").toLocaleDateString()}
                          </td>
                          <td className="p-3 font-medium">
                            {person
                              ? `${person.first_name} ${person.last_name}`
                              : "Unknown"}
                          </td>
                          <td className="p-3 text-sm">
                            {pass.exit_time || "N/A"}
                          </td>
                          <td className="p-3 text-sm">
                            {pass.expected_return_time || "N/A"}
                          </td>
                          <td className="p-3 text-sm max-w-xs truncate">
                            {pass.reason || "N/A"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                pass.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : pass.status === "returned"
                                  ? "bg-blue-100 text-blue-800"
                                  : pass.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : pass.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {pass.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/dashboard/security/gate-passes/${pass.id}`}
                              >
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Link
                                href={`/dashboard/security/gate-passes/${pass.id}/edit`}
                              >
                                <Button 
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                  Edit
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-gray-500">
                        No gate passes issued
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Active Visitors - Currently on Campus */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Active Visitors on Campus
              </CardTitle>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold">
                <span className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></span>
                {activeVisitors.length} Active
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="border-b">
                    <th className="text-left p-4 text-sm font-semibold">Name</th>
                    <th className="text-left p-4 text-sm font-semibold hidden md:table-cell">Purpose</th>
                    <th className="text-left p-4 text-sm font-semibold">Phone</th>
                    <th className="text-left p-4 text-sm font-semibold">Check-in</th>
                    <th className="text-left p-4 text-sm font-semibold hidden lg:table-cell">Duration</th>
                    <th className="text-left p-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVisitors && activeVisitors.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    activeVisitors.map((visitor: any) => {
                      const checkInTime = new Date(visitor.check_in_time);
                      const now = new Date();
                      const durationMs = now.getTime() - checkInTime.getTime();
                      const hours = Math.floor(durationMs / (1000 * 60 * 60));
                      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                      return (
                        <tr
                          key={visitor.id}
                          className="border-b hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <td className="p-4 font-semibold">{visitor.visitor_name}</td>
                          <td className="p-4 text-sm hidden md:table-cell">{visitor.purpose || "N/A"}</td>
                          <td className="p-4 text-sm">{visitor.phone || "N/A"}</td>
                          <td className="p-4 text-sm font-mono">{checkInTime.toLocaleTimeString()}</td>
                          <td className="p-4 text-sm hidden lg:table-cell">
                            <span className="text-green-700 dark:text-green-400 font-medium">
                              {hours}h {minutes}m
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/dashboard/security/visitors/${visitor.id}`}>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                              <Link href={`/dashboard/security/visitors/${visitor.id}/edit`}>
                                <Button 
                                  size="sm"
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                  Checkout
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-gray-500">
                        No active visitors on campus
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Visitors - Today's Activity */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Today's Visitor Activity
              </CardTitle>
              <Link href="/dashboard/security/visitors/new">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Plus className="mr-1 h-4 w-4" />
                  Log Visitor
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="border-b">
                    <th className="text-left p-4 text-sm font-semibold">Name</th>
                    <th className="text-left p-4 text-sm font-semibold hidden md:table-cell">Purpose</th>
                    <th className="text-left p-4 text-sm font-semibold">Check-in</th>
                    <th className="text-left p-4 text-sm font-semibold">Check-out</th>
                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                    <th className="text-left p-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayVisitors && todayVisitors.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    todayVisitors.map((visitor: any) => (
                      <tr
                        key={visitor.id}
                        className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-4 font-semibold">{visitor.visitor_name}</td>
                        <td className="p-4 text-sm hidden md:table-cell">{visitor.purpose || "N/A"}</td>
                        <td className="p-4 text-sm font-mono">
                          {new Date(visitor.check_in_time).toLocaleTimeString()}
                        </td>
                        <td className="p-4 text-sm font-mono">
                          {visitor.check_out_time 
                            ? new Date(visitor.check_out_time).toLocaleTimeString()
                            : "-"
                          }
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              visitor.status === "checked_in"
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
                            }`}
                          >
                            {visitor.status === "checked_in" ? "Active" : "Left"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/security/visitors/${visitor.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link href={`/dashboard/security/visitors/${visitor.id}/edit`}>
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all"
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
                      <td colSpan={6} className="text-center p-8 text-gray-500">
                        No visitor records found for today
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
