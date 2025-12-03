import StaffForm from "@/components/staff/staff-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewStaffPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staff">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Add New Staff</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Register a new staff member
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Staff Information</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Fill in the details to add a new staff member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm />
        </CardContent>
      </Card>
    </div>
  );
}
