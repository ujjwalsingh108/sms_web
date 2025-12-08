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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Exam Schedule</h1>
          <p className="text-muted-foreground">
            Schedule an exam for a specific class and subject
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamScheduleForm
            exams={exams || []}
            classes={classes || []}
            subjects={subjects || []}
            preselectedExamId={resolvedParams.examId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
