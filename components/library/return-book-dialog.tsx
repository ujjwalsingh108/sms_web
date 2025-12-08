"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LibraryTransaction,
  returnBook,
} from "@/app/dashboard/library/actions";

type ReturnBookDialogProps = {
  transaction: LibraryTransaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ReturnBookDialog({
  transaction,
  open,
  onOpenChange,
}: ReturnBookDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await returnBook(transaction.id, formData);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error returning book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return Book</DialogTitle>
          <DialogDescription>
            Mark book as returned. Add fine if applicable.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Book</Label>
              <p className="text-sm font-medium">
                {transaction.book?.title || "Unknown"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fine_amount">Fine Amount (₹)</Label>
              <Input
                id="fine_amount"
                name="fine_amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue="0"
                placeholder="Enter fine amount if any"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                name="remarks"
                placeholder="Add any remarks (optional)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Mark as Returned"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
