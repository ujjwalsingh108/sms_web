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
import { bulkCreateExamResults } from "@/app/dashboard/exams/actions";
import { toast } from "sonner";
import { Save, CheckCircle2 } from "lucide-react";

type Student = {
  id: string;
  user: {
    first_name: string;
    last_name: string;
  };
  admission_number: string;
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
    if (!grade) return "bg-gray-100 text-gray-700";
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade === "C") return "bg-yellow-100 text-yellow-700";
    if (grade === "D") return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
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
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Enter Student Marks</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {filledCount} / {students.length} completed
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || filledCount === 0}
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
                <Card key={student.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {student.user.first_name} {student.user.last_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {student.admission_number}
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
                          value={studentResult?.marks_obtained ?? ""}
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
                        {student.admission_number}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.user.first_name} {student.user.last_name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={maxMarks}
                          step="0.5"
                          value={studentResult?.marks_obtained ?? ""}
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
