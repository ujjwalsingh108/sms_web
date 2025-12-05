"use client";

import { useState } from "react";
import { Route } from "@/app/dashboard/transport/actions";
import { RouteFilters } from "./route-filters";
import { RouteTable } from "./route-table";

type RouteListClientProps = {
  initialRoutes: Route[];
};

export function RouteListClient({ initialRoutes }: RouteListClientProps) {
  const [routes] = useState<Route[]>(initialRoutes);

  return (
    <div className="space-y-4">
      <RouteFilters />
      <RouteTable routes={routes} />
    </div>
  );
}
