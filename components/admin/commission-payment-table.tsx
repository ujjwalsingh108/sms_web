"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  payment_amount: number;
  payment_date: string;
  payment_method: string;
  payment_reference: string;
  period_start_date: string;
  period_end_date: string;
  transaction_count: number;
  total_sales_amount: number;
  status: string;
}

interface Props {
  data: Payment[];
}

export function CommissionPaymentTable({ data }: Props) {
  const statusColors = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
    cancelled: "bg-gray-500",
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Date</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Sales Amount</TableHead>
            <TableHead className="text-right">Transactions</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                No payments found
              </TableCell>
            </TableRow>
          ) : (
            data.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.payment_date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(payment.period_start_date).toLocaleDateString(
                      "en-IN",
                      { month: "short", day: "numeric" }
                    )}
                    {" - "}
                    {new Date(payment.period_end_date).toLocaleDateString(
                      "en-IN",
                      { month: "short", day: "numeric" }
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{payment.payment_amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right">
                  ₹{payment.total_sales_amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right">
                  {payment.transaction_count}
                </TableCell>
                <TableCell className="capitalize">
                  {payment.payment_method.replace("_", " ")}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {payment.payment_reference}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[payment.status as keyof typeof statusColors]
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
