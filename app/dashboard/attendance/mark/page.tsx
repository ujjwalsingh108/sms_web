import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarkAttendanceForm from "@/components/attendance/mark-attendance-form";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

async function getClasses() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) return [];

  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .eq("tenant_id", (member as any).tenant_id)
    .order("name");

  return classes || [];
}

export default async function MarkAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string; section?: string }>;
}) {
  const params = await searchParams;
  const classes = await getClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/attendance">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Mark Attendance
            </h1>
            <p className="text-muted-foreground mt-1">
              Mark attendance for students by class and section
            </p>
          </div>
        </div>

        {!classes || classes.length === 0 ? (
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="pt-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Classes Found</AlertTitle>
                <AlertDescription className="mt-2">
                  You need to create classes before you can mark attendance.
                  Please set up your academic structure first.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <MarkAttendanceForm
            classes={classes}
            preselectedClass={params.class}
            preselectedSection={params.section}
          />
        )}
      </div>
    </div>
  );
}
