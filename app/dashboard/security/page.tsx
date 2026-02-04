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

  // Fetch visitors
  const { data: visitors } = await supabase
    .from("visitors")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("visit_date", { ascending: false })
    .limit(20);

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
                {visitors?.filter(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (v: any) =>
                    new Date(v.visit_date).toDateString() ===
                    new Date().toDateString()
                ).length || 0}
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
                          <Link
                            href={`/dashboard/security/incidents/${incident.id}`}
                          >
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
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
                            <Link
                              href={`/dashboard/security/gate-passes/${pass.id}`}
                            >
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
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

        {/* Visitors */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Recent Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Purpose</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Check-in</th>
                    <th className="text-left p-3">Check-out</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors && visitors.length > 0 ? (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    visitors.map((visitor: any) => (
                      <tr
                        key={visitor.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          {new Date(visitor.visit_date).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-medium">
                          {visitor.visitor_name}
                        </td>
                        <td className="p-3 text-sm">
                          {visitor.purpose || "N/A"}
                        </td>
                        <td className="p-3">{visitor.phone || "N/A"}</td>
                        <td className="p-3">
                          {visitor.check_in_time || "N/A"}
                        </td>
                        <td className="p-3">
                          {visitor.check_out_time || (
                            <span className="text-orange-600 text-xs">
                              In Campus
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <Link
                            href={`/dashboard/security/visitors/${visitor.id}`}
                          >
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center p-8 text-gray-500">
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
