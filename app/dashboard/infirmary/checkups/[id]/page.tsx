import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Activity,
  Heart,
  Thermometer,
  Eye,
  Ruler,
  Weight,
  Clock,
} from "lucide-react";
import Link from "next/link";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  admission_no: string;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
};

type MedicalCheckup = {
  id: string;
  checkup_date: string;
  height: number | null;
  weight: number | null;
  blood_pressure: string | null;
  temperature: number | null;
  vision_test: string | null;
  remarks: string | null;
  created_at: string;
  student: Student | null;
};

export default async function CheckupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch checkup with student details
  const { data: checkup } = await supabase
    .from("medical_checkups")
    .select(
      `
      *,
      student:student_id (
        id,
        first_name,
        last_name,
        admission_no,
        date_of_birth,
        gender,
        blood_group
      )
    `
    )
    .eq("id", id)
    .single();

  const typedCheckup = checkup as MedicalCheckup | null;

  if (!typedCheckup) {
    redirect("/dashboard/infirmary");
  }

  const student = typedCheckup.student;

  // Calculate BMI if height and weight are available
  let bmi: number | null = null;
  let bmiCategory = "";
  if (typedCheckup.height && typedCheckup.weight) {
    const heightInMeters = typedCheckup.height / 100;
    bmi = typedCheckup.weight / (heightInMeters * heightInMeters);

    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/infirmary">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Health Checkup Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Checkup dated{" "}
              {new Date(typedCheckup.checkup_date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Student Information Card */}
        {student && (
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Name
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {student.first_name} {student.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Admission No.
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {student.admission_no}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Gender
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {student.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Blood Group
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {student.blood_group || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Date of Birth
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {student.date_of_birth
                      ? new Date(student.date_of_birth).toLocaleDateString(
                          "en-IN"
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vital Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Height */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Ruler className="h-5 w-5 text-blue-500" />
                Height
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {typedCheckup.height ? `${typedCheckup.height} cm` : "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Weight */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Weight className="h-5 w-5 text-green-500" />
                Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {typedCheckup.weight ? `${typedCheckup.weight} kg` : "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* BMI */}
          {bmi && (
            <Card className="glass-effect border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-5 w-5 text-purple-500" />
                  BMI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {bmi.toFixed(1)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {bmiCategory}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Blood Pressure */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-5 w-5 text-red-500" />
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {typedCheckup.blood_pressure || "N/A"}
              </p>
              {typedCheckup.blood_pressure && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  mmHg
                </p>
              )}
            </CardContent>
          </Card>

          {/* Temperature */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Thermometer className="h-5 w-5 text-orange-500" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {typedCheckup.temperature
                  ? `${typedCheckup.temperature}°F`
                  : "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-5 w-5 text-cyan-500" />
                Vision Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {typedCheckup.vision_test || "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Checkup Created
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(typedCheckup.created_at).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              {typedCheckup.remarks && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Remarks / Observations
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {typedCheckup.remarks}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/dashboard/infirmary" className="flex-1">
            <Button
              variant="outline"
              className="w-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Back to Infirmary
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
