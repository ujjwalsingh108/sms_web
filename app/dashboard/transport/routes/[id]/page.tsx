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
    return status === "active" ? "bg-green-500" : "bg-gray-500";
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/transport/routes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {route.route_name}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Route Details
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/transport/routes/${params.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Route
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RouteIcon className="h-5 w-5" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Route Name
                  </p>
                  <p className="text-base font-medium">{route.route_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Route Number
                  </p>
                  <p className="text-base font-mono">
                    {route.route_number || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Starting Point
                  </p>
                  <p className="text-base">{route.starting_point || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ending Point
                  </p>
                  <p className="text-base">{route.ending_point || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Distance
                  </p>
                  <p className="text-base">
                    {route.distance_km ? `${route.distance_km} km` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Fare
                  </p>
                  <p className="text-base">₹{route.fare || "0"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge className={getStatusColor(route.status)}>
                    {route.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Stops
              </CardTitle>
              <Button asChild size="sm">
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
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                className="w-full justify-start"
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
  );
}
