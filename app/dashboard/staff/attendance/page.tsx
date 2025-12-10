import { Suspense } from "react";
import StaffAttendanceClient from "@/components/staff/staff-attendance-client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, UserCheck, UserX, Clock } from "lucide-react";

export default async function StaffAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters = {
    staffId: typeof params.staffId === "string" ? params.staffId : undefined,
    startDate:
      typeof params.startDate === "string" ? params.startDate : undefined,
    endDate: typeof params.endDate === "string" ? params.endDate : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
  };

  // Get current month stats
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Staff Attendance
          </h1>
          <p className="text-muted-foreground mt-1">
            Mark and manage staff attendance records
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Days
                </p>
                <h3 className="text-2xl font-bold">{lastDay.getDate()}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Present
                </p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-rose-600">
                <UserX className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Absent
                </p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-yellow-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  On Leave
                </p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Suspense fallback={<div>Loading attendance records...</div>}>
          <StaffAttendanceClient filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
