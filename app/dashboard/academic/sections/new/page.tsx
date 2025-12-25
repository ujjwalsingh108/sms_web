import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getClasses } from "@/app/dashboard/academic/actions";
import { CreateSectionForm } from "@/components/academic/create-section-form";

export default async function NewSectionPage() {
  const classesResult = await getClasses();
  const classes = classesResult.success ? classesResult.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/academic">
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Add New Section
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new section within a class
            </p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Section Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateSectionForm classes={classes || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
