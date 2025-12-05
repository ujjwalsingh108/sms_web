"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRouteStop } from "@/app/dashboard/transport/actions";
import { Loader2 } from "lucide-react";

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
      <div className="space-y-4">
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
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Stop
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
