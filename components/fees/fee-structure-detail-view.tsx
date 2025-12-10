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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "inactive":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800/50 dark:to-slate-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700";
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
            {feeStructure.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fee Structure Details
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Link href={`/dashboard/fees/structures/${feeStructure.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Fee Structure Information</CardTitle>
          <Badge className={getStatusColor(feeStructure.status)}>
            {feeStructure.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Amount
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{Number(feeStructure.amount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Class
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {feeStructure.class?.name || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Frequency
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {feeStructure.frequency?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              {feeStructure.academic_year && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Academic Year
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {feeStructure.academic_year.name}
                    </p>
                  </div>
                </div>
              )}

              {feeStructure.due_day && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-orange-500 dark:text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Due Day
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Day {feeStructure.due_day} of month
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
            <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-base text-gray-900 dark:text-gray-100 mt-1 whitespace-pre-wrap">
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
