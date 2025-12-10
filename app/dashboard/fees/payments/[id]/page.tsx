import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import FeePaymentDetailView from "@/components/fees/fee-payment-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeePaymentDetailPage({ params }: PageProps) {
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

  const { data: payment } = await supabase
    .from("fee_payments")
    .select(
      `
      *,
      student:students(id, admission_no, first_name, last_name, class:classes(name)),
      fee_structure:fee_structures(id, name, amount)
    `
    )
    .eq("id", id)
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("is_deleted", false)
    .single();

  if (!payment) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <FeePaymentDetailView payment={payment} />
      </div>
    </div>
  );
}
