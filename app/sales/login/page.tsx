import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SalesLoginForm } from "@/components/sales/sales-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SalesLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in, check if they're a sales executive
  if (user) {
    const { data: salesExec } = await supabase
      .from("sales_executives")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_deleted", false)
      .single();

    if (salesExec) {
      redirect("/sales/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sales Portal Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the sales dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SalesLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
