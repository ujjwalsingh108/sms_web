"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StaffAttendanceTableProps = {
  attendance: any[];
};

export default function StaffAttendanceTable({
  attendance,
}: StaffAttendanceTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "half_day":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "on_leave":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  if (attendance.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Date</TableHead>
            <TableHead className="min-w-[150px]">Staff Member</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[120px]">
              Employee ID
            </TableHead>
            <TableHead className="hidden md:table-cell min-w-[120px]">
              Department
            </TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="hidden lg:table-cell min-w-[100px]">
              Check In
            </TableHead>
            <TableHead className="hidden lg:table-cell min-w-[100px]">
              Check Out
            </TableHead>
            <TableHead className="hidden xl:table-cell min-w-[150px]">
              Notes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record: any) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium text-sm">
                {new Date(record.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-sm">
                {record.staff?.first_name} {record.staff?.last_name}
              </TableCell>
              <TableCell className="hidden sm:table-cell font-mono text-xs">
                {record.staff?.employee_id}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {record.staff?.department || "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(record.status)}
                >
                  {record.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {record.check_in || "N/A"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {record.check_out || "N/A"}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                {record.notes || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
