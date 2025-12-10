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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Calendar, MapPin, Save } from "lucide-react";

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
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            Exam & Subject Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

            <div className="space-y-2 md:col-span-2">
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
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calendar className="h-5 w-5 text-green-500 dark:text-green-400" />
            Schedule Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam_date">
                Exam Date <span className="text-destructive">*</span>
              </Label>
              <Input id="exam_date" name="exam_date" type="date" required />
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
              <Label htmlFor="start_time">Start Time</Label>
              <Input id="start_time" name="start_time" type="time" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input id="end_time" name="end_time" type="time" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <MapPin className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            Venue Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="room_number">Room Number</Label>
            <Input
              id="room_number"
              name="room_number"
              placeholder="e.g., Room 101"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? (
            "Creating..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Schedule
            </>
          )}
        </Button>
        <Link href="/dashboard/exams" className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
