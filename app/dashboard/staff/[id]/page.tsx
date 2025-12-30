import { getStaffById } from "../actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  User,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let staff;
  try {
    staff = await getStaffById(id);
  } catch (error) {
    console.error("Error fetching staff:", error);
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-0 font-semibold";
      case "on_leave":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 dark:from-orange-900/30 dark:to-amber-900/30 dark:text-orange-400 border-0 font-semibold";
      case "inactive":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800/30 dark:to-slate-800/30 dark:text-gray-400 border-0 font-semibold";
      default:
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400 border-0 font-semibold";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/staff">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex gap-2 md:hidden">
              <Link href={`/dashboard/staff/${id}/edit`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4 w-full">
              {staff.photo_url && (
                <Image
                  src={staff.photo_url}
                  alt={`${staff.first_name} ${staff.last_name}`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent break-words">
                  {staff.salutation ? `${staff.salutation} ` : ""}
                  {staff.first_name} {staff.last_name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Employee ID: {staff.employee_id}
                </p>
              </div>
            </div>
            <div className="hidden md:flex gap-2">
              <Link
                href={`/dashboard/staff/${id}/edit`}
                className="flex-1 sm:flex-initial"
              >
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                  Edit Details
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Basic details about the staff member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Full Name
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {staff.first_name} {staff.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {staff.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {staff.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Date of Birth
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {staff.date_of_birth
                          ? new Date(staff.date_of_birth).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Gender
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {staff.gender || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Date of Joining
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {staff.date_of_joining
                          ? new Date(staff.date_of_joining).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {staff.address && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Address
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {staff.address}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  Professional Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Work-related details and qualifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Department
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {staff.department || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Qualification
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {staff.qualification || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Salary
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {staff.salary
                          ? `$${staff.salary.toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant="secondary"
                  className={getStatusColor(staff.status)}
                >
                  {staff.status.replace("_", " ").toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/dashboard/staff/${id}/edit`} className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    Edit Information
                  </Button>
                </Link>
                <Link href="/dashboard/staff/attendance" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    View Attendance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
