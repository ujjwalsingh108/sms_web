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
    active: "bg-emerald-500 hover:bg-emerald-600",
    expired: "bg-gray-500 hover:bg-gray-600",
    cancelled: "bg-red-500 hover:bg-red-600",
    renewed: "bg-blue-500 hover:bg-blue-600",
  };

  const commissionColors = {
    pending: "bg-amber-500 hover:bg-amber-600",
    approved: "bg-blue-500 hover:bg-blue-600",
    paid: "bg-emerald-500 hover:bg-emerald-600",
    cancelled: "bg-red-500 hover:bg-red-600",
  };

  const approvalColors = {
    pending: "bg-amber-500 hover:bg-amber-600",
    approved: "bg-emerald-500 hover:bg-emerald-600",
    rejected: "bg-red-500 hover:bg-red-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100">
              <TableHead className="min-w-[180px] font-semibold text-gray-900">
                School
              </TableHead>
              <TableHead className="min-w-[100px] font-semibold text-gray-900">
                Plan
              </TableHead>
              <TableHead className="min-w-[100px] font-semibold text-gray-900">
                Duration
              </TableHead>
              <TableHead className="text-right min-w-[120px] font-semibold text-gray-900">
                Amount
              </TableHead>
              <TableHead className="text-right min-w-[120px] font-semibold text-gray-900">
                Commission
              </TableHead>
              <TableHead className="min-w-[140px] font-semibold text-gray-900">
                Commission Status
              </TableHead>
              <TableHead className="min-w-[100px] font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="min-w-[120px] font-semibold text-gray-900">
                Approval
              </TableHead>
              <TableHead className="min-w-[120px] font-semibold text-gray-900">
                Start Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-gray-500 py-8 text-sm font-medium"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              data.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-purple-50/50 transition-colors"
                >
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {transaction.school.school_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {transaction.school.subdomain}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-sm font-medium text-gray-700">
                    {transaction.subscription_plan}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {transaction.subscription_duration_months} months
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-gray-900">
                    ₹{transaction.final_amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-purple-700">
                    ₹{transaction.commission_amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        commissionColors[
                          transaction.commission_status as keyof typeof commissionColors
                        ]
                      } text-white font-medium text-xs px-3 py-1 transition-colors`}
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
                      } text-white font-medium text-xs px-3 py-1 transition-colors`}
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
                      } text-white font-medium text-xs px-3 py-1 transition-colors`}
                    >
                      {transaction.approval_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 font-medium">
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
    </div>
  );
}
