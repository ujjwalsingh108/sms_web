import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentTransport } from "../actions";
import { StudentTransportClient } from "@/components/transport/student-transport-client";

type SearchParams = Promise<{
  routeId?: string;
}>;

export default async function StudentTransportPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const filters = {
    routeId: searchParams.routeId,
  };

  const assignments = await getStudentTransport(filters);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/transport">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Student Transport
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage student transport assignments
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/transport/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Assign Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transport Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading assignments...</div>}>
            <StudentTransportClient initialAssignments={assignments} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
