import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExamForm from "@/components/exams/exam-form";
import { getExamTypes } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewExamPage() {
  const typesResult = await getExamTypes();
  const examTypes = typesResult.success ? typesResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams/list">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Exam</h1>
          <p className="text-muted-foreground">
            Set up a new examination session
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamForm examTypes={examTypes || []} />
        </CardContent>
      </Card>
    </div>
  );
}
