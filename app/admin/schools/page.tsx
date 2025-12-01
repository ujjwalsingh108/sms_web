import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Settings, Trash2 } from "lucide-react";
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

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">
              Total: {schools?.length || 0} schools
            </p>
          </div>
          <Link href="/admin/schools/new">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New School
            </Button>
          </Link>
        </div>

        {schools && schools.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {schools.map((school: any) => (
              <Card
                key={school.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {school.school_name}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            school.status === "active"
                              ? "bg-green-100 text-green-800"
                              : school.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {school.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Subdomain:</span>{" "}
                          <a
                            href={`https://${school.subdomain}.smartschoolerp.xyz`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center gap-1"
                          >
                            {school.subdomain}.smartschoolerp.xyz
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div>
                          <span className="font-medium">Plan:</span>{" "}
                          <span className="capitalize">
                            {school.subscription_plan}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Limits:</span>{" "}
                          {school.max_students} students, {school.max_staff}{" "}
                          staff
                        </div>
                        <div>
                          <span className="font-medium">Email:</span>{" "}
                          {school.tenant.email}
                        </div>
                        {school.tenant.phone && (
                          <div>
                            <span className="font-medium">Phone:</span>{" "}
                            {school.tenant.phone}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(school.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {school.tenant.address && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Address:</span>{" "}
                          {school.tenant.address}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none"
                      >
                        <Settings className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Manage</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No schools yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first school instance
              </p>
              <Link href="/admin/schools/new">
                <Button>
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
