"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  bulkCreateExamResults,
  getScheduleWithResults,
} from "@/app/dashboard/exams/actions";
import { toast } from "sonner";
import { Save, CheckCircle2, Download } from "lucide-react";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  admission_no: string;
};

type ExistingResult = {
  id: string;
  student_id: string;
  marks_obtained: number | null;
  grade: string | null;
  remarks: string | null;
};

type Props = {
  scheduleId: string;
  students: Student[];
  existingResults: ExistingResult[];
  maxMarks: number;
};

type ResultData = {
  student_id: string;
  marks_obtained: number | null;
  grade: string;
  remarks: string;
};

export default function ResultEntryForm({
  scheduleId,
  students,
  existingResults,
  maxMarks,
}: Props) {
  const [results, setResults] = useState<Map<string, ResultData>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialResults = new Map<string, ResultData>();

    students.forEach((student) => {
      const existing = existingResults.find((r) => r.student_id === student.id);

      initialResults.set(student.id, {
        student_id: student.id,
        marks_obtained: existing?.marks_obtained ?? null,
        grade: existing?.grade || "",
        remarks: existing?.remarks || "",
      });
    });

    setResults(initialResults);
  }, [students, existingResults]);

  const loadScheduleData = async () => {
    setLoadingPDF(true);
    const result = await getScheduleWithResults(scheduleId);
    if (result.success) {
      setScheduleData(result.data);
      // Trigger PDF generation after data is loaded
      setTimeout(() => {
        generateMarkSheetPDF(result.data);
      }, 100);
    } else {
      toast.error("Failed to load schedule data");
    }
    setLoadingPDF(false);
  };

  const generateMarkSheetPDF = async (data: any) => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF() as any;
      const schedule = data.schedule;
      const results = data.results;

      // Header
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text("MARK SHEET", 105, 20, { align: "center" });

      // Exam Info
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      doc.text(`Exam: ${schedule.exam.name}`, 20, 32);
      doc.text(`Type: ${schedule.exam.exam_type.name}`, 20, 39);
      doc.text(`Class: ${schedule.class.name}`, 20, 46);
      doc.text(
        `Subject: ${schedule.subject.code} - ${schedule.subject.name}`,
        20,
        53
      );
      doc.text(
        `Date: ${new Date(schedule.exam_date).toLocaleDateString()}`,
        20,
        60
      );
      doc.text(`Maximum Marks: ${schedule.max_marks}`, 20, 67);

      // Results Table
      const tableData = results
        .sort((a: any, b: any) =>
          a.student.admission_no.localeCompare(b.student.admission_no)
        )
        .map((result: any, index: number) => [
          (index + 1).toString(),
          result.student.admission_no,
          `${result.student.first_name} ${result.student.last_name}`,
          result.is_absent
            ? "Absent"
            : result.marks_obtained?.toString() || "-",
          result.is_absent
            ? "-"
            : result.marks_obtained
            ? `${((result.marks_obtained / schedule.max_marks) * 100).toFixed(
                1
              )}%`
            : "-",
          result.grade || "-",
        ]);

      autoTable(doc, {
        startY: 75,
        head: [
          [
            "S.No",
            "Admission No",
            "Student Name",
            "Marks Obtained",
            "Percentage",
            "Grade",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 10,
          cellPadding: 4,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
        },
      });

      // Statistics
      const validResults = results.filter(
        (r: any) => !r.is_absent && r.marks_obtained !== null
      );
      if (validResults.length > 0) {
        const totalMarks = validResults.reduce(
          (sum: number, r: any) => sum + (r.marks_obtained || 0),
          0
        );
        const average = (totalMarks / validResults.length).toFixed(2);
        const highest = Math.max(
          ...validResults.map((r: any) => r.marks_obtained || 0)
        );
        const lowest = Math.min(
          ...validResults.map((r: any) => r.marks_obtained || 0)
        );

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont(undefined, "bold");
        doc.setFontSize(11);
        doc.text("Class Statistics", 20, finalY);
        doc.setFont(undefined, "normal");
        doc.setFontSize(10);
        doc.text(`Total Students: ${results.length}`, 20, finalY + 7);
        doc.text(`Present: ${validResults.length}`, 20, finalY + 14);
        doc.text(
          `Absent: ${results.length - validResults.length}`,
          20,
          finalY + 21
        );
        doc.text(`Class Average: ${average}`, 20, finalY + 28);
        doc.text(`Highest: ${highest}`, 20, finalY + 35);
        doc.text(`Lowest: ${lowest}`, 20, finalY + 42);
      }

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        20,
        pageHeight - 15
      );
      doc.text("___________________", 20, pageHeight - 25);
      doc.text("Teacher's Signature", 20, pageHeight - 20);

      // Save PDF
      const fileName = `${schedule.class.name}_${
        schedule.subject.code
      }_${schedule.exam.name.replace(/\s+/g, "_")}_MarkSheet.pdf`;
      doc.save(fileName);

      toast.success("Mark sheet downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const calculateGrade = (marks: number | null): string => {
    if (marks === null || marks < 0) return "";
    const percentage = (marks / maxMarks) * 100;

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const updateResult = (
    studentId: string,
    field: keyof ResultData,
    value: any
  ) => {
    setResults((prev) => {
      const newResults = new Map(prev);
      const current = newResults.get(studentId)!;

      if (field === "marks_obtained") {
        const marks = value === "" ? null : parseFloat(value);
        const grade = calculateGrade(marks);
        newResults.set(studentId, {
          ...current,
          marks_obtained: marks,
          grade,
        });
      } else {
        newResults.set(studentId, {
          ...current,
          [field]: value,
        });
      }

      return newResults;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const resultsData = Array.from(results.values())
      .filter((r) => r.marks_obtained !== null)
      .map((r) => ({
        exam_schedule_id: scheduleId,
        student_id: r.student_id,
        marks_obtained: r.marks_obtained!,
        grade: r.grade || null,
        remarks: r.remarks || null,
      }));

    if (resultsData.length === 0) {
      toast.error("Please enter marks for at least one student");
      setIsSubmitting(false);
      return;
    }

    const result = await bulkCreateExamResults(resultsData);

    if (result.success) {
      toast.success(`Results saved for ${resultsData.length} students`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save results");
    }
    setIsSubmitting(false);
  };

  const getGradeColor = (grade: string) => {
    if (!grade) return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    if (grade.startsWith("A"))
      return "bg-gradient-to-r from-green-500 to-green-600 text-white";
    if (grade.startsWith("B"))
      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    if (grade === "C")
      return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white";
    if (grade === "D")
      return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
    return "bg-gradient-to-r from-red-500 to-red-600 text-white";
  };

  const filledCount = Array.from(results.values()).filter(
    (r) => r.marks_obtained !== null
  ).length;

  if (students.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No students found for this class
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg md:text-xl">
              Enter Student Marks
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm text-muted-foreground">
                {filledCount} / {students.length} completed
              </div>
              {existingResults.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadScheduleData}
                  disabled={loadingPDF}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {loadingPDF ? "Loading..." : "Export Mark Sheet"}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || filledCount === 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Results"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {students.map((student) => {
              const studentResult = results.get(student.id);
              const hasResult = existingResults.some(
                (r) => r.student_id === student.id
              );

              return (
                <Card
                  key={student.id}
                  className="p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {student.first_name} {student.last_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {student.admission_no}
                        </p>
                      </div>
                      {hasResult && (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Saved
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`marks-${student.id}`}
                          className="text-xs"
                        >
                          Marks (Max: {maxMarks})
                        </Label>
                        <Input
                          id={`marks-${student.id}`}
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={
                            studentResult?.marks_obtained === null
                              ? ""
                              : studentResult?.marks_obtained
                          }
                          onChange={(e) =>
                            updateResult(
                              student.id,
                              "marks_obtained",
                              e.target.value
                            )
                          }
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Grade</Label>
                        <div className="h-10 flex items-center">
                          {studentResult?.grade ? (
                            <Badge
                              className={getGradeColor(studentResult.grade)}
                            >
                              {studentResult.grade}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              —
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`remarks-${student.id}`}
                        className="text-xs"
                      >
                        Remarks
                      </Label>
                      <Input
                        id={`remarks-${student.id}`}
                        value={studentResult?.remarks ?? ""}
                        onChange={(e) =>
                          updateResult(student.id, "remarks", e.target.value)
                        }
                        placeholder="Optional remarks"
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Marks (/{maxMarks})</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const studentResult = results.get(student.id);
                  const hasResult = existingResults.some(
                    (r) => r.student_id === student.id
                  );

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm">
                        {student.admission_no}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.first_name} {student.last_name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={
                            studentResult?.marks_obtained === null
                              ? ""
                              : studentResult?.marks_obtained
                          }
                          onChange={(e) =>
                            updateResult(
                              student.id,
                              "marks_obtained",
                              e.target.value
                            )
                          }
                          placeholder="0"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        {studentResult?.grade ? (
                          <Badge className={getGradeColor(studentResult.grade)}>
                            {studentResult.grade}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={studentResult?.remarks ?? ""}
                          onChange={(e) =>
                            updateResult(student.id, "remarks", e.target.value)
                          }
                          placeholder="Optional"
                          className="w-48"
                        />
                      </TableCell>
                      <TableCell>
                        {hasResult && (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Saved
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
