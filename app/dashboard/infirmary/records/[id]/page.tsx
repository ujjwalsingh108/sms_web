import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Stethoscope,
  Pill,
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

type MedicalRecord = {
  id: string;
  record_date: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  doctor_name: string | null;
  follow_up_date: string | null;
  remarks: string | null;
  created_at: string;
  student: Student | null;
};

export default async function MedicalRecordDetailPage({
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

  // Fetch medical record with student details
  const { data: record } = await supabase
    .from("medical_records")
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

  const typedRecord = record as MedicalRecord | null;

  if (!typedRecord) {
    redirect("/dashboard/infirmary");
  }

  const student = typedRecord.student;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
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
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Medical Record Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Consultation dated{" "}
              {new Date(typedRecord.record_date).toLocaleDateString("en-IN", {
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
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Doctor
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {typedRecord.doctor_name || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Symptoms */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <FileText className="h-5 w-5 text-red-500" />
                Symptoms / Chief Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {typedRecord.symptoms || "No symptoms recorded"}
              </p>
            </CardContent>
          </Card>

          {/* Diagnosis */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Stethoscope className="h-5 w-5 text-blue-500" />
                Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {typedRecord.diagnosis || "No diagnosis recorded"}
              </p>
            </CardContent>
          </Card>

          {/* Treatment */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Pill className="h-5 w-5 text-green-500" />
                Treatment Given
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {typedRecord.treatment || "No treatment recorded"}
              </p>
            </CardContent>
          </Card>

          {/* Prescription */}
          <Card className="glass-effect border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Pill className="h-5 w-5 text-purple-500" />
                Prescription / Medication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {typedRecord.prescription || "No prescription provided"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Follow-up Date
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {typedRecord.follow_up_date
                    ? new Date(typedRecord.follow_up_date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "No follow-up scheduled"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Record Created
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(typedRecord.created_at).toLocaleDateString(
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

              {typedRecord.remarks && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Additional Remarks
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {typedRecord.remarks}
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
