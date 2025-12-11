"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { ArrowLeft, Save, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditGatePassPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gatePass, setGatePass] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    status: "",
    actual_return: "",
    remarks: "",
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
        .select(
          `
          *,
          student:students (
            first_name,
            last_name,
            admission_no
          ),
          staff:staff (
            first_name,
            last_name,
            employee_id
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setGatePass(data);
      setFormData({
        status: (data as any)?.status || "pending",
        actual_return: (data as any)?.actual_return || "",
        remarks: (data as any)?.remarks || "",
      });
    } catch (error) {
      console.error("Error fetching gate pass:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data: userData } = await supabase.auth.getUser();

      const updateData: {
        status: string;
        remarks: string;
        actual_return?: string;
        approved_by?: string;
      } = {
        status: formData.status,
        remarks: formData.remarks,
      };

      // If status is approved, set approved_by
      if (formData.status === "approved" && !gatePass.approved_by) {
        updateData.approved_by = userData.user?.id;
      }

      // If status is returned and actual_return is provided, set it
      if (formData.status === "returned" && formData.actual_return) {
        updateData.actual_return = formData.actual_return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("gate_passes")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      router.push(`/dashboard/security/gate-passes/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating gate pass:", error);
      alert("Failed to update gate pass. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!gatePass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Gate pass not found</p>
      </div>
    );
  }

  const person = gatePass.student || gatePass.staff;
  const personType = gatePass.student ? "Student" : "Staff";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/security/gate-passes/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Update Gate Pass
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gate Pass Status Update
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Current Gate Pass Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    {personType}:{" "}
                    <span className="font-normal">
                      {person?.first_name} {person?.last_name}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    {personType === "Student" ? "Admission No" : "Employee ID"}:{" "}
                    <span className="font-normal">
                      {person?.admission_no || person?.employee_id}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    Pass Type:{" "}
                    <span className="font-normal capitalize">
                      {gatePass.pass_type?.replace(/_/g, " ")}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    Date of Exit:{" "}
                    <span className="font-normal">
                      {new Date(gatePass.date_of_exit).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    Current Status:{" "}
                    <span className="font-normal capitalize">
                      {gatePass.status}
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
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select new status" />
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

              {/* Actual Return Date (only show if status is returned) */}
              {formData.status === "returned" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="actual_return"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Actual Return Date
                  </Label>
                  <Input
                    id="actual_return"
                    type="date"
                    value={formData.actual_return}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actual_return: e.target.value,
                      })
                    }
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Remarks */}
              <div className="space-y-2">
                <Label
                  htmlFor="remarks"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  placeholder="Add any notes or remarks about this gate pass..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-blue-900 dark:text-blue-300">
                    Status Guidelines:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>
                      <strong>Pending:</strong> Gate pass awaiting approval
                    </li>
                    <li>
                      <strong>Approved:</strong> Gate pass approved for exit
                    </li>
                    <li>
                      <strong>Rejected:</strong> Gate pass request denied
                    </li>
                    <li>
                      <strong>Returned:</strong> Person has returned to campus
                    </li>
                  </ul>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
                    Note: When marking as returned, you can optionally specify
                    the actual return date.
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
