import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubjectForm } from "@/components/academic/subject-form";
import { getSubjectById, getClasses } from "../../../actions";

export const dynamic = "force-dynamic";

interface EditSubjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSubjectPage({
  params,
}: EditSubjectPageProps) {
  const { id } = await params;

  const [subjectResult, classesResult] = await Promise.all([
    getSubjectById(id),
    getClasses(),
  ]);

  if (!subjectResult.success || !subjectResult.data) {
    notFound();
  }

  const classes = classesResult.success ? classesResult.data : [];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/academic">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Subject
            </h1>
            <p className="text-muted-foreground mt-1">
              Update subject details and class assignments
            </p>
          </div>
        </div>

        <SubjectForm
          subject={subjectResult.data}
          classes={classes || []}
          mode="edit"
        />
      </div>
    </div>
  );
}
