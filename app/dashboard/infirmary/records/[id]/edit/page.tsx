"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  admission_no: string;
};

type FormData = {
  student_id: string;
  record_date: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  doctor_name: string;
  follow_up_date: string;
  remarks: string;
};

type MedicalRecord = {
  id: string;
  student_id: string;
  record_date: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  doctor_name: string | null;
  follow_up_date: string | null;
  remarks: string | null;
  created_by: string | null;
  tenant_id: string;
};

export default function EditMedicalRecordPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;
  const supabase = createClient();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    student_id: "",
    record_date: new Date().toISOString().split("T")[0],
    symptoms: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    doctor_name: "",
    follow_up_date: "",
    remarks: "",
  });

  useEffect(() => {
    fetchStudentsAndRecord();
  }, []);

  const fetchStudentsAndRecord = async () => {
    try {
      // Fetch students
      const { data: studentData } = await supabase
        .from("students")
        .select("id, first_name, last_name, admission_no, class_id")
        .order("first_name");

      setStudents((studentData as Student[] | null) || []);

      // Fetch record data
      const { data: recordData } = await supabase
        .from("medical_records")
        .select("*")
        .eq("id", recordId)
        .single();

      if (recordData) {
        const record = recordData as MedicalRecord;
        setFormData({
          student_id: record.student_id,
          record_date: record.record_date,
          symptoms: record.symptoms || "",
          diagnosis: record.diagnosis || "",
          treatment: record.treatment || "",
          prescription: record.prescription || "",
          doctor_name: record.doctor_name || "",
          follow_up_date: record.follow_up_date || "",
          remarks: record.remarks || "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const recordData: Record<string, any> = {
        student_id: formData.student_id,
        record_date: formData.record_date,
        symptoms: formData.symptoms || null,
        diagnosis: formData.diagnosis || null,
        treatment: formData.treatment || null,
        prescription: formData.prescription || null,
        doctor_name: formData.doctor_name || null,
        follow_up_date: formData.follow_up_date || null,
        remarks: formData.remarks || null,
      };

      const { error: updateError } = await (
        supabase.from("medical_records") as any
      )
        .update(recordData)
        .eq("id", recordId);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      router.push(`/dashboard/infirmary/records/${recordId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update record");
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/infirmary/records/${recordId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Medical Record
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update medical consultation record
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Selection */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="student_id" className="text-sm font-semibold">
                    Student <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="student_id"
                    required
                    value={formData.student_id}
                    onChange={(e) =>
                      setFormData({ ...formData, student_id: e.target.value })
                    }
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} -{" "}
                        {student.admission_no}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Record Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="record_date"
                    className="text-sm font-semibold"
                  >
                    Record Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="record_date"
                    type="date"
                    required
                    value={formData.record_date}
                    onChange={(e) =>
                      setFormData({ ...formData, record_date: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Doctor Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="doctor_name"
                    className="text-sm font-semibold"
                  >
                    Doctor Name
                  </Label>
                  <Input
                    id="doctor_name"
                    type="text"
                    placeholder="Dr. Smith"
                    value={formData.doctor_name}
                    onChange={(e) =>
                      setFormData({ ...formData, doctor_name: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Symptoms */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="symptoms" className="text-sm font-semibold">
                    Symptoms / Chief Complaint
                  </Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe the symptoms..."
                    rows={3}
                    value={formData.symptoms}
                    onChange={(e) =>
                      setFormData({ ...formData, symptoms: e.target.value })
                    }
                    className="resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Diagnosis */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="diagnosis" className="text-sm font-semibold">
                    Diagnosis
                  </Label>
                  <Textarea
                    id="diagnosis"
                    placeholder="Enter diagnosis..."
                    rows={3}
                    value={formData.diagnosis}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnosis: e.target.value })
                    }
                    className="resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Treatment */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="treatment" className="text-sm font-semibold">
                    Treatment Given
                  </Label>
                  <Textarea
                    id="treatment"
                    placeholder="Describe the treatment provided..."
                    rows={3}
                    value={formData.treatment}
                    onChange={(e) =>
                      setFormData({ ...formData, treatment: e.target.value })
                    }
                    className="resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Prescription */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="prescription"
                    className="text-sm font-semibold"
                  >
                    Prescription / Medication
                  </Label>
                  <Textarea
                    id="prescription"
                    placeholder="List medications and dosage..."
                    rows={3}
                    value={formData.prescription}
                    onChange={(e) =>
                      setFormData({ ...formData, prescription: e.target.value })
                    }
                    className="resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Follow-up Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="follow_up_date"
                    className="text-sm font-semibold"
                  >
                    Follow-up Date (Optional)
                  </Label>
                  <Input
                    id="follow_up_date"
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        follow_up_date: e.target.value,
                      })
                    }
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Remarks */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="remarks" className="text-sm font-semibold">
                    Additional Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder="Any additional notes..."
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    className="resize-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update Medical Record"}
                </Button>
                <Link href={`/dashboard/infirmary/records/${recordId}`} className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
