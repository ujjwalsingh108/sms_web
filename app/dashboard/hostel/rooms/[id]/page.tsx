import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Bed,
  Building2,
  Users,
  DollarSign,
  Edit,
} from "lucide-react";
import { notFound } from "next/navigation";

export default async function RoomDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: room, error } = await supabase
    .from("hostel_rooms")
    .select(
      `
      *,
      hostels (
        id,
        name,
        hostel_type
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (error || !room) {
    notFound();
  }

  // Fetch allocations for this room
  const { data: allocations } = await supabase
    .from("hostel_allocations")
    .select(
      `
      *,
      students (
        first_name,
        last_name
      )
    `
    )
    .eq("room_id", params.id)
    .eq("status", "active");

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "occupied":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "maintenance":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hostel = (room as any).hostels as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/hostel/rooms">
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
                Room {(room as any).room_number}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {hostel?.name || "N/A"}
              </p>
            </div>
          </div>
          <Link href={`/dashboard/hostel/rooms/${params.id}/edit`}>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Edit className="mr-2 h-4 w-4" />
              Edit Room
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Capacity
                  </p>
                  <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {(room as any).capacity}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                  <Bed className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Occupied
                  </p>
                  <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    {(room as any).occupied_beds}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Available
                  </p>
                  <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {(room as any).capacity - (room as any).occupied_beds}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                  <Bed className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Fee
                  </p>
                  <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{(room as any).monthly_fee}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Details */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 bg-gradient-to-r from-purple-600 to-indigo-600">
            <CardTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Bed className="h-6 w-6" />
              Room Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
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
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      {(room as any).room_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Building2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Floor Number
                    </p>
                    <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                      Floor {(room as any).floor_number}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(room as any).room_type && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Bed className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Room Type
                      </p>
                      <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                        {(room as any).room_type}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Occupancy
                    </p>
                    <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                      {(room as any).occupied_beds} / {(room as any).capacity}{" "}
                      beds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <Bed className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Status
                    </p>
                    <Badge
                      className={`${getStatusBadgeClass(
                        (room as any).status
                      )} mt-1`}
                    >
                      {(room as any).status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Allocations */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Current Occupants
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {allocations && allocations.length > 0 ? (
              <div className="space-y-3">
                {allocations.map((allocation) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const student = (allocation as any).students as any;
                  return (
                    <div
                      key={(allocation as any).id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                          <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {student?.first_name} {student?.last_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Since{" "}
                            {new Date(
                              (allocation as any).allocation_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/hostel/allocations/${
                          (allocation as any).id
                        }`}
                      >
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  No current occupants
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
