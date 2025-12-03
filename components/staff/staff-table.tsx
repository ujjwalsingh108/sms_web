"use client";

import { type Staff } from "@/app/dashboard/staff/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type StaffTableProps = {
  staff: Staff[];
  onDelete: (id: string) => Promise<void>;
};

export default function StaffTable({ staff, onDelete }: StaffTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "on_leave":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  if (staff.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No staff members found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Employee ID</TableHead>
            <TableHead className="min-w-[150px]">Name</TableHead>
            <TableHead className="hidden md:table-cell min-w-[120px]">
              Designation
            </TableHead>
            <TableHead className="hidden lg:table-cell min-w-[120px]">
              Department
            </TableHead>
            <TableHead className="hidden sm:table-cell min-w-[180px]">
              Email
            </TableHead>
            <TableHead className="hidden xl:table-cell min-w-[120px]">
              Phone
            </TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="text-right min-w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-mono text-xs sm:text-sm">
                {member.employee_id}
              </TableCell>
              <TableCell className="font-medium text-sm sm:text-base">
                {member.first_name} {member.last_name}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm">
                {member.designation || "N/A"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">
                {member.department || "N/A"}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                {member.email}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-sm">
                {member.phone || "N/A"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(member.status)}
                >
                  {member.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/staff/${member.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </Link>
                  <Link href={`/dashboard/staff/${member.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
