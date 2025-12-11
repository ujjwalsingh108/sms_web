import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle, XCircle } from "lucide-react";

export default async function AllocationsPage() {
  const supabase = await createClient();

  const { data: allocations } = await supabase
    .from("hostel_allocations")
    .select(
      `
      *,
      students (
        first_name,
        last_name
      ),
      hostels (
        name
      ),
      hostel_rooms (
        room_number
      )
    `
    )
    .order("created_at", { ascending: false });

  const totalAllocations = allocations?.length || 0;
  const activeAllocations =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allocations?.filter((a: any) => a.status === "active").length || 0;
  const vacatedAllocations =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allocations?.filter((a: any) => a.status === "vacated").length || 0;

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
            <Link href="/dashboard/hostel">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Room Allocations
            </h1>
          </div>
          <Link href="/dashboard/hostel/allocations/new">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              Allocate Room
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Allocations
                  </p>
                  <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {totalAllocations}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active
                  </p>
                  <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {activeAllocations}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Vacated
                  </p>
                  <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent">
                    {vacatedAllocations}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/30 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Allocations List */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              All Allocations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {allocations && allocations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                        Hostel
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        Room
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden xl:table-cell">
                        Allocated From
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                        Fee
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const student = (allocation as any).students as any;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const hostel = (allocation as any).hostels as any;
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const room = (allocation as any).hostel_rooms as any;
                      return (
                        <tr
                          key={(allocation as any).id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {student?.first_name} {student?.last_name}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                            {hostel?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                            {room?.room_number || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hidden xl:table-cell">
                            {new Date(
                              (allocation as any).allocation_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                            ₹{(allocation as any).monthly_fee}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={getStatusBadgeClass(
                                (allocation as any).status
                              )}
                            >
                              {(allocation as any).status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/dashboard/hostel/allocations/${
                                (allocation as any).id
                              }`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              >
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                  No allocations found
                </p>
                <Link href="/dashboard/hostel/allocations/new">
                  <Button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                    Create First Allocation
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
