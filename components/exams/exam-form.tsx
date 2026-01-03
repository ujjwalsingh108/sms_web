"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExam, updateExam } from "@/app/dashboard/exams/actions";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Calendar, Save } from "lucide-react";

type ExamType = {
  id: string;
  name: string;
};

type Exam = {
  id: string;
  name: string;
  exam_type_id: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

type Props = {
  exam?: Exam;
  examTypes: ExamType[];
};

export default function ExamForm({ exam, examTypes }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;
    const status = formData.get("status") as string;

    const data = {
      name: formData.get("name") as string,
      exam_type_id: formData.get("exam_type_id") as string,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      status: (status || "scheduled") as
        | "scheduled"
        | "ongoing"
        | "completed"
        | "cancelled",
    };

    const result = exam
      ? await updateExam(exam.id, data)
      : await createExam(data);

    if (result.success) {
      toast.success(
        exam ? "Exam updated successfully" : "Exam created successfully"
      );
      router.push("/dashboard/exams/list");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save exam");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            Exam Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Exam Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={exam?.name}
                placeholder="e.g., Mid-Term Examination 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_type_id">
                Exam Type <span className="text-destructive">*</span>
              </Label>
              <Select
                name="exam_type_id"
                defaultValue={exam?.exam_type_id}
                required
              >
                <SelectTrigger id="exam_type_id">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calendar className="h-5 w-5 text-green-500 dark:text-green-400" />
            Schedule & Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={exam?.start_date || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={exam?.end_date || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={exam?.status || "scheduled"}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {exam ? "Update Exam" : "Create Exam"}
            </>
          )}
        </Button>
        <Link href="/dashboard/exams/list" className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
