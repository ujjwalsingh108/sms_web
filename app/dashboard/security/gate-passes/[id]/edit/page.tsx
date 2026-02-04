"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

type GatePass = {
  id: string;
  pass_date: string;
  exit_time: string;
  expected_return_time: string | null;
  actual_return_time: string | null;
  reason: string | null;
  status: string;
  student_id: string | null;
  staff_id: string | null;
};

export default function EditGatePassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [gatePass, setGatePass] = useState<GatePass | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    status: "",
    actual_return_time: "",
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchGatePass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchGatePass = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("gate_passes")
        .select("*")
        .eq("id", id)
        .is("is_deleted", false)
        .single();

      if (error) throw error;
      setGatePass(data as GatePass);
      setFormData({
        status: (data as GatePass)?.status || "pending",
        actual_return_time: (data as GatePass)?.actual_return_time || "",
      });
    } catch (error) {
      console.error("Error fetching gate pass:", error);
      toast.error("Failed to load gate pass");
      router.push("/dashboard/security/gate-passes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updateData = {
        status: formData.status,
        actual_return_time: formData.actual_return_time || null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("gate_passes")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Gate pass updated successfully");
      router.push(`/dashboard/security/gate-passes/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating gate pass:", error);
      toast.error("Failed to update gate pass. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading gate pass...</p>
      </div>
    );
  }

  if (!gatePass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Gate pass not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/security/gate-passes/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Update Gate Pass
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update status and return time
            </p>
          </div>
        </div>

        {/* Current Pass Info */}
        <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Pass Date</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(gatePass.pass_date + "T00:00:00").toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Exit Time</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {gatePass.exit_time}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Expected Return Time
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {gatePass.expected_return_time || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Current Status</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {gatePass.status}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Update Pass Status</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Selection */}
              <div className="space-y-2">
                <Label
                  htmlFor="status"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        Pending
                      </span>
                    </SelectItem>
                    <SelectItem value="approved">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        Approved
                      </span>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        Rejected
                      </span>
                    </SelectItem>
                    <SelectItem value="returned">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        Returned
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actual Return Time */}
              <div className="space-y-2">
                <Label
                  htmlFor="actual_return_time"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Actual Return Time
                  {formData.status === "returned" && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id="actual_return_time"
                  type="time"
                  value={formData.actual_return_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      actual_return_time: e.target.value,
                    })
                  }
                  required={formData.status === "returned"}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updating ? "Updating..." : "Update Gate Pass"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold text-blue-900 dark:text-blue-300">
                  Status Guidelines:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>
                    <strong>Pending:</strong> Pass request awaiting approval
                  </li>
                  <li>
                    <strong>Approved:</strong> Pass has been approved for exit
                  </li>
                  <li>
                    <strong>Rejected:</strong> Pass request has been declined
                  </li>
                  <li>
                    <strong>Returned:</strong> Student/Staff has returned (requires
                    actual return time)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
