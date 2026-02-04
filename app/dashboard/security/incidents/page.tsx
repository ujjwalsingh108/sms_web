import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function SecurityIncidentsPage() {
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

  // Fetch all security incidents
  const { data: incidents } = await supabase
    .from("security_incidents")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .is("is_deleted", false)
    .order("incident_date", { ascending: false })
    .order("incident_time", { ascending: false });

  type Incident = {
    id: string;
    incident_date: string;
    incident_time: string;
    incident_type: string | null;
    description: string | null;
    location: string | null;
    severity: string | null;
    status: string;
    reported_by: string | null;
    action_taken: string | null;
    created_at: string;
    is_deleted: boolean;
  };

  const typedIncidents = (incidents as Incident[] | null) || [];

  // Calculate statistics
  const openIncidents = typedIncidents.filter(
    (i) => i.status === "open"
  ).length;
  const investigatingIncidents = typedIncidents.filter(
    (i) => i.status === "investigating"
  ).length;
  const resolvedIncidents = typedIncidents.filter(
    (i) => i.status === "resolved" || i.status === "closed"
  ).length;
  const criticalIncidents = typedIncidents.filter(
    (i) => i.severity === "critical"
  ).length;

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "investigating":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "open":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
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
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                Security Incidents
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Monitor and manage all security incidents
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/security/incidents/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Open Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {openIncidents}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Investigating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {investigatingIncidents}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {resolvedIncidents}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
                Critical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {criticalIncidents}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Incidents Table */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              All Security Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date & Time
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Type
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                      Description
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                      Location
                    </th>
                    <th className="text-left p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Severity
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
                  {typedIncidents.length > 0 ? (
                    typedIncidents.map((incident) => (
                      <tr
                        key={incident.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                          <div className="font-medium">
                            {new Date(incident.incident_date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {incident.incident_time}
                          </div>
                        </td>
                        <td className="p-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {incident.incident_type || "N/A"}
                        </td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell max-w-xs truncate">
                          {incident.description || "N/A"}
                        </td>
                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                          {incident.location || "N/A"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                              incident.severity
                            )}`}
                          >
                            {incident.severity?.toUpperCase() || "N/A"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              incident.status
                            )}`}
                          >
                            {incident.status.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/security/incidents/${incident.id}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              >
                                View
                              </Button>
                            </Link>
                            <Link
                              href={`/dashboard/security/incidents/${incident.id}/edit`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs hover:bg-amber-50 dark:hover:bg-amber-900/20"
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
                        colSpan={7}
                        className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm"
                      >
                        No security incidents found. Click &quot;Report
                        Incident&quot; to create your first incident report.
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
