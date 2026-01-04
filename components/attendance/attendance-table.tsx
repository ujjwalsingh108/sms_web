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

interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "half_day" | "late";
  remarks: string | null;
  student: {
    id: string;
    admission_no: string;
    first_name: string;
    last_name: string;
    class: { id: string; name: string } | null;
    section: { id: string; name: string } | null;
  };
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

export default function AttendanceTable({ records }: AttendanceTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      present: { variant: "default", label: "Present" },
      absent: { variant: "destructive", label: "Absent" },
      half_day: { variant: "secondary", label: "Half Day" },
      late: { variant: "outline", label: "Late" },
    };

    const config = variants[status] || { variant: "default", label: status };

    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  if (!records || records.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No attendance records found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Admission No</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {new Date(record.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {record.student.admission_no}
              </TableCell>
              <TableCell>
                {record.student.first_name} {record.student.last_name}
              </TableCell>
              <TableCell>{record.student.class?.name || "N/A"}</TableCell>
              <TableCell>{record.student.section?.name || "N/A"}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {record.remarks || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
