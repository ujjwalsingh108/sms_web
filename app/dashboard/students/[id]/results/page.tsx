import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getStudentExamResults } from "@/app/dashboard/exams/actions";
import { ReportCardPDF } from "@/components/exams/report-card-pdf";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ examId?: string }>;
};

export default async function StudentResultsPage({
  params,
  searchParams,
}: PageProps) {
  const { studentId } = await params;
  const { examId } = await searchParams;

  const result = await getStudentExamResults(studentId, examId);

  if (!result.success || !result.data) {
    notFound();
  }

  const { student, results } = result.data;

  // Group results by exam
  const resultsByExam = results.reduce((acc: any, result: any) => {
    const examId = result.exam_schedule.exam.id;
    const examName = result.exam_schedule.exam.name;

    if (!acc[examId]) {
      acc[examId] = {
        examId,
        examName,
        examType: result.exam_schedule.exam.exam_type?.name || "N/A",
        results: [],
      };
    }

    acc[examId].results.push(result);
    return acc;
  }, {});

  const examGroups = Object.values(resultsByExam);

  // Calculate overall statistics
  const validResults = results.filter(
    (r: any) => !r.is_absent && r.marks_obtained !== null
  );
  const totalObtained = validResults.reduce(
    (sum: number, r: any) => sum + (r.marks_obtained || 0),
    0
  );
  const totalMax = validResults.reduce(
    (sum: number, r: any) => sum + r.exam_schedule.max_marks,
    0
  );
  const overallPercentage =
    totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0";

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/students">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Student Exam Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {student.first_name} {student.last_name} - {student.admission_no}
          </p>
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="text-lg font-medium">
                {student.first_name} {student.last_name}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Admission No
              </label>
              <p className="text-lg font-medium">{student.admission_no}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Class
              </label>
              <p className="text-lg font-medium">
                {student.classes?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Overall Performance
              </label>
              <p className="text-lg font-medium">{overallPercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      {validResults.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Exams</p>
                  <p className="text-2xl font-bold">{examGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Subjects Taken
                  </p>
                  <p className="text-2xl font-bold">{validResults.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Marks Obtained
                  </p>
                  <p className="text-2xl font-bold">
                    {totalObtained} / {totalMax}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results by Exam */}
      {examGroups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No exam results found for this student
            </p>
          </CardContent>
        </Card>
      ) : (
        examGroups.map((group: any) => {
          const examResults = group.results;
          const examValidResults = examResults.filter(
            (r: any) => !r.is_absent && r.marks_obtained !== null
          );
          const examTotal = examValidResults.reduce(
            (sum: number, r: any) => sum + (r.marks_obtained || 0),
            0
          );
          const examMaxTotal = examValidResults.reduce(
            (sum: number, r: any) => sum + r.exam_schedule.max_marks,
            0
          );
          const examPercentage =
            examMaxTotal > 0
              ? ((examTotal / examMaxTotal) * 100).toFixed(2)
              : "0";

          return (
            <Card key={group.examId}>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>{group.examName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {group.examType} • {examValidResults.length} subjects
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Overall Score
                      </p>
                      <p className="text-2xl font-bold">{examPercentage}%</p>
                    </div>
                    <ReportCardPDF
                      student={student}
                      examName={group.examName}
                      results={examResults}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examResults.map((result: any) => (
                    <div
                      key={result.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">
                            {result.exam_schedule.subject.code}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {result.exam_schedule.subject.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(
                            result.exam_schedule.exam_date
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {result.is_absent ? (
                          <Badge variant="destructive">Absent</Badge>
                        ) : (
                          <>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Marks
                              </p>
                              <p className="text-lg font-bold">
                                {result.marks_obtained} /{" "}
                                {result.exam_schedule.max_marks}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                Percentage
                              </p>
                              <p className="text-lg font-bold">
                                {(
                                  (result.marks_obtained /
                                    result.exam_schedule.max_marks) *
                                  100
                                ).toFixed(1)}
                                %
                              </p>
                            </div>
                            {result.grade && (
                              <Badge
                                className={
                                  result.grade.startsWith("A")
                                    ? "bg-green-500"
                                    : result.grade.startsWith("B")
                                    ? "bg-blue-500"
                                    : result.grade === "C"
                                    ? "bg-yellow-500"
                                    : result.grade === "D"
                                    ? "bg-orange-500"
                                    : "bg-red-500"
                                }
                              >
                                {result.grade}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
