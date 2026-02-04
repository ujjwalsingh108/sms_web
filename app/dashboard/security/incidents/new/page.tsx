"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function NewSecurityIncidentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    incident_date: new Date().toISOString().split("T")[0],
    incident_time: new Date().toTimeString().split(" ")[0].slice(0, 5),
    incident_type: "",
    description: "",
    location: "",
    severity: "",
    status: "open",
    reported_by: "",
    action_taken: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to continue");
        router.push("/login");
        return;
      }

      const { data: members } = await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .single();

      if (!members) {
        toast.error("No active tenant found");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (
        supabase.from("security_incidents") as any
      ).insert([
        {
          tenant_id: (members as { tenant_id: string }).tenant_id,
          incident_date: formData.incident_date,
          incident_time: formData.incident_time,
          incident_type: formData.incident_type,
          description: formData.description,
          location: formData.location,
          severity: formData.severity,
          status: formData.status,
          reported_by: formData.reported_by,
          action_taken: formData.action_taken,
        },
      ]);

      if (error) throw error;

      toast.success("Security incident reported successfully");
      router.push("/dashboard/security/incidents");
      router.refresh();
    } catch (error) {
      console.error("Error reporting incident:", error);
      toast.error("Failed to report incident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
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
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Report Security Incident
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Document a new security incident or concern
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Incident Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="incident_date" className="text-sm font-medium">
                    Incident Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="incident_date"
                    type="date"
                    value={formData.incident_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        incident_date: e.target.value,
                      })
                    }
                    required
                    className="w-full"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="incident_time" className="text-sm font-medium">
                    Incident Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="incident_time"
                    type="time"
                    value={formData.incident_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        incident_time: e.target.value,
                      })
                    }
                    required
                    className="w-full"
                  />
                </div>

                {/* Incident Type */}
                <div className="space-y-2">
                  <Label
                    htmlFor="incident_type"
                    className="text-sm font-medium"
                  >
                    Incident Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.incident_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, incident_type: value })
                    }
                    required
                  >
                    <SelectTrigger id="incident_type" className="w-full">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Theft">Theft</SelectItem>
                      <SelectItem value="Vandalism">Vandalism</SelectItem>
                      <SelectItem value="Trespassing">Trespassing</SelectItem>
                      <SelectItem value="Fire Hazard">Fire Hazard</SelectItem>
                      <SelectItem value="Medical Emergency">
                        Medical Emergency
                      </SelectItem>
                      <SelectItem value="Fight/Altercation">
                        Fight/Altercation
                      </SelectItem>
                      <SelectItem value="Suspicious Activity">
                        Suspicious Activity
                      </SelectItem>
                      <SelectItem value="Equipment Damage">
                        Equipment Damage
                      </SelectItem>
                      <SelectItem value="Student Misconduct">
                        Student Misconduct
                      </SelectItem>
                      <SelectItem value="Unauthorized Entry">
                        Unauthorized Entry
                      </SelectItem>
                      <SelectItem value="Property Damage">
                        Property Damage
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-sm font-medium">
                    Severity Level <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value })
                    }
                    required
                  >
                    <SelectTrigger id="severity" className="w-full">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="critical">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Critical
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., Main Building - 3rd Floor, Corridor A"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>

                {/* Reported By */}
                <div className="space-y-2">
                  <Label htmlFor="reported_by" className="text-sm font-medium">
                    Reported By <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reported_by"
                    type="text"
                    placeholder="Name of person reporting"
                    value={formData.reported_by}
                    onChange={(e) =>
                      setFormData({ ...formData, reported_by: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                    required
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Incident Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the incident including what happened, when it occurred, and any witnesses..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Include as many details as possible to help with investigation
                </p>
              </div>

              {/* Action Taken */}
              <div className="space-y-2">
                <Label htmlFor="action_taken" className="text-sm font-medium">
                  Action Taken <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="action_taken"
                  placeholder="Describe the actions taken in response to this incident..."
                  value={formData.action_taken}
                  onChange={(e) =>
                    setFormData({ ...formData, action_taken: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.incident_date ||
                    !formData.incident_time ||
                    !formData.incident_type ||
                    !formData.severity ||
                    !formData.location ||
                    !formData.description ||
                    !formData.reported_by ||
                    !formData.action_taken
                  }
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Reporting..." : "Report Incident"}
                </Button>
                <Link
                  href="/dashboard/security/incidents"
                  className="w-full sm:w-auto"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-amber-50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              💡 Reporting Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Be Specific:</strong> Include exact location, time, and
              circumstances
            </p>
            <p>
              <strong>Include Witnesses:</strong> List anyone who witnessed the
              incident
            </p>
            <p>
              <strong>Document Evidence:</strong> Mention any photos, videos, or
              physical evidence
            </p>
            <p>
              <strong>Emergency?</strong> For immediate threats, call security
              directly: 9999-XXX-XXX
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
