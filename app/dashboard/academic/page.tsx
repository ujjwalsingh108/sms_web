import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Users, Grid3x3, Layers } from "lucide-react";
import Link from "next/link";
import { getClasses, getAcademicStats } from "./actions";
import { ClassesTable } from "@/components/academic/classes-table";

export const dynamic = "force-dynamic";

export default async function AcademicPage() {
  const [classesResult, statsResult] = await Promise.all([
    getClasses(),
    getAcademicStats(),
  ]);

  const classes = classesResult.success ? classesResult.data : [];
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Academic Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage classes, sections, and academic structure
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/academic/sections/new">
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </Link>
            <Link href="/dashboard/academic/classes/new">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Classes
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {stats?.classCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active classes
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Sections
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500">
                <Grid3x3 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {stats?.sectionCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all classes
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {stats?.studentCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active students
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                <Layers className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stats?.subjectCount || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total subjects
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">Classes & Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassesTable classes={classes || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
