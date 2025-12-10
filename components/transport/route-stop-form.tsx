"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createRouteStop } from "@/app/dashboard/transport/actions";
import { Loader2, MapPin, Clock, Save } from "lucide-react";
import Link from "next/link";

type RouteStopFormProps = {
  routeId: string;
  nextStopOrder: number;
};

export function RouteStopForm({ routeId, nextStopOrder }: RouteStopFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("route_id", routeId);

    try {
      await createRouteStop(formData);
      router.push(`/dashboard/transport/routes/${routeId}`);
    } catch (error) {
      console.error("Failed to add stop:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <MapPin className="h-5 w-5 text-purple-500" />
            Stop Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stop_name">Stop Name *</Label>
              <Input
                id="stop_name"
                name="stop_name"
                placeholder="Enter stop name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop_order">Stop Order *</Label>
              <Input
                id="stop_order"
                name="stop_order"
                type="number"
                min="1"
                defaultValue={nextStopOrder}
                placeholder="Enter stop order"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <Input
                id="pickup_time"
                name="pickup_time"
                type="time"
                placeholder="Enter pickup time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="drop_time">Drop Time</Label>
              <Input
                id="drop_time"
                name="drop_time"
                type="time"
                placeholder="Enter drop time"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Add Stop
        </Button>
        <Link
          href={`/dashboard/transport/routes/${routeId}`}
          className="flex-1"
        >
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="w-full"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
