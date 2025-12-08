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

        <div className="space-y-2 md:col-span-2">
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
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : exam ? "Update Exam" : "Create Exam"}
        </Button>
      </div>
    </form>
  );
}
