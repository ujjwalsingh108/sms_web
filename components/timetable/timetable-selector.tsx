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
import {
  getTimetables,
  getSectionsByClass,
} from "@/app/dashboard/timetable/actions";
import { getDayName, formatTime } from "@/lib/timetable-utils";
import { Calendar, Download } from "lucide-react";

type Class = {
  id: string;
  name: string;
};

type Props = {
  classes: Class[];
};

export default function TimetableSelector({ classes }: Props) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [sections, setSections] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSections = async () => {
    const result = await getSectionsByClass(selectedClass);
    if (result.success) {
      setSections(result.data || []);
    }
  };

  const loadTimetable = async () => {
    setLoading(true);
    const result = await getTimetables(
      selectedClass,
      selectedSection || undefined
    );
    if (result.success) {
      setTimetable(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClass) {
      loadSections();
      setSelectedSection("");
    } else {
      setSections([]);
      setTimetable([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass) {
      loadTimetable();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedSection]);

  // Organize timetable into a grid
  const organizeTimeTable = () => {
    const days = [1, 2, 3, 4, 5, 6]; // Monday to Saturday
    const maxPeriods = Math.max(
      ...timetable.map((t: any) => t.period_number),
      0
    );
    const grid: any[][] = Array(days.length)
      .fill(null)
      .map(() => Array(maxPeriods).fill(null));

    timetable.forEach((entry: any) => {
      const dayIndex = entry.day_of_week - 1;
      const periodIndex = entry.period_number - 1;
      if (dayIndex >= 0 && dayIndex < days.length && periodIndex >= 0) {
        grid[dayIndex][periodIndex] = entry;
      }
    });

    return { grid, days, maxPeriods };
  };

  if (classes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No classes available
      </div>
    );
  }

  const { grid, days, maxPeriods } =
    timetable.length > 0
      ? organizeTimeTable()
      : { grid: [], days: [], maxPeriods: 0 };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="class-select">Select Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger id="class-select">
              <SelectValue placeholder="Choose a class" />
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

        {sections.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="section-select">Select Section (Optional)</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger id="section-select">
                <SelectValue placeholder="All sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sections</SelectItem>
                {sections.map((section: any) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedClass && timetable.length > 0 && (
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading timetable...
        </div>
      )}

      {!loading && selectedClass && timetable.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground mb-4">
            No timetable found for this class
          </p>
          <Button asChild>
            <a href="/dashboard/timetable/create">Create Timetable</a>
          </Button>
        </Card>
      )}

      {!loading && timetable.length > 0 && (
        <>
          {/* Desktop View - Table */}
          <div className="hidden lg:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left font-semibold">
                        Day/Period
                      </th>
                      {Array.from({ length: maxPeriods }, (_, i) => (
                        <th
                          key={i}
                          className="border p-3 text-center font-semibold"
                        >
                          Period {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day, dayIndex) => (
                      <tr key={day}>
                        <td className="border p-3 font-semibold bg-muted/50">
                          {getDayName(day)}
                        </td>
                        {grid[dayIndex].map(
                          (entry: any, periodIndex: number) => (
                            <td key={periodIndex} className="border p-2">
                              {entry ? (
                                <div className="space-y-1">
                                  <div className="font-semibold text-sm">
                                    {entry.subject?.name || "—"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {entry.teacher
                                      ? `${entry.teacher.first_name} ${entry.teacher.last_name}`
                                      : "No teacher"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatTime(entry.start_time)} -{" "}
                                    {formatTime(entry.end_time)}
                                  </div>
                                  {entry.room_number && (
                                    <div className="text-xs text-muted-foreground">
                                      Room: {entry.room_number}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-muted-foreground text-sm">
                                  —
                                </div>
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile/Tablet View - Cards */}
          <div className="lg:hidden space-y-4">
            {days.map((day, dayIndex) => (
              <Card key={day} className="p-4">
                <h3 className="font-semibold text-lg mb-3">
                  {getDayName(day)}
                </h3>
                <div className="space-y-3">
                  {grid[dayIndex].map(
                    (entry: any, periodIndex: number) =>
                      entry && (
                        <div
                          key={periodIndex}
                          className="border-l-4 border-primary pl-3 py-2"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold">
                              Period {periodIndex + 1}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(entry.start_time)} -{" "}
                              {formatTime(entry.end_time)}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            {entry.subject?.name || "—"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.teacher
                              ? `${entry.teacher.first_name} ${entry.teacher.last_name}`
                              : "No teacher"}
                          </div>
                          {entry.room_number && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Room: {entry.room_number}
                            </div>
                          )}
                        </div>
                      )
                  )}
                  {grid[dayIndex].every((e: any) => !e) && (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      No periods scheduled
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
