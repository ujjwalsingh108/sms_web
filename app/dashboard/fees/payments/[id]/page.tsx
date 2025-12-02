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

  return <FeePaymentDetailView payment={payment} />;
}
