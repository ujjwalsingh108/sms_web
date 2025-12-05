"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { deleteStudentTransport } from "@/app/dashboard/transport/actions";
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

type StudentTransportClientProps = {
  initialAssignments: any[];
};

export function StudentTransportClient({
  initialAssignments,
}: StudentTransportClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteStudentTransport(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
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
                  Student
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">
                  Admission No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                  Stop
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
              {initialAssignments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No student transport assignments found
                  </td>
                </tr>
              ) : (
                initialAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 text-sm">
                      {assignment.student?.first_name}{" "}
                      {assignment.student?.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono hidden sm:table-cell">
                      {assignment.student?.admission_no || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {assignment.route?.route_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      {assignment.stop?.stop_name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(assignment.id)}
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
              This action cannot be undone. This will remove the student from
              transport.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
