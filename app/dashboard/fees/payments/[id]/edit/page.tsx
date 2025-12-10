import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditPaymentForm from "@/components/fees/edit-payment-form";
import { getStudentsForFees } from "@/app/dashboard/fees/actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPaymentPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    redirect("/login");
  }

  const [paymentResult, studentsResult] = await Promise.all([
    supabase
      .from("fee_payments")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
      .eq("is_deleted", false)
      .single(),
    getStudentsForFees(),
  ]);

  const payment = paymentResult.data;
  const students = studentsResult.success ? studentsResult.data : [];

  if (!payment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-white/50 dark:hover:bg-gray-800/50"
          >
            <Link href={`/dashboard/fees/payments/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Payment
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Update payment details
            </p>
          </div>
        </div>

        <EditPaymentForm payment={payment} students={students || []} />
      </div>
    </div>
  );
}
