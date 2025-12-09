import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function HostelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select(
      `
      *,
      role:role_id(id, name, display_name),
      tenant:tenant_id(id, name, email)
    `
    )
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as { tenant_id: string } | undefined;

  if (!member) {
    redirect("/login");
  }

  // Fetch hostels
  const { data: hostels } = await supabase
    .from("hostels")
    .select("*")
    .eq("tenant_id", member.tenant_id);

  // Fetch rooms
  const { data: rooms } = await supabase
    .from("hostel_rooms")
    .select(
      `
      *,
      hostel:hostels(name)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .limit(50);

  // Fetch allocations
  const { data: allocations } = await supabase
    .from("hostel_allocations")
    .select(
      `
      *,
      student:students(first_name, last_name, roll_number),
      room:hostel_rooms(room_number),
      hostel:hostels(name)
    `
    )
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(30);

  type Room = {
    status: string;
  };

  const occupiedRooms =
    (rooms as Room[] | null)?.filter((r) => r.status === "occupied").length ||
    0;
  const availableRooms =
    (rooms as Room[] | null)?.filter((r) => r.status === "available").length ||
    0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Hostel Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage hostels, rooms, and student allocations
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/dashboard/hostel/allocations/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Allocate Room
            </Button>
          </Link>
          <Link href="/dashboard/hostel/rooms/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-6">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Hostels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {hostels?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">
              {rooms?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Occupied Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">
              {occupiedRooms}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Available Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {availableRooms}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hostels Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Hostels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostels && hostels.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              hostels.map((hostel: any) => (
                <Link key={hostel.id} href={`/dashboard/hostel/${hostel.id}`}>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                    <h3 className="font-semibold text-lg">
                      {hostel.hostel_name}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        Type: {hostel.hostel_type || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total Rooms: {hostel.total_rooms || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Warden: {hostel.warden_name || "Not Assigned"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-2 text-center py-4">
                No hostels found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rooms */}
      <Card>
        <CardHeader>
          <CardTitle>Hostel Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Room Number</th>
                  <th className="text-left p-3">Hostel</th>
                  <th className="text-left p-3">Floor</th>
                  <th className="text-left p-3">Room Type</th>
                  <th className="text-left p-3">Capacity</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms && rooms.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  rooms.map((room: any) => (
                    <tr key={room.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-semibold">{room.room_number}</td>
                      <td className="p-3">{room.hostel?.name || "N/A"}</td>
                      <td className="p-3">{room.floor_number || "N/A"}</td>
                      <td className="p-3">{room.room_type || "N/A"}</td>
                      <td className="p-3">{room.capacity || "N/A"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            room.status === "available"
                              ? "bg-green-100 text-green-800"
                              : room.status === "occupied"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/hostel/rooms/${room.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No rooms found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Allocations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Room Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Student</th>
                  <th className="text-left p-3">Hostel</th>
                  <th className="text-left p-3">Room</th>
                  <th className="text-left p-3">Allocated From</th>
                  <th className="text-left p-3">Allocated To</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations && allocations.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  allocations.map((allocation: any) => (
                    <tr
                      key={allocation.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">
                        {allocation.student
                          ? `${allocation.student.first_name} ${allocation.student.last_name}`
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {allocation.hostel?.name || "N/A"}
                      </td>
                      <td className="p-3">
                        {allocation.room?.room_number || "N/A"}
                      </td>
                      <td className="p-3">
                        {new Date(
                          allocation.allocated_from
                        ).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {allocation.allocated_to
                          ? new Date(
                              allocation.allocated_to
                            ).toLocaleDateString()
                          : "Ongoing"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            allocation.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {allocation.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/dashboard/hostel/allocations/${allocation.id}`}
                        >
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No allocations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
