import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  User,
  GraduationCap,
  Users,
  FileText,
  Calendar,
} from "lucide-react";
import { DeleteAdmissionButton } from "@/components/admission/delete-admission-button";
import { ApproveRejectButtons } from "@/components/admission/approve-reject-buttons";
import { AdmissionApplicationWithRelations } from "@/lib/types/admission";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdmissionDetailPage({ params }: PageProps) {
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
    .select(
      `
      *,
      role:role_id(id, name, display_name),
      tenant:tenant_id(id, name, email)
    `
    )
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as
    | { tenant_id: string; role: { name: string } }
    | undefined;

  if (!member) {
    redirect("/login");
  }

  // Fetch application details
  const { data: application } = await supabase
    .from("admission_applications")
    .select(
      `
      *,
      class:class_id(id, name),
      academic_year:academic_year_id(id, name)
    `
    )
    .eq("id", id)
    .eq("tenant_id", member.tenant_id)
    .single();

  if (!application) {
    notFound();
  }

  const typedApplication = application as AdmissionApplicationWithRelations;

  const canEdit = ["superadmin", "admin"].includes(member.role.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/dashboard/admission"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Applications
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Application Details
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              Application No: {typedApplication.application_no}
            </p>
          </div>

          {canEdit && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href={`/dashboard/admission/${id}/edit`}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <DeleteAdmissionButton applicationId={id} />
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              typedApplication.status === "pending"
                ? "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 dark:from-orange-900/30 dark:to-yellow-900/30 dark:text-orange-400"
                : typedApplication.status === "approved"
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                : typedApplication.status === "rejected"
                ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400"
                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
            }`}
          >
            {typedApplication.status.charAt(0).toUpperCase() +
              typedApplication.status.slice(1)}
          </span>
        </div>

        {/* Approval Actions */}
        {canEdit && typedApplication.status === "pending" && (
          <ApproveRejectButtons applicationId={id} />
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
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Full Name
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.first_name} {typedApplication.last_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Date of Birth
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.date_of_birth
                  ? new Date(typedApplication.date_of_birth).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Gender
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {typedApplication.gender || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Phone
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.phone || "N/A"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Address
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.address || "N/A"}
              </p>
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
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Applying for Class
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.class?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Academic Year
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.academic_year?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Previous School
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.previous_school || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Previous Class
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.previous_class || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Application Date
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.applied_date
                  ? new Date(typedApplication.applied_date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "N/A"}
              </p>
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
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Guardian Name
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.guardian_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Relation
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {typedApplication.guardian_relation || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Guardian Phone
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.guardian_phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Guardian Email
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.guardian_email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Guardian Occupation
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {typedApplication.guardian_occupation || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Remarks */}
        {typedApplication.remarks && (
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FileText className="h-5 w-5 text-teal-500" />
                Remarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {typedApplication.remarks}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
