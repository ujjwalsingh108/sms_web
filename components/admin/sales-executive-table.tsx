"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SalesExecutive {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  assigned_region: string | null;
  employment_status: string;
  total_sales_count: number;
  active_subscriptions_count: number;
  total_commission_earned: number;
  total_revenue_generated: number;
}

interface Props {
  data: SalesExecutive[];
}

export function SalesExecutiveTable({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(
    (exec) =>
      exec.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exec.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exec.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    on_leave: "bg-yellow-500",
    terminated: "bg-red-500",
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by name, code, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-full sm:max-w-sm text-sm"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Employee Code</TableHead>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="min-w-[180px]">Email</TableHead>
              <TableHead className="min-w-[100px]">Phone</TableHead>
              <TableHead className="min-w-[100px]">Region</TableHead>
              <TableHead className="text-right min-w-[60px]">Sales</TableHead>
              <TableHead className="text-right min-w-[60px]">Active</TableHead>
              <TableHead className="text-right min-w-[100px]">
                Revenue
              </TableHead>
              <TableHead className="text-right min-w-[100px]">
                Commission
              </TableHead>
              <TableHead className="min-w-[80px]">Status</TableHead>
              <TableHead className="text-right min-w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-muted-foreground"
                >
                  No sales executives found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((exec) => (
                <TableRow key={exec.id}>
                  <TableCell className="font-medium text-sm">
                    {exec.employee_code}
                  </TableCell>
                  <TableCell className="text-sm">{exec.full_name}</TableCell>
                  <TableCell className="text-sm">{exec.email}</TableCell>
                  <TableCell className="text-sm">{exec.phone}</TableCell>
                  <TableCell className="text-sm">
                    {exec.assigned_region || "-"}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {exec.total_sales_count}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {exec.active_subscriptions_count}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    ₹{exec.total_revenue_generated.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    ₹{exec.total_commission_earned.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusColors[
                          exec.employment_status as keyof typeof statusColors
                        ]
                      } text-xs`}
                    >
                      {exec.employment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/sales-executives/${exec.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/admin/sales-executives/${exec.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
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
