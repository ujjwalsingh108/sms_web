import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleForm } from "@/components/transport/vehicle-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getVehicleById } from "../../../actions";

type Params = Promise<{
  id: string;
}>;

export default async function EditVehiclePage(props: { params: Params }) {
  const params = await props.params;
  let vehicle;

  try {
    vehicle = await getVehicleById(params.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/transport/vehicles/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Edit Vehicle
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Update vehicle information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm mode="edit" vehicle={vehicle} />
        </CardContent>
      </Card>
    </div>
  );
}
