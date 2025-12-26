import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SalesLoginForm } from "@/components/sales/sales-login-form";

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 p-4 overflow-hidden">
      <div className="w-full max-w-[420px]">
        <SalesLoginForm />
      </div>
    </div>
  );
}
