"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createExamType, updateExamType } from "@/app/dashboard/exams/actions";
import { toast } from "sonner";
import Link from "next/link";
import { FileText, Save } from "lucide-react";

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
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            Exam Type Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              {examType ? "Update Exam Type" : "Create Exam Type"}
            </>
          )}
        </Button>
        <Link href="/dashboard/exams/types" className="flex-1">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
