"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  LibraryReport,
  deleteLibraryReport,
  generateLibraryReport,
} from "@/app/dashboard/library/actions";
import {
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  PlayCircle,
  FileDown,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateLibraryReportPDF } from "@/lib/utils/pdf-generator";
import { toast } from "sonner";

type ReportsTableProps = {
  reports: LibraryReport[];
};

const reportTypeLabels: Record<string, string> = {
  books_inventory: "Books Inventory",
  issued_books: "Issued Books",
  overdue_books: "Overdue Books",
  returned_books: "Returned Books",
  student_history: "Student History",
  popular_books: "Popular Books",
  fine_collection: "Fine Collection",
  monthly_summary: "Monthly Summary",
  annual_summary: "Annual Summary",
};

export default function ReportsTable({ reports }: ReportsTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteLibraryReport(deleteId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleGenerate = async (id: string) => {
    setIsGenerating(id);
    try {
      await generateLibraryReport(id);
      router.refresh();
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDownload = (report: LibraryReport) => {
    try {
      generateLibraryReportPDF(report);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      draft: "outline",
      generating: "secondary",
      completed: "default",
      failed: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (reports.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Generated At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  {report.report_name}
                </TableCell>
                <TableCell>
                  {reportTypeLabels[report.report_type] || report.report_type}
                </TableCell>
                <TableCell>
                  {report.date_from && report.date_to
                    ? `${new Date(
                        report.date_from
                      ).toLocaleDateString()} - ${new Date(
                        report.date_to
                      ).toLocaleDateString()}`
                    : "All time"}
                </TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell>
                  {report.generated_at
                    ? new Date(report.generated_at).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/library/reports/${report.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {report.status === "draft" && (
                        <DropdownMenuItem
                          onClick={() => handleGenerate(report.id)}
                          disabled={isGenerating === report.id}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          {isGenerating === report.id
                            ? "Generating..."
                            : "Generate Report"}
                        </DropdownMenuItem>
                      )}
                      {report.status === "completed" && (
                        <DropdownMenuItem
                          onClick={() => handleDownload(report)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/library/reports/${report.id}/edit`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteId(report.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this report. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
