import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExamScheduleForm from "@/components/exams/exam-schedule-form";
import { getExams, getClasses, getSubjects } from "../../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ examId?: string }>;
};

export default async function NewSchedulePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const examsResult = await getExams();
  const classesResult = await getClasses();
  const subjectsResult = await getSubjects();

  const exams = examsResult.success ? examsResult.data : [];
  const classes = classesResult.success ? classesResult.data : [];
  const subjects = subjectsResult.success ? subjectsResult.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exams">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create Exam Schedule
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Schedule an exam for a specific class and subject
            </p>
          </div>
        </div>

        <ExamScheduleForm
          exams={exams || []}
          classes={classes || []}
          subjects={subjects || []}
          preselectedExamId={resolvedParams.examId}
        />
      </div>
    </div>
  );
}
