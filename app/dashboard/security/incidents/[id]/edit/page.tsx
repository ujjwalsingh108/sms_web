"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditIncidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    status: "",
    resolution_notes: "",
  });

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
      const { data, error } = await supabase
        .from("security_incidents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setIncident(data);
      setFormData({
        status: (data as any)?.status || "open",
        resolution_notes: (data as any)?.resolution_notes || "",
      });
    } catch (error) {
      console.error("Error fetching incident:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updateData: {
        status: string;
        resolution_notes: string;
        resolved_at?: string;
      } = {
        status: formData.status,
        resolution_notes: formData.resolution_notes,
      };

      // If status is resolved or closed, set resolved_at timestamp
      if (
        (formData.status === "resolved" || formData.status === "closed") &&
        !incident.resolved_at
      ) {
        updateData.resolved_at = new Date().toISOString();
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("security_incidents")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      router.push(`/dashboard/security/incidents/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating incident:", error);
      toast.error("Failed to update incident. Please try again.");
    } finally {
      setUpdating(false);
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
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/security/incidents/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
            Update Incident Status
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                Incident Status Update
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Current Incident Info */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                    Incident Type:{" "}
                    <span className="font-normal capitalize">
                      {incident.incident_type?.replace(/_/g, " ")}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                    Location:{" "}
                    <span className="font-normal">
                      {incident.location || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                    Severity:{" "}
                    <span className="font-normal capitalize">
                      {incident.severity}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300">
                    Current Status:{" "}
                    <span className="font-normal capitalize">
                      {incident.status?.replace(/_/g, " ")}
                    </span>
                  </p>
                </div>
              </div>

              {/* Status Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  New Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        Open
                      </span>
                    </SelectItem>
                    <SelectItem value="investigating">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        Investigating
                      </span>
                    </SelectItem>
                    <SelectItem value="resolved">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Resolved
                      </span>
                    </SelectItem>
                    <SelectItem value="closed">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                        Closed
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resolution Notes */}
              <div className="space-y-2">
                <Label
                  htmlFor="resolution_notes"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Resolution Notes{" "}
                  {(formData.status === "resolved" ||
                    formData.status === "closed") && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Textarea
                  id="resolution_notes"
                  value={formData.resolution_notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resolution_notes: e.target.value,
                    })
                  }
                  required={
                    formData.status === "resolved" ||
                    formData.status === "closed"
                  }
                  rows={6}
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 resize-none"
                  placeholder="Provide details about the investigation, actions taken, or resolution..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-amber-50/50 to-red-50/50 dark:from-amber-900/10 dark:to-red-900/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-amber-900 dark:text-amber-300">
                    Status Guidelines:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>
                      <strong>Open:</strong> Incident reported but not yet
                      investigated
                    </li>
                    <li>
                      <strong>Investigating:</strong> Investigation in progress
                    </li>
                    <li>
                      <strong>Resolved:</strong> Issue resolved and actions
                      taken
                    </li>
                    <li>
                      <strong>Closed:</strong> Incident completely closed with
                      no further action needed
                    </li>
                  </ul>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
                    Note: Resolution notes are required when marking an incident
                    as resolved or closed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
