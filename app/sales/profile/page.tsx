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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/sales/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">My Profile</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Update your personal information
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Employee Code: {salesExec.employee_code}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesProfileEditForm salesExecutive={salesExec} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
