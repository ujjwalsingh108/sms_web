import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExamTypeForm from "@/components/exams/exam-type-form";

export default function NewExamTypePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams/types">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Exam Type</h1>
          <p className="text-muted-foreground">Create a new examination type</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Type Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamTypeForm />
        </CardContent>
      </Card>
    </div>
  );
}
