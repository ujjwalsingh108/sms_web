import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { getStaffStats } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import StaffListClient from "@/components/staff/staff-list-client";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const stats = await getStaffStats();

  const filters = {
    department:
      typeof params.department === "string" ? params.department : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Staff Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage your school staff members
          </p>
        </div>
        <Link href="/dashboard/staff/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Staff
              </p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {stats.total}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl success-gradient shadow-lg">
              <UserCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active
              </p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {stats.active}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl warning-gradient shadow-lg">
              <Clock className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                On Leave
              </p>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                {stats.onLeave}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl danger-gradient shadow-lg">
              <UserX className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inactive
              </p>
              <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.inactive}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Suspense fallback={<div>Loading staff...</div>}>
        <StaffListClient filters={filters} />
      </Suspense>
    </div>
  );
}
