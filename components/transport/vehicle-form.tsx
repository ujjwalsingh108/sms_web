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
  Vehicle,
  createVehicle,
  updateVehicle,
} from "@/app/dashboard/transport/actions";
import { Loader2 } from "lucide-react";

type VehicleFormProps = {
  mode: "create" | "edit";
  vehicle?: Vehicle;
};

export function VehicleForm({ mode, vehicle }: VehicleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (mode === "create") {
        await createVehicle(formData);
        router.push("/dashboard/transport/vehicles");
      } else {
        await updateVehicle(vehicle!.id, formData);
        router.push(`/dashboard/transport/vehicles/${vehicle!.id}`);
      }
    } catch (error) {
      console.error("Failed to save vehicle:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Vehicle Information</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vehicle_number">Vehicle Number *</Label>
            <Input
              id="vehicle_number"
              name="vehicle_number"
              defaultValue={vehicle?.vehicle_number}
              placeholder="Enter vehicle number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle_type">Vehicle Type</Label>
            <Input
              id="vehicle_type"
              name="vehicle_type"
              defaultValue={vehicle?.vehicle_type || ""}
              placeholder="e.g., Bus, Van, Car"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              defaultValue={vehicle?.model || ""}
              placeholder="Enter vehicle model"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              defaultValue={vehicle?.capacity || ""}
              placeholder="Enter seating capacity"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue={vehicle?.status || "active"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Driver Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Driver Information</h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="driver_name">Driver Name</Label>
            <Input
              id="driver_name"
              name="driver_name"
              defaultValue={vehicle?.driver_name || ""}
              placeholder="Enter driver name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver_phone">Driver Phone</Label>
            <Input
              id="driver_phone"
              name="driver_phone"
              type="tel"
              defaultValue={vehicle?.driver_phone || ""}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="driver_license">License Number</Label>
            <Input
              id="driver_license"
              name="driver_license"
              defaultValue={vehicle?.driver_license || ""}
              placeholder="Enter license number"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Add Vehicle" : "Update Vehicle"}
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
