import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { getExamById, getExamSchedules } from "../../actions";
import DeleteExamButton from "@/components/exams/delete-exam-button";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExamDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const examResult = await getExamById(resolvedParams.id);

  if (!examResult.success || !examResult.data) {
    notFound();
  }

  const exam = examResult.data;

  const schedulesResult = await getExamSchedules(resolvedParams.id);
  const schedules = schedulesResult.success ? schedulesResult.data : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "ongoing":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
      case "completed":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exams/list">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {exam.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Exam details and schedules
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/exams/list/${exam.id}/edit`}>
              <Button
                variant="outline"
                className="hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <DeleteExamButton examId={exam.id} examName={exam.name} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Exam Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Exam Name
                </label>
                <p className="text-lg font-semibold">{exam.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Exam Type
                </label>
                <p className="text-lg">{exam.exam_type?.name || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge className={getStatusColor(exam.status)}>
                    {exam.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Start Date
                </label>
                <p className="text-lg">
                  {exam.start_date
                    ? new Date(exam.start_date).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  End Date
                </label>
                <p className="text-lg">
                  {exam.end_date
                    ? new Date(exam.end_date).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created On
                </label>
                <p className="text-lg">
                  {new Date(exam.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">
                Exam Schedules ({schedules?.length || 0})
              </CardTitle>
              <Link href={`/dashboard/exams/schedules/new?examId=${exam.id}`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {schedules && schedules.length > 0 ? (
              <div className="space-y-3">
                {schedules.map((schedule: any) => (
                  <div
                    key={schedule.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors gap-2"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        {schedule.class?.name} - {schedule.subject?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.subject?.code &&
                          `${schedule.subject.code} • `}
                        Max Marks: {schedule.max_marks}
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(schedule.exam_date).toLocaleDateString()}
                      </div>
                      {schedule.start_time && schedule.end_time && (
                        <div className="text-sm text-muted-foreground">
                          {schedule.start_time} - {schedule.end_time}
                        </div>
                      )}
                      {schedule.room_number && (
                        <div className="text-sm text-muted-foreground">
                          Room: {schedule.room_number}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No schedules created yet</p>
                <Link href={`/dashboard/exams/schedules/new?examId=${exam.id}`}>
                  <Button
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Schedule
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
