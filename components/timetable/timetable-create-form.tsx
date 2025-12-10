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
import { createTimetable } from "@/app/dashboard/timetable/actions";
import { toast } from "sonner";
import { Save } from "lucide-react";

type Class = {
  id: string;
  name: string;
};

type Subject = {
  id: string;
  name: string;
  code: string | null;
};

type Teacher = {
  id: string;
  first_name: string;
  last_name: string;
};

type AcademicYear = {
  id: string;
  name: string;
};

type Props = {
  classes: Class[];
  subjects: Subject[];
  teachers: Teacher[];
  academicYears: AcademicYear[];
};

export default function TimetableCreateForm({
  classes,
  subjects,
  teachers,
  academicYears,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      class_id: formData.get("class_id") as string,
      section_id: (formData.get("section_id") as string) || undefined,
      academic_year_id:
        (formData.get("academic_year_id") as string) || undefined,
      day_of_week: parseInt(formData.get("day_of_week") as string),
      period_number: parseInt(formData.get("period_number") as string),
      subject_id: (formData.get("subject_id") as string) || undefined,
      teacher_id: (formData.get("teacher_id") as string) || undefined,
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      room_number: (formData.get("room_number") as string) || undefined,
    };

    const result = await createTimetable(data);

    if (result.success) {
      toast.success("Timetable entry created successfully");
      router.push("/dashboard/timetable");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to create timetable entry");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
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
          <Label htmlFor="section_id">Section</Label>
          <Input
            id="section_id"
            name="section_id"
            placeholder="e.g., A, B (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="day_of_week">
            Day of Week <span className="text-destructive">*</span>
          </Label>
          <Select name="day_of_week" required>
            <SelectTrigger id="day_of_week">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Monday</SelectItem>
              <SelectItem value="2">Tuesday</SelectItem>
              <SelectItem value="3">Wednesday</SelectItem>
              <SelectItem value="4">Thursday</SelectItem>
              <SelectItem value="5">Friday</SelectItem>
              <SelectItem value="6">Saturday</SelectItem>
              <SelectItem value="7">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period_number">
            Period Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="period_number"
            name="period_number"
            type="number"
            min="1"
            max="10"
            placeholder="e.g., 1, 2, 3"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject_id">Subject</Label>
          <Select name="subject_id">
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
          <Label htmlFor="teacher_id">Teacher</Label>
          <Select name="teacher_id">
            <SelectTrigger id="teacher_id">
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.first_name} {teacher.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">
            Start Time <span className="text-destructive">*</span>
          </Label>
          <Input id="start_time" name="start_time" type="time" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">
            End Time <span className="text-destructive">*</span>
          </Label>
          <Input id="end_time" name="end_time" type="time" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="room_number">Room Number</Label>
          <Input
            id="room_number"
            name="room_number"
            placeholder="e.g., Room 101, Lab A"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic_year_id">Academic Year</Label>
          <Select name="academic_year_id">
            <SelectTrigger id="academic_year_id">
              <SelectValue placeholder="Select academic year (optional)" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Creating..." : "Create Timetable Entry"}
        </Button>
      </div>
    </form>
  );
}
