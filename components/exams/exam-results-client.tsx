"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getExamSchedules } from "@/app/dashboard/exams/actions";
import Link from "next/link";
import { Calendar, FileText } from "lucide-react";

type Exam = {
  id: string;
  name: string;
};

type Props = {
  exams: Exam[];
};

export default function ExamResultsClient({ exams }: Props) {
  const [selectedExam, setSelectedExam] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedExam) {
      loadSchedules();
    } else {
      setSchedules([]);
    }
  }, [selectedExam]);

  const loadSchedules = async () => {
    setLoading(true);
    const result = await getExamSchedules(selectedExam);
    if (result.success) {
      setSchedules(result.data || []);
    }
    setLoading(false);
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No exams available</p>
        <Link href="/dashboard/exams/list/new">
          <Button>Create First Exam</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="exam-select">Select Exam</Label>
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger id="exam-select">
            <SelectValue placeholder="Choose an exam to view results" />
          </SelectTrigger>
          <SelectContent>
            {exams.map((exam) => (
              <SelectItem key={exam.id} value={exam.id}>
                {exam.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading schedules...
        </div>
      )}

      {!loading && selectedExam && schedules.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground mb-4">
            No schedules found for this exam
          </p>
          <Link href={`/dashboard/exams/schedules/new?examId=${selectedExam}`}>
            <Button>Create Schedule</Button>
          </Link>
        </Card>
      )}

      {!loading && schedules.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            Exam Schedules ({schedules.length})
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {schedules.map((schedule: any) => (
              <Card key={schedule.id} className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">
                      {schedule.class?.name} - {schedule.subject?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {schedule.subject?.code && `${schedule.subject.code} • `}
                      Max Marks: {schedule.max_marks}
                    </p>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(schedule.exam_date).toLocaleDateString()}
                      </span>
                    </div>
                    {schedule.start_time && schedule.end_time && (
                      <div className="text-muted-foreground ml-6">
                        {schedule.start_time} - {schedule.end_time}
                      </div>
                    )}
                    {schedule.room_number && (
                      <div className="text-muted-foreground ml-6">
                        Room: {schedule.room_number}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/dashboard/exams/results/${schedule.id}`}
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <FileText className="h-4 w-4 mr-2" />
                      Enter/View Results
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
