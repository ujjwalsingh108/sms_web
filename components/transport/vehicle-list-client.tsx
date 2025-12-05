"use client";

import { useState } from "react";
import { Vehicle } from "@/app/dashboard/transport/actions";
import { VehicleFilters } from "./vehicle-filters";
import { VehicleTable } from "./vehicle-table";

type VehicleListClientProps = {
  initialVehicles: Vehicle[];
};

export function VehicleListClient({ initialVehicles }: VehicleListClientProps) {
  const [vehicles] = useState<Vehicle[]>(initialVehicles);

  return (
    <div className="space-y-4">
      <VehicleFilters />
      <VehicleTable vehicles={vehicles} />
    </div>
  );
}
