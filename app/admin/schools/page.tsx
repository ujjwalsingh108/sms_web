import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { DeleteSchoolDialog } from "@/components/admin/delete-school-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Settings } from "lucide-react";
import Link from "next/link";

export default async function SchoolsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all schools
  const { data: schools } = await supabase
    .from("school_instances")
    .select(
      `
      id,
      school_name,
      subdomain,
      status,
      subscription_plan,
      max_students,
      max_staff,
      setup_completed,
      created_at,
      tenant:tenants(name, email, phone, address)
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <AdminHeader
        title="Schools"
        description="Manage all school instances"
        user={user}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Total:{" "}
              <span className="text-blue-600">{schools?.length || 0}</span>{" "}
              schools
            </p>
          </div>
          <Link href="/admin/schools/new">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Create New School
            </Button>
          </Link>
        </div>

        {schools && schools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:gap-5">
            {schools.map((school: any) => (
              <Card
                key={school.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-xl"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {school.school_name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            school.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : school.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {school.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">
                            Subdomain:
                          </span>{" "}
                          <a
                            href={`https://${school.subdomain}.smartschoolerp.xyz`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            {school.subdomain}.smartschoolerp.xyz
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Plan:
                          </span>{" "}
                          <span className="capitalize text-gray-900 font-medium">
                            {school.subscription_plan}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Limits:
                          </span>{" "}
                          <span className="text-gray-900 font-medium">
                            {school.max_students} students, {school.max_staff}{" "}
                            staff
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Email:
                          </span>{" "}
                          <span className="text-gray-900">
                            {school.tenant.email}
                          </span>
                        </div>
                        {school.tenant.phone && (
                          <div>
                            <span className="font-semibold text-gray-700">
                              Phone:
                            </span>{" "}
                            <span className="text-gray-900">
                              {school.tenant.phone}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-gray-700">
                            Created:
                          </span>{" "}
                          <span className="text-gray-900 font-medium">
                            {new Date(school.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {school.tenant.address && (
                        <div className="mt-3 text-sm">
                          <span className="font-semibold text-gray-700">
                            Address:
                          </span>{" "}
                          <span className="text-gray-900">
                            {school.tenant.address}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <Link href={`/admin/schools/${school.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
                        >
                          <Settings className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Manage</span>
                        </Button>
                      </Link>
                      <DeleteSchoolDialog
                        schoolId={school.id}
                        schoolName={school.school_name}
                        subdomain={school.subdomain}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="text-blue-300 mb-6">
                <Plus className="h-20 w-20 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No schools yet
              </h3>
              <p className="text-gray-600 mb-8 font-medium">
                Get started by creating your first school instance
              </p>
              <Link href="/admin/schools/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First School
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
