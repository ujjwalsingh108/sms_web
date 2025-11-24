"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdmissionStatus } from "@/lib/types/admission";
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

interface ApproveRejectButtonsProps {
  applicationId: string;
}

export function ApproveRejectButtons({
  applicationId,
}: ApproveRejectButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const handleStatusUpdate = async (status: AdmissionStatus) => {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // Explicitly type the update payload to work around Supabase type inference
      interface UpdatePayload {
        status: AdmissionStatus;
      }
      const updatePayload: UpdatePayload = { status };

      const { error: updateError } = await supabase
        .from("admission_applications")
        .update(updatePayload as never)
        .eq("id", applicationId);

      if (updateError) throw updateError;

      router.refresh();
      setAction(null);
    } catch (err) {
      console.error("Error updating status:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update application status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">Pending Approval</p>
        <p className="text-xs text-gray-600">
          Review the application and approve or reject it
        </p>
      </div>

      <div className="flex gap-2">
        <AlertDialog
          open={action === "approve"}
          onOpenChange={(open) => !open && setAction(null)}
        >
          <AlertDialogTrigger asChild>
            <Button
              onClick={() => setAction("approve")}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to approve this admission application?
                This will change the status to approved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusUpdate("approved")}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={action === "reject"}
          onOpenChange={(open) => !open && setAction(null)}
        >
          <AlertDialogTrigger asChild>
            <Button
              onClick={() => setAction("reject")}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reject this admission application? This
                will change the status to rejected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatusUpdate("rejected")}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
