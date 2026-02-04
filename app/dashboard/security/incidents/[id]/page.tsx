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
  Shield,
} from "lucide-react";

type SecurityIncident = {
  id: string;
  incident_date: string;
  incident_time: string;
  incident_type: string;
  location: string;
  description: string;
  severity: string;
  reported_by: string;
  action_taken: string | null;
  status: string;
  created_at: string;
  is_deleted: boolean;
};

export default function IncidentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  const [incident, setIncident] = useState<SecurityIncident | null>(null);
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
        .is("is_deleted", false)
        .single();

      if (incidentError) throw incidentError;
      setIncident(incidentData as SecurityIncident);
    } catch (error) {
      console.error("Error fetching incident:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      // Handle both date-only strings (YYYY-MM-DD) and full timestamps
      let date: Date;
      if (dateString.includes("T") || dateString.includes(" ")) {
        // It's a full timestamp
        date = new Date(dateString);
      } else {
        // It's a date-only string
        date = new Date(dateString + "T00:00:00");
      }
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    try {
      // timeString is in HH:MM:SS format
      const [hours, minutes] = timeString.split(":").slice(0, 2);
      const hour = parseInt(hours);
      const min = parseInt(minutes);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${String(displayHour).padStart(2, "0")}:${String(min).padStart(
        2,
        "0"
      )} ${period}`;
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading incident details...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Incident not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/security/incidents">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Incident Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Incident dated {formatDate(incident.incident_date)} at{" "}
              {formatTime(incident.incident_time)}
            </p>
          </div>
          <Link href={`/dashboard/security/incidents/${id}/edit`}>
            <Button className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getSeverityColor(
              incident.severity
            )}`}
          >
            <AlertTriangle className="h-4 w-4" />
            {incident.severity?.charAt(0).toUpperCase() +
              incident.severity?.slice(1)}
          </span>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusColor(
              incident.status
            )}`}
          >
            {incident.status === "resolved" || incident.status === "closed" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            {incident.status?.replace(/_/g, " ").charAt(0).toUpperCase() +
              incident.status?.replace(/_/g, " ").slice(1)}
          </span>
        </div>

        {/* Incident Information Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Incident Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Incident Type
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {incident.incident_type?.replace(/_/g, " ") || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Location
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  {incident.location || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Date
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  {formatDate(incident.incident_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Time
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  {formatTime(incident.incident_time)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Reported By
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-600" />
                  {incident.reported_by || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Severity
                </p>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getSeverityColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity?.charAt(0).toUpperCase() +
                    incident.severity?.slice(1)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FileText className="h-5 w-5 text-amber-600" />
              Incident Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {incident.description || "No description provided"}
            </p>
          </CardContent>
        </Card>

        {/* Action Taken Card */}
        {incident.action_taken && (
          <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Action Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {incident.action_taken}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Details Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Shield className="h-5 w-5 text-amber-600" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Current Status
                </p>
                <div
                  className={`inline-block px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${getStatusColor(
                    incident.status
                  )}`}
                >
                  {incident.status?.replace(/_/g, " ").charAt(0).toUpperCase() +
                    incident.status?.replace(/_/g, " ").slice(1)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Record Created
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatDate(incident.created_at)}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Incident ID
                </p>
                <p className="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
                  {incident.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
