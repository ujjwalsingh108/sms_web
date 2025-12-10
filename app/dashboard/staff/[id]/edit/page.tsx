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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/staff/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Staff
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Update the details for {staff.first_name} {staff.last_name}
            </p>
          </div>
        </div>

        <StaffForm staff={staff} mode="edit" />
      </div>
    </div>
  );
}
