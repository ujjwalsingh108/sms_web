"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Route, deleteRoute } from "@/app/dashboard/transport/actions";
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

type RouteTableProps = {
  routes: Route[];
};

export function RouteTable({ routes }: RouteTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteRoute(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete route:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-gray-500";
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Route Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">
                  Route Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                  Starting Point
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">
                  Ending Point
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden xl:table-cell">
                  Distance
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Fare
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
              {routes.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No routes found
                  </td>
                </tr>
              ) : (
                routes.map((route) => (
                  <tr key={route.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-sm">
                      {route.route_name}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono hidden sm:table-cell">
                      {route.route_number || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      {route.starting_point || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {route.ending_point || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden xl:table-cell">
                      {route.distance_km ? `${route.distance_km} km` : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">₹{route.fare || "0"}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(route.status)}>
                        {route.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" asChild>
                          <Link
                            href={`/dashboard/transport/routes/${route.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" asChild>
                          <Link
                            href={`/dashboard/transport/routes/${route.id}/edit`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(route.id)}
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
              route and all its stops.
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
