"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RouteStop, deleteRouteStop } from "@/app/dashboard/transport/actions";
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

type RouteStopsClientProps = {
  routeId: string;
  initialStops: RouteStop[];
};

export function RouteStopsClient({
  routeId,
  initialStops,
}: RouteStopsClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteRouteStop(deleteId, routeId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete stop:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (initialStops.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No stops added yet
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {initialStops.map((stop) => (
          <div
            key={stop.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Order
                </p>
                <p className="text-base font-medium">{stop.stop_order}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Stop Name
                </p>
                <p className="text-base">{stop.stop_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pickup Time
                </p>
                <p className="text-base font-mono">
                  {stop.pickup_time || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Drop Time
                </p>
                <p className="text-base font-mono">{stop.drop_time || "N/A"}</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDeleteId(stop.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
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
              stop.
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
