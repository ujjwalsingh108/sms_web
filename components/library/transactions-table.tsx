"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LibraryTransaction,
  returnBook,
} from "@/app/dashboard/library/actions";
import ReturnBookDialog from "./return-book-dialog";

type TransactionsTableProps = {
  transactions: LibraryTransaction[];
};

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<LibraryTransaction | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "issued":
        return "bg-blue-500";
      case "returned":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      case "lost":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleReturnClick = (transaction: LibraryTransaction) => {
    setSelectedTransaction(transaction);
    setReturnDialogOpen(true);
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border rounded-lg p-4 space-y-3 bg-card"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-base">
                    {transaction.book?.title || "Unknown Book"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.student
                      ? `${transaction.student.first_name} ${transaction.student.last_name}`
                      : transaction.staff
                      ? `${transaction.staff.first_name} ${transaction.staff.last_name}`
                      : "N/A"}
                  </p>
                </div>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span className="ml-1 font-medium">
                    {new Date(transaction.issue_date).toLocaleDateString(
                      "en-IN"
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="ml-1 font-medium">
                    {new Date(transaction.due_date).toLocaleDateString("en-IN")}
                  </span>
                </div>
                {transaction.return_date && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Return Date:</span>
                    <span className="ml-1 font-medium">
                      {new Date(transaction.return_date).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                )}
                {transaction.fine_amount > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Fine:</span>
                    <span className="ml-1 font-medium text-red-600">
                      ₹{transaction.fine_amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {transaction.status === "issued" && (
                <div className="pt-2 border-t">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleReturnClick(transaction)}
                  >
                    Mark as Returned
                  </Button>
                </div>
              )}
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
                  Book Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Borrowed By
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Issue Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">
                  Return Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">
                  Fine
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
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {transaction.book?.title || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {transaction.student
                        ? `${transaction.student.first_name} ${transaction.student.last_name}`
                        : transaction.staff
                        ? `${transaction.staff.first_name} ${transaction.staff.last_name}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(transaction.issue_date).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(transaction.due_date).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {transaction.return_date
                        ? new Date(transaction.return_date).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {transaction.fine_amount > 0
                        ? `₹${transaction.fine_amount.toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {transaction.status === "issued" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReturnClick(transaction)}
                        >
                          Return
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTransaction && (
        <ReturnBookDialog
          transaction={selectedTransaction}
          open={returnDialogOpen}
          onOpenChange={setReturnDialogOpen}
        />
      )}
    </>
  );
}
