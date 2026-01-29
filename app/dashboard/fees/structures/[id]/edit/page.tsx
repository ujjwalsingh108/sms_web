import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditFeeStructureForm from "@/components/fees/edit-fee-structure-form";
import { getClasses } from "@/app/dashboard/fees/actions";
import { getAcademicYears } from "@/app/dashboard/academic/actions";
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
    getAcademicYears(),
  ]);

  const feeStructure = feeStructureResult.data;
  const classes = classesResult.success ? classesResult.data : [];
  const academicYears = (await (await getAcademicYears()).data) || [];

  if (!feeStructure) {
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
            <Link href={`/dashboard/fees/structures/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Fee Structure
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Update fee structure details
            </p>
          </div>
        </div>

        <EditFeeStructureForm
          feeStructure={feeStructure}
          classes={classes || []}
          academicYears={academicYears}
        />
      </div>
    </div>
  );
}
