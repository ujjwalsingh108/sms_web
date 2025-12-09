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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/timetable">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Bulk Upload Timetable</h1>
          <p className="text-muted-foreground">
            Create multiple timetable entries at once
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Timetable Configuration</CardTitle>
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
  );
}
