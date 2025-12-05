import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bus, Route, Users, MapPin } from "lucide-react";
import { getTransportStats } from "./actions";

export default async function TransportPage() {
  const stats = await getTransportStats();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Transport Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage vehicles, routes, and student transport
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vehicles
              </CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeVehicles} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Routes
              </CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoutes}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeRoutes} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Students Using Transport
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Active assignments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quick Actions
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/transport/vehicles/new">
                    Add Vehicle
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href="/dashboard/transport/routes/new">Add Route</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Management Sections */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Vehicle Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage school vehicles, drivers, and maintenance schedules
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/transport/vehicles">Manage Vehicles</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Route Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Create and manage routes with stops and timings
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/transport/routes">Manage Routes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Transport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Assign students to routes and manage transport fees
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/transport/students">
                Manage Assignments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
