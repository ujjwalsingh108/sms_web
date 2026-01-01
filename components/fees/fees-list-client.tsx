"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreVertical, Eye, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import {
  deleteFeeStructure,
  deleteFeePayment,
} from "@/app/dashboard/fees/actions";
import { toast } from "sonner";
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

interface FeesListClientProps {
  structures: any[];
  payments: any[];
}

export default function FeesListClient({
  structures,
  payments,
}: FeesListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"structure" | "payment" | null>(
    null
  );

  // Filter structures
  const filteredStructures = structures.filter((structure) => {
    const matchesSearch =
      structure.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      structure.class?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || structure.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const studentName = `${payment.student?.first_name} ${payment.student?.last_name}`;
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.admission_no
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return;

    try {
      const result =
        deleteType === "structure"
          ? await deleteFeeStructure(deleteId)
          : await deleteFeePayment(deleteId);

      if (result.success) {
        toast.success(`Fee ${deleteType} deleted successfully`);
        setDeleteDialogOpen(false);
        setDeleteId(null);
        setDeleteType(null);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Fees Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="structures">Fee Structures</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="payments" className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Admission No</TableHead>
                      <TableHead>Fee Structure</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Due Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-muted-foreground"
                        >
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.student?.first_name}{" "}
                            {payment.student?.last_name}
                          </TableCell>
                          <TableCell>{payment.student?.admission_no}</TableCell>
                          <TableCell>
                            {payment.fee_structure?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            ₹{Number(payment.amount_paid).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-semibold ${
                                payment.dueAmount > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
                              }`}
                            >
                              ₹{Number(payment.dueAmount || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              payment.payment_date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/fees/payments/${payment.id}`}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/fees/payments/${payment.id}/edit`}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setDeleteId(payment.id);
                                    setDeleteType("payment");
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredPayments.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No payments found
                  </p>
                ) : (
                  filteredPayments.map((payment) => (
                    <Card key={payment.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">
                                {payment.student?.first_name}{" "}
                                {payment.student?.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {payment.student?.admission_no}
                              </p>
                            </div>
                            <Badge
                              variant={
                                payment.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <p>Fee: {payment.fee_structure?.name || "N/A"}</p>
                            <p className="font-semibold text-lg">
                              Amount Paid: ₹
                              {Number(payment.amount_paid).toLocaleString()}
                            </p>
                            <p
                              className={`font-semibold ${
                                payment.dueAmount > 0
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
                              }`}
                            >
                              Due: ₹
                              {Number(payment.dueAmount || 0).toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">
                              {new Date(
                                payment.payment_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="flex-1"
                            >
                              <Link
                                href={`/dashboard/fees/payments/${payment.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="flex-1"
                            >
                              <Link
                                href={`/dashboard/fees/payments/${payment.id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setDeleteId(payment.id);
                                setDeleteType("payment");
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="structures" className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStructures.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          No fee structures found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStructures.map((structure) => (
                        <TableRow key={structure.id}>
                          <TableCell className="font-medium">
                            {structure.name}
                          </TableCell>
                          <TableCell>
                            {structure.class?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            ₹{Number(structure.amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {structure.academic_year?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                structure.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {structure.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/fees/structures/${structure.id}`}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/fees/structures/${structure.id}/edit`}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setDeleteId(structure.id);
                                    setDeleteType("structure");
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredStructures.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    No fee structures found
                  </p>
                ) : (
                  filteredStructures.map((structure) => (
                    <Card key={structure.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{structure.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {structure.class?.name || "N/A"}
                              </p>
                            </div>
                            <Badge
                              variant={
                                structure.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {structure.status}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <p className="font-semibold text-lg">
                              ₹{Number(structure.amount).toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">
                              {structure.academic_year?.name || "N/A"}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="flex-1"
                            >
                              <Link
                                href={`/dashboard/fees/structures/${structure.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="flex-1"
                            >
                              <Link
                                href={`/dashboard/fees/structures/${structure.id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setDeleteId(structure.id);
                                setDeleteType("structure");
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft delete the {deleteType}. You can restore it later
              if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
