import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getExamTypes } from "../actions";
import ExamTypesListClient from "@/components/exams/exam-types-list-client";

export const dynamic = "force-dynamic";

export default async function ExamTypesPage() {
  const typesResult = await getExamTypes();
  const examTypes = typesResult.success ? typesResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Types</h1>
          <p className="text-muted-foreground">
            Manage different types of examinations
          </p>
        </div>
        <Link href="/dashboard/exams/types/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Exam Type
          </Button>
        </Link>
      </div>

      <ExamTypesListClient initialData={examTypes || []} />
    </div>
  );
}
