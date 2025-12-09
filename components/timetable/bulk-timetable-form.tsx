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
import { Card } from "@/components/ui/card";
import { bulkCreateTimetable } from "@/app/dashboard/timetable/actions";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

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

type TimetableEntry = {
  id: string;
  day_of_week: number;
  period_number: number;
  subject_id: string;
  teacher_id: string;
  start_time: string;
  end_time: string;
  room_number: string;
};

export default function BulkTimetableForm({
  classes,
  subjects,
  teachers,
  academicYears,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [entries, setEntries] = useState<TimetableEntry[]>([
    {
      id: "1",
      day_of_week: 1,
      period_number: 1,
      subject_id: "",
      teacher_id: "",
      start_time: "09:00",
      end_time: "09:45",
      room_number: "",
    },
  ]);
  const router = useRouter();

  const addEntry = () => {
    const lastEntry = entries[entries.length - 1];
    const newId = (parseInt(lastEntry.id) + 1).toString();
    setEntries([
      ...entries,
      {
        id: newId,
        day_of_week: lastEntry.day_of_week,
        period_number: lastEntry.period_number + 1,
        subject_id: "",
        teacher_id: "",
        start_time: lastEntry.end_time,
        end_time: incrementTime(lastEntry.end_time, 45),
        room_number: "",
      },
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof TimetableEntry, value: any) => {
    setEntries(
      entries.map((e) =>
        e.id === id
          ? {
              ...e,
              [field]:
                field === "day_of_week" || field === "period_number"
                  ? parseInt(value)
                  : value,
            }
          : e
      )
    );
  };

  const incrementTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(":").map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60) % 24;
    const newMins = totalMins % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(
      2,
      "0"
    )}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classId) {
      toast.error("Please select a class");
      return;
    }

    setIsSubmitting(true);

    const data = {
      class_id: classId,
      section_id: sectionId || undefined,
      academic_year_id: academicYearId || undefined,
      entries: entries.map((entry) => ({
        day_of_week: entry.day_of_week,
        period_number: entry.period_number,
        subject_id: entry.subject_id || undefined,
        teacher_id: entry.teacher_id || undefined,
        start_time: entry.start_time,
        end_time: entry.end_time,
        room_number: entry.room_number || undefined,
      })),
    };

    const result = await bulkCreateTimetable(data);

    if (result.success) {
      toast.success(`${entries.length} timetable entries created successfully`);
      router.push("/dashboard/timetable");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to create timetable entries");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="class_id">
            Class <span className="text-destructive">*</span>
          </Label>
          <Select value={classId} onValueChange={setClassId} required>
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
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            placeholder="e.g., A, B (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="academic_year_id">Academic Year</Label>
          <Select value={academicYearId} onValueChange={setAcademicYearId}>
            <SelectTrigger id="academic_year_id">
              <SelectValue placeholder="Select year (optional)" />
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Timetable Entries ({entries.length})
          </h3>
          <Button type="button" onClick={addEntry} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>

        <div className="space-y-4">
          {entries.map((entry, index) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-medium">Entry {index + 1}</h4>
                {entries.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select
                    value={entry.day_of_week.toString()}
                    onValueChange={(v) =>
                      updateEntry(entry.id, "day_of_week", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Period</Label>
                  <Input
                    type="number"
                    min="1"
                    value={entry.period_number}
                    onChange={(e) =>
                      updateEntry(entry.id, "period_number", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={entry.start_time}
                    onChange={(e) =>
                      updateEntry(entry.id, "start_time", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={entry.end_time}
                    onChange={(e) =>
                      updateEntry(entry.id, "end_time", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select
                    value={entry.subject_id}
                    onValueChange={(v) =>
                      updateEntry(entry.id, "subject_id", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Teacher</Label>
                  <Select
                    value={entry.teacher_id}
                    onValueChange={(v) =>
                      updateEntry(entry.id, "teacher_id", v)
                    }
                  >
                    <SelectTrigger>
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

                <div className="space-y-2 md:col-span-2">
                  <Label>Room Number</Label>
                  <Input
                    value={entry.room_number}
                    onChange={(e) =>
                      updateEntry(entry.id, "room_number", e.target.value)
                    }
                    placeholder="e.g., Room 101"
                  />
                </div>
              </div>
            </Card>
          ))}
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
        <Button type="submit" disabled={isSubmitting || !classId}>
          {isSubmitting ? "Creating..." : `Create ${entries.length} Entries`}
        </Button>
      </div>
    </form>
  );
}
