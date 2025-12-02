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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/fees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Payment Details</h1>
          <p className="text-muted-foreground">Fee Payment Information</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/fees/payments/${payment.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Payment Information</CardTitle>
          <Badge
            variant={
              payment.status === "completed"
                ? "default"
                : payment.status === "pending"
                ? "secondary"
                : "destructive"
            }
          >
            {payment.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Student Details */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Student Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">
                    {payment.student?.first_name} {payment.student?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admission No</p>
                  <p className="font-semibold">
                    {payment.student?.admission_no}
                  </p>
                </div>
                {payment.student?.class && (
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-semibold">
                      {payment.student.class.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Amount */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Amount Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-3xl font-bold">
                    ₹{Number(payment.amount_paid).toLocaleString()}
                  </p>
                </div>
                {payment.fee_structure && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Fee Structure
                      </p>
                      <p className="font-semibold">
                        {payment.fee_structure.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Fee</p>
                      <p className="font-semibold">
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
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Date</p>
                <p className="font-semibold">
                  {new Date(payment.payment_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-semibold capitalize">
                  {payment.payment_method?.replace("_", " ")}
                </p>
              </div>
            </div>

            {payment.transaction_id && (
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="font-semibold font-mono text-sm">
                    {payment.transaction_id}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-semibold">
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
            <div className="flex items-start gap-3 pt-4 border-t">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap">{payment.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
