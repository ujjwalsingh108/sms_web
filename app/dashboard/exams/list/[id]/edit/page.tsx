import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getExamById, getExamTypes } from "../../../actions";
import ExamForm from "@/components/exams/exam-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExamPage({ params }: PageProps) {
  const resolvedParams = await params;
  const examResult = await getExamById(resolvedParams.id);

  if (!examResult.success || !examResult.data) {
    notFound();
  }

  const typesResult = await getExamTypes();
  const examTypes = typesResult.success ? typesResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/exams/list/${resolvedParams.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Exam</h1>
          <p className="text-muted-foreground">
            Update examination session details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamForm exam={examResult.data} examTypes={examTypes || []} />
        </CardContent>
      </Card>
    </div>
  );
}
