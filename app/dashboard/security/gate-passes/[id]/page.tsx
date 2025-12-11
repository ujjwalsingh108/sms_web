"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Edit,
} from "lucide-react";

export default function GatePassDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gatePass, setGatePass] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchGatePass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchGatePass = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("gate_passes")
        .select(
          `
          *,
          student:students (
            first_name,
            last_name,
            admission_no,
            class,
            section
          ),
          staff:staff (
            first_name,
            last_name,
            employee_id,
            department
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setGatePass(data);
    } catch (error) {
      console.error("Error fetching gate pass:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400";
      case "pending":
        return "from-yellow-100 to-orange-100 text-yellow-700 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400";
      case "rejected":
        return "from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400";
      case "returned":
        return "from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400";
      default:
        return "from-gray-100 to-gray-100 text-gray-700 dark:from-gray-900/30 dark:to-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5" />;
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "rejected":
        return <XCircle className="h-5 w-5" />;
      case "returned":
        return <LogOut className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!gatePass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Gate pass not found</p>
      </div>
    );
  }

  const person = gatePass.student || gatePass.staff;
  const personType = gatePass.student ? "Student" : "Staff";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/security/gate-passes">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gate Pass Details
            </h1>
          </div>
          {gatePass.status === "pending" && (
            <Link href={`/dashboard/security/gate-passes/${id}/edit`}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Edit className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </Link>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r ${getStatusColor(
              gatePass.status
            )}`}
          >
            {getStatusIcon(gatePass.status)}
            {gatePass.status?.toUpperCase()}
          </span>
        </div>

        {/* Person Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {personType} Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Name</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {person?.first_name} {person?.last_name}
                </p>
              </div>

              {gatePass.student && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Admission No</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {person?.admission_no}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Class</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {person?.class} - {person?.section}
                    </p>
                  </div>
                </>
              )}

              {gatePass.staff && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Employee ID</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {person?.employee_id}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Department</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {person?.department}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pass Details */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pass Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Pass Type</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {gatePass.pass_type?.replace(/_/g, " ")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Date of Exit</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(gatePass.date_of_exit).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {gatePass.expected_return && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Expected Return</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(gatePass.expected_return).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

              {gatePass.actual_return && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <LogOut className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Actual Return</span>
                  </div>
                  <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                    {new Date(gatePass.actual_return).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Issued Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(gatePass.created_at).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purpose */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Purpose
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {gatePass.purpose || "No purpose provided"}
            </p>
          </CardContent>
        </Card>

        {/* Remarks */}
        {gatePass.remarks && (
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Remarks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {gatePass.remarks}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
