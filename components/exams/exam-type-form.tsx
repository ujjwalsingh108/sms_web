"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createExamType, updateExamType } from "@/app/dashboard/exams/actions";
import { toast } from "sonner";

type ExamType = {
  id: string;
  name: string;
  description: string | null;
};

type Props = {
  examType?: ExamType;
};

export default function ExamTypeForm({ examType }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;

    const data = {
      name: formData.get("name") as string,
      description: description || undefined,
    };

    const result = examType
      ? await updateExamType(examType.id, data)
      : await createExamType(data);

    if (result.success) {
      toast.success(
        examType
          ? "Exam type updated successfully"
          : "Exam type created successfully"
      );
      router.push("/dashboard/exams/types");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to save exam type");
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Exam Type Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          defaultValue={examType?.name}
          placeholder="e.g., Mid-Term, Final, Unit Test"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={examType?.description || ""}
          placeholder="Optional description of this exam type"
          rows={4}
        />
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
          {isSubmitting
            ? "Saving..."
            : examType
            ? "Update Exam Type"
            : "Create Exam Type"}
        </Button>
      </div>
    </form>
  );
}
