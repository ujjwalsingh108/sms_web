import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MarkAttendanceForm from "@/components/attendance/mark-attendance-form";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
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
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Mark Attendance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mark attendance for students by class and section
        </p>
      </div>

      {!classes || classes.length === 0 ? (
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Attendance Marking</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading form...</div>}>
              <MarkAttendanceForm
                classes={classes}
                preselectedClass={params.class}
                preselectedSection={params.section}
              />
            </Suspense>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
