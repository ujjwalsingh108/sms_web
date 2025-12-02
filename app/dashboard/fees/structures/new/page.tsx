import { getClasses } from "../../actions";
import CreateFeeStructureForm from "@/components/fees/create-fee-structure-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewFeeStructurePage() {
  const classesResult = await getClasses();
  const classes = classesResult.success ? classesResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/fees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Fee Structure</h1>
          <p className="text-muted-foreground">Create a new fee structure</p>
        </div>
      </div>

      <CreateFeeStructureForm classes={classes} />
    </div>
  );
}
