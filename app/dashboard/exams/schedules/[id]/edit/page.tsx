import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getExamScheduleById } from "@/app/dashboard/exams/actions";
import { ScheduleForm } from "@/components/exams/schedule-form";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSchedulePage({ params }: PageProps) {
  const { id } = await params;
  const result = await getExamScheduleById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const schedule = result.data as any;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams/schedules">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Edit Exam Schedule
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update examination schedule details
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm
            initialData={{
              id: schedule.id,
              exam_id: schedule.exam_id,
              class_id: schedule.class_id,
              subject_id: schedule.subject_id,
              exam_date: schedule.exam_date,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              room_number: schedule.room_number,
              max_marks: schedule.max_marks,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
