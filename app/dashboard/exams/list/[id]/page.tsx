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
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams/list">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{exam.name}</h1>
          <p className="text-muted-foreground">Exam details and schedules</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/exams/list/${exam.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <DeleteExamButton examId={exam.id} examName={exam.name} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
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

        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Exam Schedules ({schedules?.length || 0})</CardTitle>
            <Link href={`/dashboard/exams/schedules/new?examId=${exam.id}`}>
              <Button size="sm">
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
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-2"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {schedule.class?.name} - {schedule.subject?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {schedule.subject?.code && `${schedule.subject.code} • `}
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
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Schedule
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
