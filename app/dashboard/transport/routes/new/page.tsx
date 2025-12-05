import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteForm } from "@/components/transport/route-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewRoutePage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/transport/routes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Add New Route
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Add a new transport route
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Information</CardTitle>
        </CardHeader>
        <CardContent>
          <RouteForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
