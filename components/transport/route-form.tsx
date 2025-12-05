"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Route,
  createRoute,
  updateRoute,
} from "@/app/dashboard/transport/actions";
import { Loader2 } from "lucide-react";

type RouteFormProps = {
  mode: "create" | "edit";
  route?: Route;
};

export function RouteForm({ mode, route }: RouteFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (mode === "create") {
        await createRoute(formData);
        router.push("/dashboard/transport/routes");
      } else {
        await updateRoute(route!.id, formData);
        router.push(`/dashboard/transport/routes/${route!.id}`);
      }
    } catch (error) {
      console.error("Failed to save route:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Route Information</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="route_name">Route Name *</Label>
            <Input
              id="route_name"
              name="route_name"
              defaultValue={route?.route_name}
              placeholder="Enter route name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="route_number">Route Number</Label>
            <Input
              id="route_number"
              name="route_number"
              defaultValue={route?.route_number || ""}
              placeholder="Enter route number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="starting_point">Starting Point</Label>
            <Input
              id="starting_point"
              name="starting_point"
              defaultValue={route?.starting_point || ""}
              placeholder="Enter starting location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ending_point">Ending Point</Label>
            <Input
              id="ending_point"
              name="ending_point"
              defaultValue={route?.ending_point || ""}
              placeholder="Enter ending location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance_km">Distance (km)</Label>
            <Input
              id="distance_km"
              name="distance_km"
              type="number"
              step="0.01"
              min="0"
              defaultValue={route?.distance_km || ""}
              placeholder="Enter distance in kilometers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fare">Fare (₹)</Label>
            <Input
              id="fare"
              name="fare"
              type="number"
              step="0.01"
              min="0"
              defaultValue={route?.fare || ""}
              placeholder="Enter fare amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue={route?.status || "active"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Add Route" : "Update Route"}
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
