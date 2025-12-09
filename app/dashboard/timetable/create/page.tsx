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
import TimetableCreateForm from "@/components/timetable/timetable-create-form";

export const dynamic = "force-dynamic";

export default async function CreateTimetablePage() {
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
          <h1 className="text-3xl font-bold">Create Timetable</h1>
          <p className="text-muted-foreground">
            Set up a new class timetable schedule
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timetable Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableCreateForm
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
