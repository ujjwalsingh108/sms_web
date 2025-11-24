import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
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
      class:applied_class_id(id, name),
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/dashboard/admission"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Application Details
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Application No: {typedApplication.application_no}
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={`/dashboard/admission/${id}/edit`}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto">
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
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            typedApplication.status === "pending"
              ? "bg-orange-100 text-orange-800"
              : typedApplication.status === "approved"
              ? "bg-green-100 text-green-800"
              : typedApplication.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="font-medium">
              {typedApplication.first_name} {typedApplication.last_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-medium">
              {typedApplication.date_of_birth
                ? new Date(typedApplication.date_of_birth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium capitalize">
              {typedApplication.gender || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{typedApplication.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{typedApplication.phone || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">{typedApplication.address || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Applying for Class</p>
            <p className="font-medium">
              {typedApplication.class?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Academic Year</p>
            <p className="font-medium">
              {typedApplication.academic_year?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Previous School</p>
            <p className="font-medium">
              {typedApplication.previous_school || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Previous Class</p>
            <p className="font-medium">
              {typedApplication.previous_class || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Application Date</p>
            <p className="font-medium">
              {typedApplication.applied_date
                ? new Date(typedApplication.applied_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Guardian Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Guardian Name</p>
            <p className="font-medium">
              {typedApplication.guardian_name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Relation</p>
            <p className="font-medium capitalize">
              {typedApplication.guardian_relation || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Guardian Phone</p>
            <p className="font-medium">
              {typedApplication.guardian_phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Guardian Email</p>
            <p className="font-medium">
              {typedApplication.guardian_email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Guardian Occupation</p>
            <p className="font-medium">
              {typedApplication.guardian_occupation || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      {typedApplication.remarks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{typedApplication.remarks}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
