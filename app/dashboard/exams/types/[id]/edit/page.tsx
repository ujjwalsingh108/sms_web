import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getExamTypeById } from "../../../actions";
import ExamTypeForm from "@/components/exams/exam-type-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExamTypePage({ params }: PageProps) {
  const resolvedParams = await params;
  const typeResult = await getExamTypeById(resolvedParams.id);

  if (!typeResult.success || !typeResult.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exams/types">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Exam Type
            </h1>
            <p className="text-muted-foreground mt-1">
              Update examination type details
            </p>
          </div>
        </div>

        <ExamTypeForm examType={typeResult.data} />
      </div>
    </div>
  );
}
