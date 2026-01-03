"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LibraryReport,
  createLibraryReport,
  updateLibraryReport,
} from "@/app/dashboard/library/actions";
import { ArrowLeft, FileText, Calendar, Filter, Save } from "lucide-react";
import Link from "next/link";

type ReportFormProps = {
  report?: LibraryReport;
};

const reportTypes = [
  { value: "books_inventory", label: "Books Inventory" },
  { value: "issued_books", label: "Currently Issued Books" },
  { value: "overdue_books", label: "Overdue Books" },
  { value: "returned_books", label: "Returned Books" },
  { value: "student_history", label: "Student Borrowing History" },
  { value: "popular_books", label: "Popular Books" },
  { value: "fine_collection", label: "Fine Collection" },
  { value: "monthly_summary", label: "Monthly Summary" },
  { value: "annual_summary", label: "Annual Summary" },
];

export default function ReportForm({ report }: ReportFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(report?.report_type || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (report) {
        await updateLibraryReport(report.id, formData);
      } else {
        await createLibraryReport(formData);
      }
      router.push("/dashboard/library/reports");
      router.refresh();
    } catch (error) {
      console.error("Error saving report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Report Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="report_name">
                  Report Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="report_name"
                  name="report_name"
                  defaultValue={report?.report_name}
                  required
                  placeholder="Enter report name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report_type">
                  Report Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="report_type"
                  defaultValue={report?.report_type}
                  onValueChange={setSelectedType}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={report?.description || ""}
                  placeholder="Enter report description (optional)"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Calendar className="h-5 w-5 text-green-500 dark:text-green-400" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_from">From Date</Label>
                <Input
                  id="date_from"
                  name="date_from"
                  type="date"
                  defaultValue={report?.date_from || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_to">To Date</Label>
                <Input
                  id="date_to"
                  name="date_to"
                  type="date"
                  defaultValue={report?.date_to || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Filter className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="filters">Advanced Filters (JSON)</Label>
              <Textarea
                id="filters"
                name="filters"
                defaultValue={JSON.stringify(report?.filters || {}, null, 2)}
                placeholder='{"category": "Science", "status": "available"}'
                rows={5}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter filters as JSON object. Leave empty {} for no filters.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {report ? "Update Report" : "Create Report"}
              </>
            )}
          </Button>
          <Link href="/dashboard/library/reports" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
