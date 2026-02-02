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
  checkup_date: string;
  height: string;
  weight: string;
  blood_pressure: string;
  temperature: string;
  vision_test: string;
  remarks: string;
};

type MedicalCheckup = {
  id: string;
  student_id: string;
  checkup_date: string;
  height: number | null;
  weight: number | null;
  blood_pressure: string | null;
  temperature: number | null;
  vision_test: string | null;
  remarks: string | null;
  conducted_by: string | null;
  tenant_id: string;
};

export default function EditCheckupPage() {
  const router = useRouter();
  const params = useParams();
  const checkupId = params.id as string;
  const supabase = createClient();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [bmi, setBmi] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    student_id: "",
    checkup_date: "",
    height: "",
    weight: "",
    blood_pressure: "",
    temperature: "",
    vision_test: "",
    remarks: "",
  });

  useEffect(() => {
    fetchStudentsAndCheckup();
  }, []);

  useEffect(() => {
    // Calculate BMI when height and weight are available
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmiValue = weightInKg / (heightInMeters * heightInMeters);
        setBmi(bmiValue.toFixed(1));
      } else {
        setBmi("");
      }
    } else {
      setBmi("");
    }
  }, [formData.height, formData.weight]);

  const fetchStudentsAndCheckup = async () => {
    try {
      // Fetch students
      const { data: studentData } = await supabase
        .from("students")
        .select("id, first_name, last_name, admission_no")
        .order("first_name");

      setStudents((studentData as Student[] | null) || []);

      // Fetch checkup data
      const { data: checkupData } = await supabase
        .from("medical_checkups")
        .select("*")
        .eq("id", checkupId)
        .single();

      if (checkupData) {
        const checkup = checkupData as MedicalCheckup;
        setFormData({
          student_id: checkup.student_id,
          checkup_date: checkup.checkup_date,
          height: checkup.height?.toString() || "",
          weight: checkup.weight?.toString() || "",
          blood_pressure: checkup.blood_pressure || "",
          temperature: checkup.temperature?.toString() || "",
          vision_test: checkup.vision_test || "",
          remarks: checkup.remarks || "",
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

      const checkupData = {
        student_id: formData.student_id,
        checkup_date: formData.checkup_date,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        blood_pressure: formData.blood_pressure || null,
        temperature: formData.temperature
          ? parseFloat(formData.temperature)
          : null,
        vision_test: formData.vision_test || null,
        remarks: formData.remarks || null,
      };

      const { error: updateError } = await supabase
        .from("medical_checkups")
        .update(checkupData)
        .eq("id", checkupId);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      router.push(`/dashboard/infirmary/checkups/${checkupId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update checkup");
      setLoading(false);
    }
  };

  const getBmiCategory = (bmiValue: string): string => {
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return "Underweight";
    if (bmiNum < 25) return "Normal";
    if (bmiNum < 30) return "Overweight";
    return "Obese";
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/infirmary/checkups/${checkupId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Edit Health Checkup
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Update health checkup details
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Checkup Details
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
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
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

                {/* Checkup Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="checkup_date"
                    className="text-sm font-semibold"
                  >
                    Checkup Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="checkup_date"
                    type="date"
                    required
                    value={formData.checkup_date}
                    onChange={(e) =>
                      setFormData({ ...formData, checkup_date: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Empty spacer for grid alignment */}
                <div></div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm font-semibold">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="165.5"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-semibold">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="55.5"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* BMI Display */}
                {bmi && (
                  <div className="md:col-span-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Body Mass Index (BMI)
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Category: {getBmiCategory(bmi)}
                        </p>
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                        {bmi}
                      </div>
                    </div>
                  </div>
                )}

                {/* Blood Pressure */}
                <div className="space-y-2">
                  <Label
                    htmlFor="blood_pressure"
                    className="text-sm font-semibold"
                  >
                    Blood Pressure
                  </Label>
                  <Input
                    id="blood_pressure"
                    type="text"
                    placeholder="120/80"
                    value={formData.blood_pressure}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        blood_pressure: e.target.value,
                      })
                    }
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <Label
                    htmlFor="temperature"
                    className="text-sm font-semibold"
                  >
                    Temperature (°F)
                  </Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData({ ...formData, temperature: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Vision Test */}
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="vision_test"
                    className="text-sm font-semibold"
                  >
                    Vision Test Results
                  </Label>
                  <Input
                    id="vision_test"
                    type="text"
                    placeholder="e.g., 20/20, 6/6, or any observations"
                    value={formData.vision_test}
                    onChange={(e) =>
                      setFormData({ ...formData, vision_test: e.target.value })
                    }
                    className="focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Remarks */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="remarks" className="text-sm font-semibold">
                    Remarks / Observations
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder="Any additional observations or notes..."
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    className="resize-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update Health Checkup"}
                </Button>
                <Link
                  href={`/dashboard/infirmary/checkups/${checkupId}`}
                  className="flex-1"
                >
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
