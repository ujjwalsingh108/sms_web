import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TransportPage() {
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

  // Fetch vehicles
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false });

  // Fetch routes
  const { data: routes } = await supabase
    .from("routes")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false });

  type Vehicle = {
    status: string;
  };

  const activeVehicles =
    (vehicles as Vehicle[] | null)?.filter((v) => v.status === "active")
      .length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Transport Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage vehicles, routes, and transportation
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/dashboard/transport/vehicles/new"
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
          <Link
            href="/dashboard/transport/routes/new"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Route
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Total Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {vehicles?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Active Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {activeVehicles}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              Total Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl md:text-3xl font-bold text-purple-600">
              {routes?.length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Vehicle Number
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Type
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                    Model
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                    Capacity
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                    Driver
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Status
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {vehicles && vehicles.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  vehicles.map((vehicle: any) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 md:p-3 font-semibold text-xs md:text-sm">
                        {vehicle.vehicle_number}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm">
                        {vehicle.vehicle_type || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                        {vehicle.model || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                        {vehicle.capacity || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                        {vehicle.driver_name || "Not Assigned"}
                      </td>
                      <td className="p-2 md:p-3">
                        <span
                          className={`px-1.5 md:px-2 py-1 rounded text-xs ${
                            vehicle.status === "active"
                              ? "bg-green-100 text-green-800"
                              : vehicle.status === "maintenance"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="p-2 md:p-3">
                        <Link
                          href={`/dashboard/transport/vehicles/${vehicle.id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center p-8 text-gray-500 text-sm"
                    >
                      No vehicles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Route Name
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                    Route Number
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                    Starting Point
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                    Ending Point
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                    Distance (km)
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Fare
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Status
                  </th>
                  <th className="text-left p-2 md:p-3 text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {routes && routes.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  routes.map((route: any) => (
                    <tr key={route.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 md:p-3 font-medium text-xs md:text-sm">
                        {route.route_name}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden sm:table-cell">
                        {route.route_number || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                        {route.starting_point || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden md:table-cell">
                        {route.ending_point || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm hidden lg:table-cell">
                        {route.distance_km || "N/A"}
                      </td>
                      <td className="p-2 md:p-3 text-xs md:text-sm">
                        ₹{route.fare || "0"}
                      </td>
                      <td className="p-2 md:p-3">
                        <span
                          className={`px-1.5 md:px-2 py-1 rounded text-xs ${
                            route.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {route.status}
                        </span>
                      </td>
                      <td className="p-2 md:p-3">
                        <Link href={`/dashboard/transport/routes/${route.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center p-8 text-gray-500 text-sm"
                    >
                      No routes found
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
