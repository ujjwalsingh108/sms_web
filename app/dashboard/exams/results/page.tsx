import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getExams } from "../actions";
import ExamResultsClient from "@/components/exams/exam-results-client";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const examsResult = await getExams();
  const exams = examsResult.success ? examsResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam Results</h1>
        <p className="text-muted-foreground">
          View and manage examination results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamResultsClient exams={exams || []} />
        </CardContent>
      </Card>
    </div>
  );
}
