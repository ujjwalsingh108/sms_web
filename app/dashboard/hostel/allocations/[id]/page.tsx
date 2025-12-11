import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Building2,
  Bed,
  Calendar,
  DollarSign,
  Edit,
  CheckCircle,
} from "lucide-react";
import { notFound } from "next/navigation";

export default async function AllocationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: allocation, error } = await supabase
    .from("hostel_allocations")
    .select(
      `
      *,
      students (
        first_name,
        last_name,
        email
      ),
      hostels (
        name
      ),
      hostel_rooms (
        room_number,
        floor_number
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !allocation) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const student = (allocation as any).students as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hostel = (allocation as any).hostels as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const room = (allocation as any).hostel_rooms as any;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "vacated":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/hostel/allocations">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Allocation Details
              </h1>
              <Badge
                className={`${getStatusBadgeClass(
                  (allocation as any).status
                )} mt-2`}
              >
                {(allocation as any).status}
              </Badge>
            </div>
          </div>
          {(allocation as any).status === "active" && (
            <Link href={`/dashboard/hostel/allocations/${params.id}/edit`}>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Edit className="mr-2 h-4 w-4" />
                Edit Allocation
              </Button>
            </Link>
          )}
        </div>

        {/* Allocation Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Information */}
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 bg-gradient-to-r from-purple-600 to-indigo-600">
              <CardTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Users className="h-6 w-6" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Student Name
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                    {student?.first_name} {student?.last_name}
                  </p>
                </div>
              </div>

              {student?.email && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                      {student.email}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Room Information */}
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 bg-gradient-to-r from-purple-600 to-indigo-600">
              <CardTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Room Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Building2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Hostel
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                    {hostel?.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <Bed className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Room Number
                  </p>
                  <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                    {room?.room_number || "N/A"} (Floor{" "}
                    {room?.floor_number || "N/A"})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocation & Fee Details */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 bg-gradient-to-r from-purple-600 to-indigo-600">
            <CardTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Allocation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Allocation Date
                    </p>
                    <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                      {new Date(
                        (allocation as any).allocation_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {(allocation as any).checkout_date && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Calendar className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Checkout Date
                      </p>
                      <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                        {new Date(
                          (allocation as any).checkout_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <DollarSign className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Monthly Fee
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      ₹{(allocation as any).monthly_fee}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </p>
                    <Badge
                      className={`${getStatusBadgeClass(
                        (allocation as any).status
                      )} mt-1`}
                    >
                      {(allocation as any).status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
