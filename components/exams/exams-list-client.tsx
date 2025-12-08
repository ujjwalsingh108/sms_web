"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
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
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Exam = {
  id: string;
  name: string;
  exam_type?: { name: string } | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
};

type Props = {
  initialData: Exam[];
};

export default function ExamsListClient({ initialData }: Props) {
  const [exams, setExams] = useState(initialData);
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const filteredExams =
    statusFilter === "all"
      ? exams
      : exams.filter((exam) => exam.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (exams.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground mb-4">No exams found</p>
        <Link href="/dashboard/exams/list/new">
          <Button>Create First Exam</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-1">
          <Label htmlFor="status-filter" className="text-sm font-medium mb-2">
            Filter by Status
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter" className="w-full md:w-[200px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredExams.length} of {exams.length} exams
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{exam.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exam.exam_type?.name || "No type"}
                  </p>
                </div>
                <Badge className={getStatusColor(exam.status)}>
                  {exam.status}
                </Badge>
              </div>
              <div className="text-sm space-y-1">
                {exam.start_date && (
                  <div className="text-muted-foreground">
                    Start: {new Date(exam.start_date).toLocaleDateString()}
                  </div>
                )}
                {exam.end_date && (
                  <div className="text-muted-foreground">
                    End: {new Date(exam.end_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/dashboard/exams/list/${exam.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/exams/list/${exam.id}/edit`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{exam.exam_type?.name || "—"}</TableCell>
                  <TableCell>
                    {exam.start_date
                      ? new Date(exam.start_date).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {exam.end_date
                      ? new Date(exam.end_date).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/exams/list/${exam.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/exams/list/${exam.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {filteredExams.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No exams found with status: {statusFilter}
          </p>
        </Card>
      )}
    </div>
  );
}

function Label({
  htmlFor,
  className,
  children,
}: {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}
