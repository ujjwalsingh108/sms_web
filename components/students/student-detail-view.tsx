"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  GraduationCap,
} from "lucide-react";
import type { StudentWithDetails } from "@/lib/types/modules";
import { useState } from "react";

type FeesMonth = {
  index: number;
  month: number;
  year: number;
  monthName: string;
  totalDue: number;
  totalPaid: number;
  balance: number;
  payments: any[];
};

type FeesSummary = {
  academicYear: any | null;
  feeStructure: any | null;
  session: { totalDue: number; totalPaid: number; balance: number } | null;
  months: FeesMonth[];
} | null;

interface StudentDetailViewProps {
  student: StudentWithDetails;
  feesSummary?: FeesSummary;
  payments?: any[];
}

export function StudentDetailView({ student, feesSummary }: StudentDetailViewProps) {
  const [openMonth, setOpenMonth] = useState<number | null>(null);
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active:
        "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400",
      inactive:
        "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400",
      graduated:
        "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-400",
      transferred:
        "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400",
    };

    return (
      <Badge
        variant="outline"
        className={`${
          variants[status] ||
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
        } border-0 font-semibold`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {student.first_name} {student.last_name}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Admission No: {student.admission_no}
                </p>
                <div className="mt-2">{getStatusBadge(student.status)}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/students/${student.id}/edit`}
                className="flex-1"
              >
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Student
                </Button>
              </Link>
              <Link href={`/dashboard/students/${student.id}/results`}>
                <Button variant="outline" className="shadow-lg">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  First Name
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {student.first_name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Last Name
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {student.last_name}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Date of Birth
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(student.date_of_birth)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Gender
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {student.gender || "-"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Blood Group
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {student.blood_group || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-500" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Email
              </p>
              {student.email ? (
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <a
                    href={`mailto:${student.email}`}
                    className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {student.email}
                  </a>
                </div>
              ) : (
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  -
                </p>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Phone
              </p>
              {student.phone ? (
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <a
                    href={`tel:${student.phone}`}
                    className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {student.phone}
                  </a>
                </div>
              ) : (
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  -
                </p>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Address
              </p>
              {student.address ? (
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-1" />
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {student.address}
                  </p>
                </div>
              ) : (
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  -
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Class
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {student.class?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Section
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {student.section?.name || "-"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Admission Date
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {formatDate(student.admission_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Status
                </p>
                <div className="mt-1">{getStatusBadge(student.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardians Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              Guardians
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.guardians && student.guardians.length > 0 ? (
              <div className="space-y-4">
                {student.guardians
                  .filter((g) => !g.is_deleted)
                  .map((guardian, index) => (
                    <div
                      key={guardian.id}
                      className={index > 0 ? "pt-4 border-t" : ""}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{guardian.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {guardian.relationship || "Guardian"}
                            {guardian.is_primary && " (Primary)"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        {guardian.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={`tel:${guardian.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {guardian.phone}
                            </a>
                          </div>
                        )}
                        {guardian.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={`mailto:${guardian.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {guardian.email}
                            </a>
                          </div>
                        )}
                        {guardian.occupation && (
                          <p className="text-sm text-muted-foreground">
                            {guardian.occupation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No guardian information available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fees Information removed — Payments History covers fee details */}

      {/* Payments History List */}
      <div className="mt-6">
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-500" /> Payments History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {((arguments[0] as StudentDetailViewProps)?.payments || []).length > 0 ? (
              <PaymentsTable payments={(arguments[0] as StudentDetailViewProps).payments || []} />
            ) : (
              <p className="text-sm text-muted-foreground">No payments found for this student</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PaymentsTable({ payments }: { payments: any[] }) {
  const [page, setPage] = useState(1);
  const perPage = 8;
  const total = payments.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const start = (page - 1) * perPage;
  const pageItems = payments.slice(start, start + perPage);

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Fee Structure</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Due Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3 align-top">{p.payment_date}</td>
                  <td className="px-4 py-3 align-top">{p.fee_structure?.name || "-"}</td>
                  <td className="px-4 py-3 align-top">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(p.amount_paid))}
                  </td>
                  <td className="px-4 py-3 align-top text-red-600">
                    {p.dueAmount != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(p.dueAmount)) : "-"}
                  </td>
                  <td className="px-4 py-3 align-top">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pageItems.map((p) => (
          <div key={p.id} className="p-3 border rounded-md">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">{p.fee_structure?.name || "Payment"}</p>
                <p className="text-xs text-gray-500">{p.payment_date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(p.amount_paid))}</p>
                <p className="text-xs text-red-600">Due: {p.dueAmount != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(p.dueAmount)) : "-"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing {start + 1}-{Math.min(start + perPage, total)} of {total}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">{page} / {totalPages}</div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
