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
      .eq("tenant_id", member.tenant_id)
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/fees/payments/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Payment</h1>
          <p className="text-muted-foreground">Update payment details</p>
        </div>
      </div>

      <EditPaymentForm payment={payment} students={students} />
    </div>
  );
}
