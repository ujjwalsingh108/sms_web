"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { deleteExamSchedule } from "@/app/dashboard/exams/actions";
import { Loader2 } from "lucide-react";

type DeleteScheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: {
    id: string;
    exam: { name: string } | null;
    class: { name: string } | null;
    subject: { name: string; code: string } | null;
  };
};

export function DeleteScheduleDialog({
  open,
  onOpenChange,
  schedule,
}: DeleteScheduleDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteExamSchedule(schedule.id);

      if (result.success) {
        toast.success("Schedule deleted successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete schedule");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the exam schedule:
            <div className="mt-2 space-y-1 text-sm">
              <div>
                <strong>Exam:</strong> {schedule.exam?.name || "N/A"}
              </div>
              <div>
                <strong>Class:</strong> {schedule.class?.name || "N/A"}
              </div>
              <div>
                <strong>Subject:</strong>{" "}
                {schedule.subject
                  ? `${schedule.subject.code} - ${schedule.subject.name}`
                  : "N/A"}
              </div>
            </div>
            <div className="mt-3 text-destructive font-medium">
              ⚠️ Warning: All exam results associated with this schedule will
              also be deleted.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
