import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getClasses,
  getSubjects,
  getTeachers,
  getAcademicYears,
} from "../actions";
import BulkTimetableForm from "@/components/timetable/bulk-timetable-form";

export const dynamic = "force-dynamic";

export default async function BulkUploadPage() {
  const [classesResult, subjectsResult, teachersResult, academicYearsResult] =
    await Promise.all([
      getClasses(),
      getSubjects(),
      getTeachers(),
      getAcademicYears(),
    ]);

  const classes = classesResult.success ? classesResult.data : [];
  const subjects = subjectsResult.success ? subjectsResult.data : [];
  const teachers = teachersResult.success ? teachersResult.data : [];
  const academicYears = academicYearsResult.success
    ? academicYearsResult.data
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/timetable">
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Bulk Upload Timetable
            </h1>
            <p className="text-muted-foreground mt-1">
              Create multiple timetable entries at once
            </p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Bulk Timetable Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BulkTimetableForm
              classes={classes || []}
              subjects={subjects || []}
              teachers={teachers || []}
              academicYears={academicYears || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
