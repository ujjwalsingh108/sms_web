"use client";

import { useState } from "react";
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
import { CheckCircle, XCircle } from "lucide-react";

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
  created_at: string;
}

interface Props {
  data: Transaction[];
  showApprovalActions?: boolean;
}

export function SalesTransactionTable({
  data,
  showApprovalActions = false,
}: Props) {
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>School</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Commission</TableHead>
            <TableHead>Commission Status</TableHead>
            <TableHead>Sale Status</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead>Start Date</TableHead>
            {showApprovalActions && (
              <TableHead className="text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showApprovalActions ? 10 : 9}
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
                    <p className="font-medium">
                      {transaction.school.school_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.school.subdomain}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.subscription_plan}
                </TableCell>
                <TableCell>
                  {transaction.subscription_duration_months} months
                </TableCell>
                <TableCell className="text-right">
                  ₹{transaction.final_amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="text-right">
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
                    className={
                      statusColors[
                        transaction.sale_status as keyof typeof statusColors
                      ]
                    }
                  >
                    {transaction.sale_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      approvalColors[
                        transaction.approval_status as keyof typeof approvalColors
                      ]
                    }
                  >
                    {transaction.approval_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(
                    transaction.subscription_start_date
                  ).toLocaleDateString("en-IN")}
                </TableCell>
                {showApprovalActions &&
                  transaction.approval_status === "pending" && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
