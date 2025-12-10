import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Route as RouteIcon,
  MapPin,
  DollarSign,
  Plus,
} from "lucide-react";
import { getRouteById } from "../../actions";
import { RouteStopsClient } from "@/components/transport/route-stops-client";

type Params = Promise<{
  id: string;
}>;

export default async function RouteDetailPage(props: { params: Params }) {
  const params = await props.params;
  let route;

  try {
    route = await getRouteById(params.id);
  } catch (error) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-0 font-semibold"
      : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800/30 dark:to-slate-800/30 dark:text-gray-400 border-0 font-semibold";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
              asChild
            >
              <Link href="/dashboard/transport/routes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {route.route_name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Route Details
              </p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            asChild
          >
            <Link href={`/dashboard/transport/routes/${params.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Route
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5 text-blue-500" />
                  Route Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Route Name
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {route.route_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Route Number
                    </p>
                    <p className="text-base font-mono font-semibold text-gray-900 dark:text-gray-100">
                      {route.route_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Starting Point
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {route.starting_point || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ending Point
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {route.ending_point || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Distance
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {route.distance_km ? `${route.distance_km} km` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Fare
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      ₹{route.fare || "0"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <Badge className={getStatusColor(route.status)}>
                      {route.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  Route Stops
                </CardTitle>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  asChild
                  size="sm"
                >
                  <Link
                    href={`/dashboard/transport/routes/${params.id}/stops/new`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stop
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <RouteStopsClient
                  routeId={params.id}
                  initialStops={route.stops || []}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950"
                  variant="outline"
                >
                  <Link href={`/dashboard/transport/routes/${params.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Route
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link
                    href={`/dashboard/transport/routes/${params.id}/stops/new`}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stop
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Link href="/dashboard/transport/routes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to List
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
