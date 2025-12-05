import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getRoutes } from "../actions";
import { RouteListClient } from "@/components/transport/route-list-client";

type SearchParams = Promise<{
  status?: string;
  search?: string;
}>;

export default async function RoutesPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const filters = {
    status: searchParams.status,
    search: searchParams.search,
  };

  const routes = await getRoutes(filters);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Routes
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage transport routes and stops
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/transport/routes/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Route
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading routes...</div>}>
        <RouteListClient initialRoutes={routes} />
      </Suspense>
    </div>
  );
}
