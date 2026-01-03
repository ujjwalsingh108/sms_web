import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  ClipboardCheck,
  Clock,
  Plus,
  List,
} from "lucide-react";
import Link from "next/link";
import { getExamStats, getExams } from "./actions";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const statsResult = await getExamStats();
  const stats = statsResult.success ? statsResult.data : null;

  const examsResult = await getExams();
  const recentExams = examsResult.success ? examsResult.data?.slice(0, 5) : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Examinations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage exams, schedules, and results
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Exams
            </CardTitle>
            <div className="p-2 rounded-lg primary-gradient">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {stats?.total || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All exam records
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Scheduled
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {stats?.scheduled || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upcoming exams
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ongoing
            </CardTitle>
            <div className="p-2 rounded-lg warning-gradient">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
              {stats?.ongoing || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Completed
            </CardTitle>
            <div className="p-2 rounded-lg success-gradient">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {stats?.completed || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Finished exams
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <List className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Exam Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage examination types
            </p>
            <div className="flex gap-2">
              <Link href="/dashboard/exams/types" className="flex-1">
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </Link>
              <Link href="/dashboard/exams/types/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FileText className="h-5 w-5 text-green-500 dark:text-green-400" />
              Exams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and manage exam sessions
            </p>
            <div className="flex gap-2">
              <Link href="/dashboard/exams/list" className="flex-1">
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </Link>
              <Link href="/dashboard/exams/list/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Calendar className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              Schedules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Schedule exams for classes
            </p>
            <div className="flex gap-2">
              <Link href="/dashboard/exams/schedules" className="flex-1">
                <Button variant="outline" className="w-full">
                  View All
                </Button>
              </Link>
              <Link href="/dashboard/exams/schedules/new">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <ClipboardCheck className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter and view examination results
            </p>
            <Link href="/dashboard/exams/results" className="block">
              <Button variant="outline" className="w-full">
                Manage Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exams */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Exams</CardTitle>
            <Link href="/dashboard/exams/list">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentExams && recentExams.length > 0 ? (
            <div className="space-y-3">
              {recentExams.map((exam: any) => (
                <div
                  key={exam.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors gap-2"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{exam.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exam.exam_type?.name || "N/A"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        exam.status === "scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : exam.status === "ongoing"
                          ? "bg-yellow-100 text-yellow-700"
                          : exam.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {exam.status}
                    </span>
                    {exam.start_date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(exam.start_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No exams found</p>
              <Link href="/dashboard/exams/list/new">
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Exam
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
