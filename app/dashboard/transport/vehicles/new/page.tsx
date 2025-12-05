import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleForm } from "@/components/transport/vehicle-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewVehiclePage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/transport/vehicles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Add New Vehicle
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Add a new vehicle to the transport system
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
