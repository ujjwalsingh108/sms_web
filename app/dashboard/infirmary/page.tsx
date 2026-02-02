import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function InfirmaryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select(
      `
      *,
      role:role_id(id, name, display_name),
      tenant:tenant_id(id, name, email)
    `
    )
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as { tenant_id: string } | undefined;

  if (!member) {
    redirect("/login");
  }

  // Fetch medical records
  const { data: medicalRecords } = await supabase
    .from("medical_records")
    .select(
      `
      *,
      student:student_id(id, first_name, last_name, admission_no)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("record_date", { ascending: false })
    .limit(50);

  // Fetch recent checkups
  const { data: checkups } = await supabase
    .from("medical_checkups")
    .select(
      `
      *,
      student:student_id(id, first_name, last_name, admission_no)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("checkup_date", { ascending: false })
    .limit(20);

  type Student = {
    id: string;
    first_name: string;
    last_name: string;
    admission_no: string;
  };

  type MedicalRecord = {
    id: string;
    record_date: string;
    symptoms: string | null;
    diagnosis: string | null;
    treatment: string | null;
    prescription: string | null;
    doctor_name: string | null;
    student: Student | null;
  };

  type MedicalCheckup = {
    id: string;
    checkup_date: string;
    height: number | null;
    weight: number | null;
    blood_pressure: string | null;
    temperature: number | null;
    vision_test: string | null;
    student: Student | null;
  };

  const typedMedicalRecords = (medicalRecords as MedicalRecord[] | null) || [];
  const typedCheckups = (checkups as MedicalCheckup[] | null) || [];

  const totalRecords = typedMedicalRecords.length;
  const totalCheckups = typedCheckups.length;
  const todayVisits = typedMedicalRecords.filter(
    (r) => new Date(r.record_date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent">
            Infirmary Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage medical records and health checkups
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/dashboard/infirmary/records/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Medical Record
            </Button>
          </Link>
          <Link
            href="/dashboard/infirmary/checkups/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Checkup
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-6">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent">
              {totalRecords}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Recent Checkups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {totalCheckups}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Students Visited Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {todayVisits}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Recent Medical Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Student
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    Symptoms
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Diagnosis
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                    Doctor
                  </th>
                  <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {typedMedicalRecords.length > 0 ? (
                  typedMedicalRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        {new Date(record.record_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-2 md:p-3 font-medium text-xs md:text-sm text-gray-900 dark:text-gray-100">
                        {record.student
                          ? `${record.student.first_name} ${record.student.last_name}`
                          : "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell truncate max-w-xs">
                        {record.symptoms || "-"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {record.diagnosis || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                        {record.doctor_name || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-center">
                        <Link
                          href={`/dashboard/infirmary/records/${record.id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/infirmary/records/${record.id}/edit`}
                          className="ml-2"
                        >
                          <Button
                            size="sm"
                            className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
                          >
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm"
                    >
                      No medical records found. Click "Add Medical Record" to
                      create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Health Checkups */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Recent Health Checkups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Student
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    Height (cm)
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                    Weight (kg)
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                    BP
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                    Vision
                  </th>
                  <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {typedCheckups.length > 0 ? (
                  typedCheckups.map((checkup) => (
                    <tr
                      key={checkup.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-700 dark:text-gray-300">
                        {new Date(checkup.checkup_date).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-2 md:p-3 font-medium text-xs md:text-sm text-gray-900 dark:text-gray-100">
                        {checkup.student
                          ? `${checkup.student.first_name} ${checkup.student.last_name}`
                          : "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {checkup.height || "-"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {checkup.weight || "-"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                        {checkup.blood_pressure || "-"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                        {checkup.vision_test || "-"}
                      </td>
                      <td className="p-2 md:p-3 text-center space-x-2">
                        <Link
                          href={`/dashboard/infirmary/checkups/${checkup.id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            View
                          </Button>
                        </Link>
                        <Link
                          href={`/dashboard/infirmary/checkups/${checkup.id}/edit`}
                        >
                          <Button
                            size="sm"
                            className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                          >
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-8 text-gray-500 dark:text-gray-400 text-sm"
                    >
                      No checkup records found. Click "Schedule Checkup" to
                      create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
