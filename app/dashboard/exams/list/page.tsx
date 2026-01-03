import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getExams } from "../actions";
import ExamsListClient from "@/components/exams/exams-list-client";

export const dynamic = "force-dynamic";

export default async function ExamsListPage() {
  const examsResult = await getExams();
  const exams = examsResult.success ? examsResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Exams</h1>
            <p className="text-muted-foreground">
              Manage all examination sessions
            </p>
          </div>
          <Link href="/dashboard/exams/list/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </Link>
        </div>
      </div>

      <ExamsListClient initialData={exams || []} />
    </div>
  );
}
