"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "half_day" | "late";
  remarks: string | null;
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
}

export default function AttendanceCalendar({
  records,
}: AttendanceCalendarProps) {
  // Create a map of date -> status for quick lookup
  const attendanceMap = new Map(
    records.map((record) => [record.date, record.status])
  );

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 border-gray-200";

    switch (status) {
      case "present":
        return "bg-green-100 border-green-300 text-green-800";
      case "absent":
        return "bg-red-100 border-red-300 text-red-800";
      case "half_day":
        return "bg-orange-100 border-orange-300 text-orange-800";
      case "late":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span className="text-sm">Half Day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span className="text-sm">Late</span>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-center">
              {firstDay.toLocaleString("default", { month: "long" })}{" "}
              {currentYear}
            </h3>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="p-2"></div>;
              }

              const dateStr = `${currentYear}-${String(
                currentMonth + 1
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const status = attendanceMap.get(dateStr);
              const isToday =
                day === now.getDate() &&
                currentMonth === now.getMonth() &&
                currentYear === now.getFullYear();

              return (
                <div
                  key={day}
                  className={`
                    p-2 text-center border rounded-md transition-colors
                    ${getStatusColor(status)}
                    ${isToday ? "ring-2 ring-blue-500" : ""}
                  `}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {status && (
                    <div className="text-xs mt-1 capitalize">
                      {status === "half_day" ? "Half" : status[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
