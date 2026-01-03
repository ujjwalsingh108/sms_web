"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { DeleteScheduleDialog } from "./delete-schedule-dialog";
import { format } from "date-fns";

type ExamSchedule = {
  id: string;
  exam_date: string;
  start_time: string | null;
  end_time: string | null;
  room_number: string | null;
  max_marks: number;
  exam: { id: string; name: string } | null;
  class: { id: string; name: string } | null;
  subject: { id: string; name: string; code: string } | null;
};

type SchedulesTableProps = {
  schedules: ExamSchedule[];
};

export function SchedulesTable({ schedules }: SchedulesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ExamSchedule | null>(
    null
  );

  const handleDelete = (schedule: ExamSchedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
        <p className="text-muted-foreground">No exam schedules found</p>
        <Link href="/dashboard/exams/schedules/new">
          <Button className="mt-4">Create First Schedule</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Max Marks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">
                  {schedule.exam?.name || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {schedule.class?.name || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {schedule.subject?.code || "N/A"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {schedule.subject?.name || ""}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {schedule.exam_date
                        ? format(new Date(schedule.exam_date), "MMM dd, yyyy")
                        : "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {schedule.start_time && schedule.end_time ? (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {schedule.room_number || (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{schedule.max_marks}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/exams/schedules/${schedule.id}/edit`}
                    >
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(schedule)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedSchedule && (
        <DeleteScheduleDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          schedule={selectedSchedule}
        />
      )}
    </>
  );
}
