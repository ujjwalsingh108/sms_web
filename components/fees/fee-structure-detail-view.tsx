"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  ArrowLeft,
  DollarSign,
  Calendar,
  GraduationCap,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface FeeStructureDetailViewProps {
  feeStructure: any;
}

export default function FeeStructureDetailView({
  feeStructure,
}: FeeStructureDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/fees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{feeStructure.name}</h1>
          <p className="text-muted-foreground">Fee Structure Details</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/fees/structures/${feeStructure.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Fee Structure Information</CardTitle>
          <Badge
            variant={feeStructure.status === "active" ? "default" : "secondary"}
          >
            {feeStructure.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-2xl font-bold">
                    ₹{Number(feeStructure.amount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p className="font-semibold">
                    {feeStructure.class?.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <p className="font-semibold capitalize">
                    {feeStructure.frequency?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              {feeStructure.academic_year && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Academic Year
                    </p>
                    <p className="font-semibold">
                      {feeStructure.academic_year.name}
                    </p>
                  </div>
                </div>
              )}

              {feeStructure.due_day && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due Day</p>
                    <p className="font-semibold">
                      Day {feeStructure.due_day} of month
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">
                    {new Date(feeStructure.created_at).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {feeStructure.description && (
            <div className="flex items-start gap-3 pt-4 border-t">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-1 whitespace-pre-wrap">
                  {feeStructure.description}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
