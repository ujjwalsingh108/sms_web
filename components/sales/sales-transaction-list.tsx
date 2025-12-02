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

interface Transaction {
  id: string;
  school: { school_name: string; subdomain: string };
  subscription_plan: string;
  subscription_duration_months: number;
  final_amount: number;
  commission_amount: number;
  commission_status: string;
  sale_status: string;
  approval_status: string;
  subscription_start_date: string;
  subscription_end_date: string;
}

interface Props {
  data: Transaction[];
}

export function SalesExecutiveTransactionList({ data }: Props) {
  const statusColors = {
    active: "bg-green-500",
    expired: "bg-gray-500",
    cancelled: "bg-red-500",
    renewed: "bg-blue-500",
  };

  const commissionColors = {
    pending: "bg-yellow-500",
    approved: "bg-blue-500",
    paid: "bg-green-500",
    cancelled: "bg-red-500",
  };

  const approvalColors = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">School</TableHead>
            <TableHead className="min-w-[80px]">Plan</TableHead>
            <TableHead className="min-w-[80px]">Duration</TableHead>
            <TableHead className="text-right min-w-[100px]">Amount</TableHead>
            <TableHead className="text-right min-w-[100px]">
              Commission
            </TableHead>
            <TableHead className="min-w-[120px]">Commission Status</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
            <TableHead className="min-w-[100px]">Approval</TableHead>
            <TableHead className="min-w-[100px]">Start Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-muted-foreground"
              >
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            data.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">
                      {transaction.school.school_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.school.subdomain}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="capitalize text-sm">
                  {transaction.subscription_plan}
                </TableCell>
                <TableCell className="text-sm">
                  {transaction.subscription_duration_months} months
                </TableCell>
                <TableCell className="text-right text-sm">
                  ₹{transaction.final_amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right text-sm">
                  ₹{transaction.commission_amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      commissionColors[
                        transaction.commission_status as keyof typeof commissionColors
                      ]
                    }
                  >
                    {transaction.commission_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      statusColors[
                        transaction.sale_status as keyof typeof statusColors
                      ]
                    } text-xs`}
                  >
                    {transaction.sale_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      approvalColors[
                        transaction.approval_status as keyof typeof approvalColors
                      ]
                    } text-xs`}
                  >
                    {transaction.approval_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(
                    transaction.subscription_start_date
                  ).toLocaleDateString("en-IN")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
