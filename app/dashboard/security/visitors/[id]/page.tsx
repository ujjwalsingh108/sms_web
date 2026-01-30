"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  LogOut,
  CheckCircle,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VisitorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [visitor, setVisitor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchVisitor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVisitor = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setVisitor(data);
    } catch (error) {
      console.error("Error fetching visitor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setChecking(true);
    try {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("visitors")
        .update({
          check_out_time: currentTime,
          status: "checked_out",
        })
        .eq("id", id);

      if (error) throw error;

      await fetchVisitor();
      router.refresh();
    } catch (error) {
      console.error("Error checking out visitor:", error);
      toast.error("Failed to check out visitor. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Visitor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/security/visitors">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Visitor Details
            </h1>
          </div>
          {visitor.status === "checked_in" && (
            <Button
              onClick={handleCheckout}
              disabled={checking}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {checking ? "Checking Out..." : "Check Out Visitor"}
            </Button>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold ${
              visitor.status === "checked_in"
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
            }`}
          >
            {visitor.status === "checked_in" ? (
              <>
                <CheckCircle className="h-5 w-5" />
                Currently in Campus
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                Checked Out
              </>
            )}
          </span>
        </div>

        {/* Visitor Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Visitor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Visitor Name</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {visitor.visitor_name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Phone Number</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {visitor.phone || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Visit Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {new Date(visitor.visit_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Whom to Meet</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {visitor.whom_to_meet || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Check-in Time</span>
                </div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                  {visitor.check_in_time}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Check-out Time</span>
                </div>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  {visitor.check_out_time || (
                    <span className="text-orange-600 dark:text-orange-400">
                      Not checked out
                    </span>
                  )}
                </p>
              </div>

              {visitor.id_proof_type && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">ID Proof Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {visitor.id_proof_type}
                  </p>
                </div>
              )}

              {visitor.id_proof_number && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">ID Proof Number</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                    {visitor.id_proof_number}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Purpose and Remarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Purpose of Visit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {visitor.purpose || "N/A"}
              </p>
            </CardContent>
          </Card>

          {visitor.remarks && (
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                  Remarks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {visitor.remarks}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
