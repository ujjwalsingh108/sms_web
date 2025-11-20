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
      student:students(first_name, last_name, roll_number)
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
      student:students(first_name, last_name, roll_number)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("checkup_date", { ascending: false })
    .limit(20);

  const totalRecords = medicalRecords?.length || 0;
  const totalCheckups = checkups?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Infirmary Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage medical records and health checkups
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/infirmary/records/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Medical Record
            </Button>
          </Link>
          <Link href="/dashboard/infirmary/checkups/new">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Checkup
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalRecords}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Recent Checkups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{totalCheckups}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Students Visited Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {medicalRecords?.filter(
                (r: any) =>
                  new Date(r.record_date).toDateString() ===
                  new Date().toDateString()
              ).length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Student</th>
                  <th className="text-left p-3">Complaint</th>
                  <th className="text-left p-3">Diagnosis</th>
                  <th className="text-left p-3">Treatment</th>
                  <th className="text-left p-3">Doctor</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords && medicalRecords.length > 0 ? (
                  medicalRecords.map((record: any) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(record.record_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-medium">
                        {record.student
                          ? `${record.student.first_name} ${record.student.last_name}`
                          : "N/A"}
                      </td>
                      <td className="p-3 text-sm">
                        {record.complaint || "N/A"}
                      </td>
                      <td className="p-3 text-sm">
                        {record.diagnosis || "N/A"}
                      </td>
                      <td className="p-3 text-sm">
                        {record.treatment || "N/A"}
                      </td>
                      <td className="p-3">{record.doctor_name || "N/A"}</td>
                      <td className="p-3">
                        <Link
                          href={`/dashboard/infirmary/records/${record.id}`}
                        >
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No medical records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Health Checkups */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Health Checkups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Student</th>
                  <th className="text-left p-3">Height (cm)</th>
                  <th className="text-left p-3">Weight (kg)</th>
                  <th className="text-left p-3">Blood Group</th>
                  <th className="text-left p-3">Vision</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {checkups && checkups.length > 0 ? (
                  checkups.map((checkup: any) => (
                    <tr key={checkup.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(checkup.checkup_date).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-medium">
                        {checkup.student
                          ? `${checkup.student.first_name} ${checkup.student.last_name}`
                          : "N/A"}
                      </td>
                      <td className="p-3">{checkup.height || "N/A"}</td>
                      <td className="p-3">{checkup.weight || "N/A"}</td>
                      <td className="p-3">{checkup.blood_group || "N/A"}</td>
                      <td className="p-3">{checkup.vision || "N/A"}</td>
                      <td className="p-3">
                        <Link
                          href={`/dashboard/infirmary/checkups/${checkup.id}`}
                        >
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No checkup records found
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
