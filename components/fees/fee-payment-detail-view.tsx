"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  ArrowLeft,
  User,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Hash,
} from "lucide-react";
import Link from "next/link";

interface FeePaymentDetailViewProps {
  payment: any;
}

export default function FeePaymentDetailView({
  payment,
}: FeePaymentDetailViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "failed":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800/50 dark:to-slate-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <Link href="/dashboard/fees">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Payment Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fee Payment Information
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Link href={`/dashboard/fees/payments/${payment.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Payment Information</CardTitle>
          <Badge className={getStatusColor(payment.status)}>
            {payment.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Details */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  Student Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Name
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {payment.student?.first_name} {payment.student?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Admission No
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {payment.student?.admission_no}
                  </p>
                </div>
                {payment.student?.class && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Class
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {payment.student.class.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Amount */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500 dark:text-green-400" />
                  Amount Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Amount Paid
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{Number(payment.amount_paid).toLocaleString()}
                  </p>
                </div>
                {payment.fee_structure && (
                  <>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Fee Structure
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {payment.fee_structure.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Total Fee
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        ₹{Number(payment.fee_structure.amount).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Payment Date
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(payment.payment_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Payment Method
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {payment.payment_method?.replace("_", " ")}
                </p>
              </div>
            </div>

            {payment.transaction_id && (
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-orange-500 dark:text-orange-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Transaction ID
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 font-mono text-sm">
                    {payment.transaction_id}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Created
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(payment.created_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {payment.notes && (
            <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Notes
                </p>
                <p className="text-base text-gray-900 dark:text-gray-100 mt-1 whitespace-pre-wrap">
                  {payment.notes}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
