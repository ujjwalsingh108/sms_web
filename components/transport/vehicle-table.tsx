"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Vehicle, deleteVehicle } from "@/app/dashboard/transport/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type VehicleTableProps = {
  vehicles: Vehicle[];
};

export function VehicleTable({ vehicles }: VehicleTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteVehicle(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No vehicles found
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border rounded-lg p-4 space-y-3 bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-mono font-semibold text-base">
                    {vehicle.vehicle_number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.vehicle_type || "N/A"}{" "}
                    {vehicle.model ? `• ${vehicle.model}` : ""}
                  </p>
                </div>
                <Badge className={getStatusColor(vehicle.status)}>
                  {vehicle.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="ml-1 font-medium">
                    {vehicle.capacity ? `${vehicle.capacity}` : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Driver:</span>
                  <span className="ml-1 font-medium">
                    {vehicle.driver_name || "Not assigned"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link href={`/dashboard/transport/vehicles/${vehicle.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link
                    href={`/dashboard/transport/vehicles/${vehicle.id}/edit`}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(vehicle.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Vehicle Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Model
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">
                  Capacity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden xl:table-cell">
                  Driver
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No vehicles found
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-mono text-sm">
                      {vehicle.vehicle_number}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {vehicle.vehicle_type || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {vehicle.model || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {vehicle.capacity ? `${vehicle.capacity} seats` : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden xl:table-cell">
                      {vehicle.driver_name || "Not assigned"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" asChild>
                          <Link
                            href={`/dashboard/transport/vehicles/${vehicle.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" asChild>
                          <Link
                            href={`/dashboard/transport/vehicles/${vehicle.id}/edit`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vehicle.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
