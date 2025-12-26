import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesProfileEditForm } from "@/components/sales/sales-profile-edit-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SalesExecutive } from "@/lib/types/sales-executive";

export default async function SalesProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sales/login");
  }

  // Get sales executive profile
  const { data: salesExec } = (await supabase
    .from("sales_executives")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_deleted", false)
    .single()) as { data: SalesExecutive | null };

  if (!salesExec) {
    redirect("/sales/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/sales/dashboard">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-purple-100 transition-colors rounded-full h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Update your personal information
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Profile Information
              </CardTitle>
              <CardDescription className="text-sm sm:text-base font-medium text-gray-600">
                Employee Code: {salesExec.employee_code}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesProfileEditForm salesExecutive={salesExec} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
