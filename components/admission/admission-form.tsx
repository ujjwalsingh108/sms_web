"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  User,
  GraduationCap,
  Users,
  FileText,
  Save,
  ArrowLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface AdmissionFormProps {
  classes: { id: string; name: string }[];
  academicYears: { id: string; name: string; is_current: boolean }[];
  tenantId: string;
  initialData?: {
    id: string;
    application_no: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    previous_school: string;
    previous_class: string;
    guardian_name: string;
    guardian_phone: string;
    guardian_email: string;
    guardian_relation: string;
    guardian_occupation: string;
    class_id: string;
    academic_year_id: string;
    status: string;
    applied_date: string;
    remarks: string;
  };
}

export function AdmissionForm({
  classes,
  academicYears,
  tenantId,
  initialData,
}: AdmissionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate application number
  const generateApplicationNo = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `APP${year}${random}`;
  };

  const [formData, setFormData] = useState({
    application_no: initialData?.application_no || generateApplicationNo(),
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    date_of_birth: initialData?.date_of_birth || "",
    gender: initialData?.gender || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    previous_school: initialData?.previous_school || "",
    previous_class: initialData?.previous_class || "",
    guardian_name: initialData?.guardian_name || "",
    guardian_phone: initialData?.guardian_phone || "",
    guardian_email: initialData?.guardian_email || "",
    guardian_relation: initialData?.guardian_relation || "",
    guardian_occupation: initialData?.guardian_occupation || "",
    class_id: initialData?.class_id || "",
    academic_year_id:
      initialData?.academic_year_id ||
      academicYears.find((ay) => ay.is_current)?.id ||
      "",
    status: initialData?.status || "pending",
    applied_date:
      initialData?.applied_date || new Date().toISOString().split("T")[0],
    remarks: initialData?.remarks || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // Prepare data with proper types
      const dataToSubmit = {
        tenant_id: tenantId,
        application_no: formData.application_no,
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        previous_school: formData.previous_school || null,
        previous_class: formData.previous_class || null,
        guardian_name: formData.guardian_name || null,
        guardian_phone: formData.guardian_phone || null,
        guardian_email: formData.guardian_email || null,
        guardian_relation: formData.guardian_relation || null,
        guardian_occupation: formData.guardian_occupation || null,
        class_id: formData.class_id || null,
        academic_year_id: formData.academic_year_id || null,
        status: formData.status,
        applied_date: formData.applied_date || null,
        remarks: formData.remarks || null,
      };

      if (initialData?.id) {
        // Update existing application
        const { error: updateError } = await supabase
          .from("admission_applications")
          .update(dataToSubmit as never)
          .eq("id", initialData.id)
          .eq("tenant_id", tenantId);

        if (updateError) throw updateError;
      } else {
        // Create new application
        const { error: insertError } = await supabase
          .from("admission_applications")
          .insert([dataToSubmit as never]);

        if (insertError) throw insertError;
      }

      router.push("/dashboard/admission");
      router.refresh();
    } catch (err) {
      console.error("Error saving admission:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save admission application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Student Information */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="h-5 w-5 text-indigo-500" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="application_no">Application Number *</Label>
            <Input
              id="application_no"
              value={formData.application_no}
              onChange={(e) =>
                setFormData({ ...formData, application_no: e.target.value })
              }
              required
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applied_date">Application Date *</Label>
            <Input
              id="applied_date"
              type="date"
              value={formData.applied_date}
              onChange={(e) =>
                setFormData({ ...formData, applied_date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth *</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <GraduationCap className="h-5 w-5 text-purple-500" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="class_id">Applying for Class *</Label>
            <Select
              value={formData.class_id}
              onValueChange={(value) =>
                setFormData({ ...formData, class_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic_year_id">Academic Year *</Label>
            <Select
              value={formData.academic_year_id}
              onValueChange={(value) =>
                setFormData({ ...formData, academic_year_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name} {year.is_current ? "(Current)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous_school">Previous School</Label>
            <Input
              id="previous_school"
              value={formData.previous_school}
              onChange={(e) =>
                setFormData({ ...formData, previous_school: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous_class">Previous Class</Label>
            <Input
              id="previous_class"
              value={formData.previous_class}
              onChange={(e) =>
                setFormData({ ...formData, previous_class: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-5 w-5 text-blue-500" />
            Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardian_name">Guardian Name *</Label>
            <Input
              id="guardian_name"
              value={formData.guardian_name}
              onChange={(e) =>
                setFormData({ ...formData, guardian_name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_relation">Relation *</Label>
            <Select
              value={formData.guardian_relation}
              onValueChange={(value) =>
                setFormData({ ...formData, guardian_relation: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_phone">Guardian Phone *</Label>
            <Input
              id="guardian_phone"
              value={formData.guardian_phone}
              onChange={(e) =>
                setFormData({ ...formData, guardian_phone: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_email">Guardian Email</Label>
            <Input
              id="guardian_email"
              type="email"
              value={formData.guardian_email}
              onChange={(e) =>
                setFormData({ ...formData, guardian_email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardian_occupation">Guardian Occupation</Label>
            <Input
              id="guardian_occupation"
              value={formData.guardian_occupation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardian_occupation: e.target.value,
                })
              }
            />
          </div>

          {initialData && (
            <div className="space-y-2">
              <Label htmlFor="status">Application Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remarks */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="h-5 w-5 text-teal-500" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              rows={4}
              placeholder="Any additional notes or remarks..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {loading
            ? "Saving..."
            : initialData
            ? "Update Application"
            : "Submit Application"}
        </Button>
        <Link href="/dashboard/admission" className="flex-1">
          <Button
            type="button"
            variant="outline"
            className="w-full hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
