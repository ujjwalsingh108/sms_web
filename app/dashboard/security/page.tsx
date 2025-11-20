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
      student:students(first_name, last_name, roll_number)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("issue_date", { ascending: false })
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Security Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage incidents, gate passes, and visitor logs
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/security/incidents/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </Link>
          <Link href="/dashboard/security/gate-passes/new">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Issue Gate Pass
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {incidents?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Critical Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {criticalIncidents}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Gate Passes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {activeGatePasses}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Today&apos;s Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {visitors?.filter(
                (v: any) =>
                  new Date(v.visit_date).toDateString() ===
                  new Date().toDateString()
              ).length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Incidents</CardTitle>
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
                  incidents.map((incident: any) => (
                    <tr key={incident.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(incident.incident_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">{incident.incident_type || "N/A"}</td>
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Gate Passes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Pass Number</th>
                  <th className="text-left p-3">Student</th>
                  <th className="text-left p-3">Issue Date</th>
                  <th className="text-left p-3">Valid Until</th>
                  <th className="text-left p-3">Reason</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gatePasses && gatePasses.length > 0 ? (
                  gatePasses.map((pass: any) => (
                    <tr key={pass.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">
                        {pass.pass_number}
                      </td>
                      <td className="p-3 font-medium">
                        {pass.student
                          ? `${pass.student.first_name} ${pass.student.last_name}`
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {new Date(pass.issue_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {pass.valid_until
                          ? new Date(pass.valid_until).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3 text-sm max-w-xs truncate">
                        {pass.reason || "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            pass.status === "active"
                              ? "bg-green-100 text-green-800"
                              : pass.status === "used"
                              ? "bg-blue-100 text-blue-800"
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
                  ))
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Visitors</CardTitle>
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
                  visitors.map((visitor: any) => (
                    <tr key={visitor.id} className="border-b hover:bg-gray-50">
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
                      <td className="p-3">{visitor.check_in_time || "N/A"}</td>
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
  );
}
