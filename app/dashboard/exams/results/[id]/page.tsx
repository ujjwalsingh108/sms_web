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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exams/results">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Exam Results
            </h1>
            <p className="text-muted-foreground mt-1">
              {schedule.class?.name} - {schedule.subject?.name}
            </p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Schedule Information
            </CardTitle>
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
    </div>
  );
}
