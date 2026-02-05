"use client";

import { useState } from "react";
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
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewVisitorPage() {
  const router = useRouter();
  const supabase = createClient();

  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
  const getLocalDateTimeString = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Convert datetime-local string to ISO string
  const getISOString = (localDateTime: string) => {
    return new Date(localDateTime).toISOString();
  };

  const [formData, setFormData] = useState({
    visitor_name: "",
    purpose: "",
    phone: "",
    email: "",
    check_in_time: getLocalDateTimeString(new Date().toISOString()),
    person_to_meet: "",
    id_proof_type: "",
    id_proof_type_custom: "",
    id_proof_number: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: tenantData } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user?.id || "")
        .single();

      // Use custom proof type if "Others" is selected, otherwise use selected value
      const proofType =
        formData.id_proof_type === "others"
          ? formData.id_proof_type_custom
          : formData.id_proof_type;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("visitors") as any).insert([
        {
          visitor_name: formData.visitor_name,
          purpose: formData.purpose,
          phone: formData.phone,
          email: formData.email,
          check_in_time: getISOString(formData.check_in_time),
          person_to_meet: formData.person_to_meet,
          id_proof_type: proofType,
          id_proof_number: formData.id_proof_number,
          remarks: formData.remarks,
          tenant_id: (tenantData as any)?.tenant_id,
          status: "checked_in",
        },
      ]);

      if (error) throw error;

      router.push("/dashboard/security/visitors");
      router.refresh();
    } catch (error) {
      console.error("Error logging visitor:", error);
      toast.error("Failed to log visitor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/security/visitors">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Log New Visitor
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Visitor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      setFormData({ ...formData, visitor_name: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter visitor name"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="check_in_time"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Check-in Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="check_in_time"
                    type="datetime-local"
                    value={formData.check_in_time}
                    onChange={(e) => {
                      setFormData({ ...formData, check_in_time: e.target.value });
                    }}
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="person_to_meet"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Whom to Meet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="person_to_meet"
                    type="text"
                    placeholder="Name of person to meet"
                    value={formData.person_to_meet}
                    onChange={(e) =>
                      setFormData({ ...formData, person_to_meet: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="purpose"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Purpose of Visit <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  required
                  rows={4}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                  placeholder="Describe the purpose of visit..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="id_proof_type"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    ID Proof Type
                  </Label>
                  <Select
                    value={formData.id_proof_type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        id_proof_type: value,
                        id_proof_type_custom: "",
                      })
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select ID proof type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhaar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="driving-license">
                        Driving License
                      </SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="voter-id">Voter ID</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.id_proof_type === "others" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="id_proof_type_custom"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Specify ID Proof Type <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="id_proof_type_custom"
                      value={formData.id_proof_type_custom}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          id_proof_type_custom: e.target.value,
                        })
                      }
                      required={formData.id_proof_type === "others"}
                      className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="e.g., Building Pass, Employee ID"
                    />
                  </div>
                )}

                {formData.id_proof_type !== "others" && (
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
                      placeholder="Enter ID number"
                    />
                  </div>
                )}
              </div>

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
                  rows={3}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                  placeholder="Any additional notes or remarks..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Logging..." : "Log Visitor"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-purple-900 dark:text-purple-300">
                    Visitor Log Policy:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>All visitors must provide valid identification</li>
                    <li>
                      Visitors will be checked in with current date and time
                    </li>
                    <li>
                      Remember to check out the visitor when they leave campus
                    </li>
                    <li>
                      Keep the visitor&apos;s phone number for future reference
                    </li>
                    <li>Note any special requirements or restrictions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
