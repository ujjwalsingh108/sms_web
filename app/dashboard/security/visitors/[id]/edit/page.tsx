"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type Visitor = {
  id: string;
  visitor_name: string;
  phone: string | null;
  email: string | null;
  purpose: string | null;
  person_to_meet: string | null;
  check_in_time: string;
  check_out_time: string | null;
  id_proof_type: string | null;
  id_proof_number: string | null;
  status: string;
  remarks: string | null;
};

export default function EditVisitorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    visitor_name: "",
    phone: "",
    email: "",
    purpose: "",
    person_to_meet: "",
    id_proof_type: "",
    id_proof_number: "",
    status: "",
    check_out_time: "",
    remarks: "",
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchVisitor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVisitor = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .eq("id", id)
        .is("is_deleted", false)
        .single();

      if (error) throw error;
      setVisitor(data as Visitor);
      setFormData({
        visitor_name: (data as Visitor)?.visitor_name || "",
        phone: (data as Visitor)?.phone || "",
        email: (data as Visitor)?.email || "",
        purpose: (data as Visitor)?.purpose || "",
        person_to_meet: (data as Visitor)?.person_to_meet || "",
        id_proof_type: (data as Visitor)?.id_proof_type || "",
        id_proof_number: (data as Visitor)?.id_proof_number || "",
        status: (data as Visitor)?.status || "checked_in",
        check_out_time: (data as Visitor)?.check_out_time || "",
        remarks: (data as Visitor)?.remarks || "",
      });
    } catch (error) {
      console.error("Error fetching visitor:", error);
      toast.error("Failed to load visitor");
      router.push("/dashboard/security/visitors");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setUpdating(true);

    try {
      const updateData = {
        visitor_name: formData.visitor_name,
        phone: formData.phone || null,
        email: formData.email || null,
        purpose: formData.purpose || null,
        person_to_meet: formData.person_to_meet || null,
        id_proof_type: formData.id_proof_type || null,
        id_proof_number: formData.id_proof_number || null,
        status: formData.status,
        check_out_time: formData.check_out_time || null,
        remarks: formData.remarks || null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("visitors")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Visitor updated successfully");
      router.push(`/dashboard/security/visitors/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating visitor:", error);
      toast.error("Failed to update visitor. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading visitor...</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Visitor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/security/visitors/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Visitor
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update visitor information
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Visitor Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="visitor_name"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Visitor Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="visitor_name"
                  value={formData.visitor_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visitor_name: e.target.value,
                    })
                  }
                  required
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Person to Meet */}
              <div className="space-y-2">
                <Label
                  htmlFor="person_to_meet"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Person to Meet
                </Label>
                <Input
                  id="person_to_meet"
                  value={formData.person_to_meet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      person_to_meet: e.target.value,
                    })
                  }
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label
                  htmlFor="purpose"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Purpose of Visit
                </Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  rows={4}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                  placeholder="Why is the visitor here?"
                />
              </div>

              {/* ID Proof */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="id_proof_type"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    ID Proof Type
                  </Label>
                  <Input
                    id="id_proof_type"
                    value={formData.id_proof_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_proof_type: e.target.value,
                      })
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g., Passport, Aadhar"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="id_proof_number"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    ID Proof Number
                  </Label>
                  <Input
                    id="id_proof_number"
                    value={formData.id_proof_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        id_proof_number: e.target.value,
                      })
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Status and Checkout Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checked_in">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Checked In
                        </span>
                      </SelectItem>
                      <SelectItem value="checked_out">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          Checked Out
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="check_out_time"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Check-out Time
                    {formData.status === "checked_out" && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Input
                    id="check_out_time"
                    type="datetime-local"
                    value={formData.check_out_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        check_out_time: e.target.value,
                      })
                    }
                    required={formData.status === "checked_out"}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

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
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                  placeholder="Any additional notes or remarks..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updating ? "Updating..." : "Update Visitor"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Help Section */}
        <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold text-purple-900 dark:text-purple-300">
                  Visitor Status:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>
                    <strong>Checked In:</strong> Visitor is currently on campus
                  </li>
                  <li>
                    <strong>Checked Out:</strong> Visitor has left campus
                    (requires check-out time)
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
