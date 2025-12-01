"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteSchool } from "@/app/admin/schools/actions";

interface DeleteSchoolDialogProps {
  schoolId: string;
  schoolName: string;
  subdomain: string;
}

export function DeleteSchoolDialog({
  schoolId,
  schoolName,
  subdomain,
}: DeleteSchoolDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSchool(schoolId, schoolName, subdomain);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("School deleted", {
        description: `${schoolName} has been permanently deleted.`,
      });

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting school:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete school. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete School Instance</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{schoolName}</strong> (
            {subdomain}.smartschoolerp.xyz)? This action cannot be undone and
            will permanently delete:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>The school instance and all its data</li>
              <li>All associated users and access</li>
              <li>All student and staff records</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete School
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
