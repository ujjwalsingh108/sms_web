import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Edit,
} from "lucide-react";
import Link from "next/link";

type Visitor = {
  id: string;
  visitor_name: string;
  phone: string | null;
  email: string | null;
  purpose: string | null;
  person_to_meet: string | null;
  check_in_time: string;
  check_out_time: string | null;
  id_proof_type: string | null;
  id_proof_number: string | null;
  status: string;
  remarks: string | null;
  created_at: string;
};

export default async function VisitorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .single();

  if (!members) {
    redirect("/login");
  }

  const memberData = members as { tenant_id: string };

  const { data: visitor, error } = await supabase
    .from("visitors")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", memberData.tenant_id)
    .is("is_deleted", false)
    .single();

  if (error || !visitor) {
    redirect("/dashboard/security/visitors");
  }

  const visitorData = visitor as Visitor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/security/visitors">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Visitor Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {visitorData.visitor_name}
            </p>
          </div>
          <Link href={`/dashboard/security/visitors/${id}/edit`}>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold ${
              visitorData.status === "checked_in"
                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400"
                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400"
            }`}
          >
            {visitorData.status === "checked_in" ? (
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
                  {visitorData.visitor_name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Phone Number</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {visitorData.phone || "N/A"}
                </p>
              </div>

              {visitorData.email && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">
                    {visitorData.email}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Person to Meet</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {visitorData.person_to_meet || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Check-in Time</span>
                </div>
                <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                  {new Date(visitorData.check_in_time).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Check-out Time</span>
                </div>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                  {visitorData.check_out_time ? (
                    new Date(visitorData.check_out_time).toLocaleString()
                  ) : (
                    <span className="text-orange-600 dark:text-orange-400">
                      Not checked out
                    </span>
                  )}
                </p>
              </div>

              {visitorData.id_proof_type && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">ID Proof Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {visitorData.id_proof_type}
                  </p>
                </div>
              )}

              {visitorData.id_proof_number && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">ID Proof Number</span>
                  </div>
                  <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white">
                    {visitorData.id_proof_number}
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
                {visitorData.purpose || "N/A"}
              </p>
            </CardContent>
          </Card>

          {visitorData.remarks && (
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                  Remarks
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {visitorData.remarks}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Additional Info */}
        <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Visitor ID</p>
                <p className="font-mono text-gray-900 dark:text-gray-100">
                  {visitorData.id}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Created On
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(visitorData.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
