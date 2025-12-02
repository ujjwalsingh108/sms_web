import { getStudentsForFees, getClasses } from "../../actions";
import CreatePaymentForm from "@/components/fees/create-payment-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewPaymentPage() {
  const [studentsResult, classesResult] = await Promise.all([
    getStudentsForFees(),
    getClasses(),
  ]);

  const students = studentsResult.success ? studentsResult.data : [];
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
          <h1 className="text-3xl font-bold">Record Payment</h1>
          <p className="text-muted-foreground">Record a new fee payment</p>
        </div>
      </div>

      <CreatePaymentForm students={students || []} />
    </div>
  );
}
