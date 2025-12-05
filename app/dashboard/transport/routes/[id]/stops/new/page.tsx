import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteStopForm } from "@/components/transport/route-stop-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getRouteById } from "../../../../actions";

type Params = Promise<{
  id: string;
}>;

export default async function NewRouteStopPage(props: { params: Params }) {
  const params = await props.params;
  let route;

  try {
    route = await getRouteById(params.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/transport/routes/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Add Route Stop
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Add a new stop to {route.route_name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stop Information</CardTitle>
        </CardHeader>
        <CardContent>
          <RouteStopForm
            routeId={params.id}
            nextStopOrder={(route.stops?.length || 0) + 1}
          />
        </CardContent>
      </Card>
    </div>
  );
}
