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
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            Transport Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage vehicles, routes, and student transport
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Vehicles
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <Bus className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                {stats.totalVehicles}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.activeVehicles} active
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Routes
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <Route className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {stats.totalRoutes}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.activeRoutes} active
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Students Using Transport
              </CardTitle>
              <div className="p-2 rounded-lg success-gradient">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {stats.totalStudents}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Active assignments
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card-hover glass-effect border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Actions
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <MapPin className="h-5 w-5 text-white" />
              </div>
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
