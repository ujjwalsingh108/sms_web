import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Calendar, Filter, Edit } from "lucide-react";
import Link from "next/link";
import { getLibraryReportById } from "../../actions";
import { redirect } from "next/navigation";
import { DownloadReportButton } from "@/components/library/download-report-button";

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

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLibraryReportById(id);

  if (!result.success || !result.data) {
    redirect("/dashboard/library/reports");
  }

  const report = result.data;

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
      <Badge variant={variants[status] || "outline"} className="text-sm">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/library/reports">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {report.report_name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Report details and configuration
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {report.status === "completed" && (
              <DownloadReportButton report={report} />
            )}
            <Link href={`/dashboard/library/reports/${report.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Report Type</p>
                <p className="font-medium">
                  {reportTypeLabels[report.report_type] || report.report_type}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(report.status)}</div>
              </div>
              {report.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{report.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-green-500 dark:text-green-400" />
                Date Range & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Date Range</p>
                <p className="font-medium">
                  {report.date_from && report.date_to
                    ? `${new Date(
                        report.date_from
                      ).toLocaleDateString()} - ${new Date(
                        report.date_to
                      ).toLocaleDateString()}`
                    : "All time"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
              {report.generated_at && (
                <div>
                  <p className="text-sm text-muted-foreground">Generated At</p>
                  <p className="font-medium">
                    {new Date(report.generated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              Filters & Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(report.filters, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {report.status === "completed" && report.filters?.data && (
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                Report Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                {JSON.stringify(report.filters.data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
