import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle2,
  Edit,
} from "lucide-react";
import Link from "next/link";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  admission_no: string;
};

type Staff = {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
};

type GatePass = {
  id: string;
  pass_date: string;
  exit_time: string;
  expected_return_time: string | null;
  actual_return_time: string | null;
  reason: string | null;
  status: string;
  created_at: string;
  student: Student | null;
  staff: Staff | null;
};

export default async function GatePassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .single();

  if (!members) {
    redirect("/login");
  }

  // Fetch gate pass with person details
  const { data: gatePass } = await supabase
    .from("gate_passes")
    .select(
      `
      *,
      student:student_id(id, first_name, last_name, admission_no),
      staff:staff_id(id, first_name, last_name, employee_id)
    `
    )
    .eq("id", id)
    .eq("tenant_id", (members as { tenant_id: string }).tenant_id)
    .is("is_deleted", false)
    .single();

  if (!gatePass) {
    redirect("/dashboard/security/gate-passes");
  }

  const pass = gatePass as GatePass;
  const person = pass.student || pass.staff;
  const personType = pass.student ? "student" : "staff";

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      let date: Date;
      if (dateString.includes("T") || dateString.includes(" ")) {
        date = new Date(dateString);
      } else {
        date = new Date(dateString + "T00:00:00");
      }
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(":").slice(0, 2);
      const hour = parseInt(hours);
      const min = parseInt(minutes);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${String(displayHour).padStart(2, "0")}:${String(min).padStart(
        2,
        "0"
      )} ${period}`;
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400";
      case "pending":
        return "from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400";
      case "rejected":
        return "from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400";
      case "returned":
        return "from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400";
      default:
        return "from-gray-100 to-gray-100 text-gray-700 dark:from-gray-900/30 dark:to-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/security/gate-passes">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gate Pass Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Pass dated {formatDate(pass.pass_date)} at {formatTime(pass.exit_time)}
            </p>
          </div>
          <Link href={`/dashboard/security/gate-passes/${id}/edit`}>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>

        {/* Status Badge */}
        <div className="flex flex-wrap gap-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusColor(
              pass.status
            )}`}
          >
            {pass.status === "returned" || pass.status === "approved" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
            {pass.status?.charAt(0).toUpperCase() + pass.status?.slice(1)}
          </span>
        </div>

        {/* Person Information Card */}
        {person && (
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <User className="h-5 w-5 text-blue-600" />
                {personType === "student" ? "Student" : "Staff"} Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Name
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {person.first_name} {person.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    {personType === "student" ? "Admission No." : "Employee ID"}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {personType === "student"
                      ? (person as Student).admission_no
                      : (person as Staff).employee_id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pass Details Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Calendar className="h-5 w-5 text-blue-600" />
              Pass Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Pass Date
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  {formatDate(pass.pass_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Exit Time
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {formatTime(pass.exit_time)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Expected Return Time
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  {pass.expected_return_time
                    ? formatTime(pass.expected_return_time)
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Actual Return Time
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {pass.actual_return_time
                    ? formatTime(pass.actual_return_time)
                    : "Not returned yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reason Card */}
        {pass.reason && (
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FileText className="h-5 w-5 text-blue-600" />
                Reason for Pass
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {pass.reason}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Additional Information Card */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FileText className="h-5 w-5 text-blue-600" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Status
                </p>
                <div
                  className={`inline-block px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${getStatusColor(
                    pass.status
                  )}`}
                >
                  {pass.status?.charAt(0).toUpperCase() + pass.status?.slice(1)}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Created Date
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatDate(pass.created_at)}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Gate Pass ID
                </p>
                <p className="font-mono text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
                  {pass.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
