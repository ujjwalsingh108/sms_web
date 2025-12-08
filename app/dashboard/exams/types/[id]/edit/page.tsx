import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams/types">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Exam Type</h1>
          <p className="text-muted-foreground">
            Update examination type details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamTypeForm examType={typeResult.data} />
        </CardContent>
      </Card>
    </div>
  );
}
