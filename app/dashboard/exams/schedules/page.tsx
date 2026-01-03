import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getExamSchedules } from "../actions";
import { SchedulesTable } from "@/components/exams/schedules-table";

export const dynamic = "force-dynamic";

export default async function SchedulesPage() {
  const schedulesResult = await getExamSchedules();
  const schedules = schedulesResult.success
    ? (schedulesResult.data as any) || []
    : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Exam Schedules
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage examination schedules for all classes
            </p>
          </div>
          <Link href="/dashboard/exams/schedules/new">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Exam Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <SchedulesTable schedules={schedules} />
        </CardContent>
      </Card>
    </div>
  );
}
