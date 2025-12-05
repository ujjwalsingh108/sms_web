import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Bus, User, Phone, Calendar } from "lucide-react";
import { getVehicleById } from "../../actions";

type Params = Promise<{
  id: string;
}>;

export default async function VehicleDetailPage(props: { params: Params }) {
  const params = await props.params;
  let vehicle;

  try {
    vehicle = await getVehicleById(params.id);
  } catch (error) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/transport/vehicles">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {vehicle.vehicle_number}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Vehicle Details
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/transport/vehicles/${params.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Vehicle
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Vehicle Number
                  </p>
                  <p className="text-base font-mono">
                    {vehicle.vehicle_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Vehicle Type
                  </p>
                  <p className="text-base">{vehicle.vehicle_type || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Model
                  </p>
                  <p className="text-base">{vehicle.model || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Capacity
                  </p>
                  <p className="text-base">
                    {vehicle.capacity
                      ? `${vehicle.capacity} passengers`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {vehicle.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Added On
                  </p>
                  <p className="text-base">
                    {new Date(vehicle.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Driver Name
                  </p>
                  <p className="text-base">{vehicle.driver_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  <p className="text-base">{vehicle.driver_phone || "N/A"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    License Number
                  </p>
                  <p className="text-base font-mono">
                    {vehicle.driver_license || "N/A"}
                  </p>
                </div>
              </div>
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
                <Link href={`/dashboard/transport/vehicles/${params.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Vehicle
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-start"
                variant="outline"
              >
                <Link href="/dashboard/transport/vehicles">
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
