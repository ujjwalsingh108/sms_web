import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { getClasses } from "./actions";
import TimetableSelector from "@/components/timetable/timetable-selector";

export const dynamic = "force-dynamic";

export default async function TimetablePage() {
  const classesResult = await getClasses();
  const classes = classesResult.success ? classesResult.data : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
          Timetable Management
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
          Manage class schedules and periods
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-4">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Classes
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {classes?.length || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              With configured timetables
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Working Days
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              6
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Monday to Saturday
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Periods/Day
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              8
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Standard periods
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subjects
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              -
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Across all classes
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <CardTitle>View Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <TimetableSelector classes={classes || []} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/timetable/create" className="block">
              <Button className="w-full justify-start bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:opacity-90 shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Create New Timetable
              </Button>
            </Link>
            <Link href="/dashboard/timetable/bulk" className="block">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90 shadow-md">
                <Calendar className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Ensure no teacher is assigned to multiple classes in the same
                  period
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Verify period timings don&apos;t overlap for the same class
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Plan breaks and lunch periods appropriately</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Assign rooms to avoid conflicts in lab and special classrooms
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
