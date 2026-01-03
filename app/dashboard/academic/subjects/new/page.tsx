import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SubjectForm } from "@/components/academic/subject-form";
import { getClasses } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewSubjectPage() {
  const classesResult = await getClasses();
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
              Add New Subject
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new subject and assign it to classes
            </p>
          </div>
        </div>

        <SubjectForm classes={classes || []} mode="create" />
      </div>
    </div>
  );
}
