import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getStudentsByClass, getExamResults } from "../../actions";
import ResultEntryForm from "@/components/exams/result-entry-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultEntryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const scheduleId = resolvedParams.id;

  // Get schedule details - we'll get all schedules and find ours with populated data
  const supabase = await createClient();
  const supabaseAny: any = supabase;

  const { data: scheduleData, error: scheduleError } = await supabaseAny
    .from("exam_schedules")
    .select(
      `
      *,
      class:classes(id, name),
      subject:subjects(id, name, code)
    `
    )
    .eq("id", scheduleId)
    .single();

  if (scheduleError || !scheduleData) {
    notFound();
  }

  const schedule = scheduleData;

  // Get students for this class
  const studentsResult = await getStudentsByClass(schedule.class_id);
  const students = studentsResult.success ? studentsResult.data : [];

  // Get existing results
  const resultsResult = await getExamResults(scheduleId);
  const existingResults = resultsResult.success ? resultsResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams/results">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Exam Results</h1>
          <p className="text-muted-foreground">
            {schedule.class?.name} - {schedule.subject?.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Exam Date
            </label>
            <p className="text-lg">
              {new Date(schedule.exam_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Max Marks
            </label>
            <p className="text-lg">{schedule.max_marks}</p>
          </div>
          {schedule.room_number && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Room
              </label>
              <p className="text-lg">{schedule.room_number}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ResultEntryForm
        scheduleId={scheduleId}
        students={students || []}
        existingResults={existingResults || []}
        maxMarks={schedule.max_marks}
      />
    </div>
  );
}
