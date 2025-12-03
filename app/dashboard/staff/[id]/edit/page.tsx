import { getStaffById } from "../../actions";
import StaffForm from "@/components/staff/staff-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let staff;
  try {
    staff = await getStaffById(id);
  } catch (error) {
    console.error("Error fetching staff:", error);
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/staff/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Edit Staff
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Update staff member information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Staff Information
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Update the details for {staff.first_name} {staff.last_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm staff={staff} mode="edit" />
        </CardContent>
      </Card>
    </div>
  );
}
