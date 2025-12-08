"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExamSchedule } from "@/app/dashboard/exams/actions";
import { toast } from "sonner";

type Exam = {
  id: string;
  name: string;
};

type Class = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
  code: string | null;
};

type Props = {
  exams: Exam[];
  classes: Class[];
  subjects: Subject[];
  preselectedExamId?: string;
};

export default function ExamScheduleForm({
  exams,
  classes,
  subjects,
  preselectedExamId,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const startTime = formData.get("start_time") as string;
    const endTime = formData.get("end_time") as string;
    const roomNumber = formData.get("room_number") as string;

    const data = {
      exam_id: formData.get("exam_id") as string,
      class_id: formData.get("class_id") as string,
      subject_id: formData.get("subject_id") as string,
      exam_date: formData.get("exam_date") as string,
      start_time: startTime || undefined,
      end_time: endTime || undefined,
      max_marks: parseInt(formData.get("max_marks") as string),
      room_number: roomNumber || undefined,
    };

    const result = await createExamSchedule(data);

    if (result.success) {
      toast.success("Exam schedule created successfully");
      router.push(
        preselectedExamId
          ? `/dashboard/exams/list/${preselectedExamId}`
          : "/dashboard/exams"
      );
      router.refresh();
    } else {
      toast.error(result.error || "Failed to create exam schedule");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="exam_id">
            Exam <span className="text-destructive">*</span>
          </Label>
          <Select
            name="exam_id"
            defaultValue={preselectedExamId}
            required
            disabled={!!preselectedExamId}
          >
            <SelectTrigger id="exam_id">
              <SelectValue placeholder="Select exam" />
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

        <div className="space-y-2">
          <Label htmlFor="class_id">
            Class <span className="text-destructive">*</span>
          </Label>
          <Select name="class_id" required>
            <SelectTrigger id="class_id">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject_id">
            Subject <span className="text-destructive">*</span>
          </Label>
          <Select name="subject_id" required>
            <SelectTrigger id="subject_id">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} {subject.code && `(${subject.code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="exam_date">
            Exam Date <span className="text-destructive">*</span>
          </Label>
          <Input id="exam_date" name="exam_date" type="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input id="start_time" name="start_time" type="time" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input id="end_time" name="end_time" type="time" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_marks">
            Max Marks <span className="text-destructive">*</span>
          </Label>
          <Input
            id="max_marks"
            name="max_marks"
            type="number"
            min="0"
            placeholder="e.g., 100"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="room_number">Room Number</Label>
          <Input
            id="room_number"
            name="room_number"
            placeholder="e.g., Room 101"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Schedule"}
        </Button>
      </div>
    </form>
  );
}
