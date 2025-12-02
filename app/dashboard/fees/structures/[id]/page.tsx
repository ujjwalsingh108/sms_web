import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import FeeStructureDetailView from "@/components/fees/fee-structure-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FeeStructureDetailPage({ params }: PageProps) {
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

  const { data: feeStructure } = await supabase
    .from("fee_structures")
    .select(
      `
      *,
      class:classes(id, name),
      academic_year:academic_years(id, name)
    `
    )
    .eq("id", id)
    .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
    .eq("is_deleted", false)
    .single();

  if (!feeStructure) {
    notFound();
  }

  return <FeeStructureDetailView feeStructure={feeStructure} />;
}
