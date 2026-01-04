import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getExams } from "../actions";
import ExamResultsClient from "@/components/exams/exam-results-client";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const examsResult = await getExams();
  const exams = examsResult.success ? examsResult.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exams">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Exam Results
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage examination results
            </p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Select Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <ExamResultsClient exams={exams || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
