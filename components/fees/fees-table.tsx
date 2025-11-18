"use client";

import { Database } from "@/lib/supabase/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Download } from "lucide-react";
import { format } from "date-fns";

type FeePayment = Database["public"]["Tables"]["fee_payments"]["Row"] & {
  student: {
    first_name: string;
    last_name: string;
    admission_no: string;
  } | null;
  fee_structure: { name: string } | null;
};

interface FeesTableProps {
  payments: FeePayment[];
}

export function FeesTable({ payments }: FeesTableProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt No</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Admission No</TableHead>
            <TableHead>Fee Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No payments found. Collect your first fee to get started.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.receipt_no}
                </TableCell>
                <TableCell>
                  {payment.student?.first_name} {payment.student?.last_name}
                </TableCell>
                <TableCell>{payment.student?.admission_no}</TableCell>
                <TableCell>{payment.fee_structure?.name || "-"}</TableCell>
                <TableCell className="font-semibold">
                  ₹{Number(payment.amount_paid).toLocaleString("en-IN")}
                </TableCell>
                <TableCell>
                  {format(new Date(payment.payment_date), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="capitalize">
                  {payment.payment_method}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="View Receipt">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Receipt"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
