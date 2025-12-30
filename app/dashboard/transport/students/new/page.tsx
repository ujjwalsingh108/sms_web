import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentTransportForm } from "@/components/transport/student-transport-form";

export default function NewStudentTransportPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/transport/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Assign Student to Route
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Assign a student to a transport route and stop
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transport Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentTransportForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
