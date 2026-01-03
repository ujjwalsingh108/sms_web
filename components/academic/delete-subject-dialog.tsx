"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  deleteSubject,
  type SubjectWithClasses,
} from "@/app/dashboard/academic/actions";

interface DeleteSubjectDialogProps {
  subject: SubjectWithClasses;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSubjectDialog({
  subject,
  open,
  onOpenChange,
}: DeleteSubjectDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteSubject(subject.id);

      if (result.success) {
        toast.success("Subject deleted successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete subject");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {subject.name}
              </span>{" "}
              ({subject.code})?
            </p>
            {subject.class_count && subject.class_count > 0 && (
              <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                Warning: This subject is currently assigned to{" "}
                {subject.class_count} class{subject.class_count > 1 ? "es" : ""}
                . All class-subject mappings will be removed.
              </p>
            )}
            <p className="text-muted-foreground">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Subject"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
