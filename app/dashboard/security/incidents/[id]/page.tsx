"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle2,
  Edit,
} from "lucide-react";

export default function IncidentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [incident, setIncident] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reporter, setReporter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchIncident();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchIncident = async () => {
    if (!id) return;

    try {
      const { data: incidentData, error: incidentError } = await supabase
        .from("security_incidents")
        .select("*")
        .eq("id", id)
        .single();

      if (incidentError) throw incidentError;
      setIncident(incidentData);

      // Fetch reporter information
      if ((incidentData as any)?.reported_by) {
        const { data: userData } = await supabase
          .from("users")
          .select("first_name, last_name, email")
          .eq("id", (incidentData as any).reported_by)
          .single();

        setReporter(userData);
      }
    } catch (error) {
      console.error("Error fetching incident:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400";
      case "high":
        return "from-orange-100 to-red-100 text-orange-700 dark:from-orange-900/30 dark:to-red-900/30 dark:text-orange-400";
      case "medium":
        return "from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400";
      case "low":
        return "from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400";
      default:
        return "from-gray-100 to-gray-100 text-gray-700 dark:from-gray-900/30 dark:to-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400";
      case "investigating":
        return "from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400";
      case "open":
        return "from-orange-100 to-red-100 text-orange-700 dark:from-orange-900/30 dark:to-red-900/30 dark:text-orange-400";
      default:
        return "from-gray-100 to-gray-100 text-gray-700 dark:from-gray-900/30 dark:to-gray-900/30 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Incident not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/security/incidents">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Incident Details
            </h1>
          </div>
          <Link href={`/dashboard/security/incidents/${id}/edit`}>
            <Button className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Edit className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </Link>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-4 justify-center">
          <span
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r ${getSeverityColor(
              incident.severity
            )}`}
          >
            <AlertTriangle className="h-5 w-5" />
            {incident.severity?.toUpperCase()} Severity
          </span>
          <span
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusColor(
              incident.status
            )}`}
          >
            {incident.status === "resolved" || incident.status === "closed" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
            {incident.status?.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {/* Incident Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Incident Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Incident Type</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {incident.incident_type?.replace(/_/g, " ")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {incident.location || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Reported Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(incident.reported_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Reported Time</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(incident.reported_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>

              {reporter && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Reported By</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reporter.first_name} {reporter.last_name}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Reporter Email</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reporter.email}
                    </p>
                  </div>
                </>
              )}

              {incident.resolved_at && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Resolved Date</span>
                  </div>
                  <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                    {new Date(incident.resolved_at).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-600" />
              Incident Description
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {incident.description || "No description provided"}
            </p>
          </CardContent>
        </Card>

        {/* Resolution Notes */}
        {incident.resolution_notes && (
          <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Resolution Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {incident.resolution_notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
