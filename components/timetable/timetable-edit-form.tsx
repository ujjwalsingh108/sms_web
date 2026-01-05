"use client";

import { useState, useEffect } from "react";
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
import {
  updateTimetable,
  getSectionsByClass,
} from "@/app/dashboard/timetable/actions";
import { toast } from "sonner";
import { Save } from "lucide-react";

type Class = {
  id: string;
  name: string;
};

type Section = {
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

type Timetable = {
  id: string;
  class_id: string;
  section_id: string | null;
  academic_year_id: string | null;
  day_of_week: number;
  period_number: number;
  subject_id: string | null;
  teacher_id: string | null;
  start_time: string;
  end_time: string;
  room_number: string | null;
  is_lunch_break?: boolean;
};

type Props = {
  timetable: Timetable;
  classes: Class[];
  subjects: Subject[];
  teachers: Teacher[];
  academicYears: AcademicYear[];
};

export default function TimetableEditForm({
  timetable,
  classes,
  subjects,
  teachers,
  academicYears,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState(timetable.class_id);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState(
    timetable.section_id || "none"
  );
  const [selectedSubject, setSelectedSubject] = useState(
    timetable.subject_id || "none"
  );
  const [selectedTeacher, setSelectedTeacher] = useState(
    timetable.teacher_id || "none"
  );
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    timetable.academic_year_id || "none"
  );
  const [dayOfWeek, setDayOfWeek] = useState(timetable.day_of_week.toString());
  const [isLunchBreak, setIsLunchBreak] = useState(
    timetable.is_lunch_break || false
  );
  const router = useRouter();

  useEffect(() => {
    const loadSections = async () => {
      if (selectedClass) {
        const result = await getSectionsByClass(selectedClass);
        if (result.success) {
          setSections(result.data || []);
        }
      } else {
        setSections([]);
      }
    };
    loadSections();
  }, [selectedClass]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      class_id: selectedClass,
      section_id: selectedSection !== "none" ? selectedSection : undefined,
      academic_year_id:
        selectedAcademicYear !== "none" ? selectedAcademicYear : undefined,
      day_of_week: parseInt(dayOfWeek),
      period_number: parseInt(formData.get("period_number") as string),
      subject_id: selectedSubject !== "none" ? selectedSubject : undefined,
      teacher_id: selectedTeacher !== "none" ? selectedTeacher : undefined,
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      room_number: (formData.get("room_number") as string) || undefined,
      is_lunch_break: isLunchBreak,
    };

    const result = await updateTimetable(timetable.id, data);

    if (result.success) {
      toast.success("Timetable entry updated successfully");
      router.push("/dashboard/timetable");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update timetable entry");
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
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
            required
          >
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
          <Select
            value={selectedSection}
            onValueChange={setSelectedSection}
            disabled={!selectedClass || sections.length === 0}
          >
            <SelectTrigger id="section_id">
              <SelectValue
                placeholder={
                  !selectedClass
                    ? "Select class first"
                    : sections.length === 0
                    ? "No sections available"
                    : "Select section (optional)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Section</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="day_of_week">
            Day of Week <span className="text-destructive">*</span>
          </Label>
          <Select value={dayOfWeek} onValueChange={setDayOfWeek} required>
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
            defaultValue={timetable.period_number}
            placeholder="e.g., 1, 2, 3"
            required
          />
        </div>

        <div className="space-y-2 flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            id="is_lunch_break"
            checked={isLunchBreak}
            onChange={(e) => setIsLunchBreak(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <Label
            htmlFor="is_lunch_break"
            className="cursor-pointer font-normal"
          >
            This is a lunch break
          </Label>
        </div>

        {!isLunchBreak && (
          <>
            <div className="space-y-2">
              <Label htmlFor="subject_id">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger id="subject_id">
                  <SelectValue placeholder="Select subject (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Subject</SelectItem>
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
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
              >
                <SelectTrigger id="teacher_id">
                  <SelectValue placeholder="Select teacher (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Teacher</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="start_time">
            Start Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={timetable.start_time}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">
            End Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={timetable.end_time}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="room_number">Room Number</Label>
          <Input
            id="room_number"
            name="room_number"
            defaultValue={timetable.room_number || ""}
            placeholder="e.g., Room 101, Lab A"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic_year_id">Academic Year</Label>
          <Select
            value={selectedAcademicYear}
            onValueChange={setSelectedAcademicYear}
          >
            <SelectTrigger id="academic_year_id">
              <SelectValue placeholder="Select academic year (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Academic Year</SelectItem>
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
          {isSubmitting ? "Updating..." : "Update Timetable Entry"}
        </Button>
      </div>
    </form>
  );
}
