import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditFeeStructureForm from "@/components/fees/edit-fee-structure-form";
import { getClasses } from "@/app/dashboard/fees/actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeeStructurePage({ params }: PageProps) {
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

  const [feeStructureResult, classesResult] = await Promise.all([
    supabase
      .from("fee_structures")
      .select("*")
      .eq("id", id)
      .eq("tenant_id", (member as { tenant_id: string }).tenant_id)
      .eq("is_deleted", false)
      .single(),
    getClasses(),
  ]);

  const feeStructure = feeStructureResult.data;
  const classes = classesResult.success ? classesResult.data : [];

  if (!feeStructure) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/fees/structures/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Fee Structure</h1>
          <p className="text-muted-foreground">Update fee structure details</p>
        </div>
      </div>

      <EditFeeStructureForm
        feeStructure={feeStructure}
        classes={classes || []}
      />
    </div>
  );
}
