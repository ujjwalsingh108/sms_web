import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupplierById } from "../../../actions";
import SupplierForm from "@/components/inventory/supplier-form";

export default async function EditSupplierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getSupplierById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const supplier = result.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory/suppliers">
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Edit Supplier
            </h1>
            <p className="text-muted-foreground mt-1">Update supplier information</p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Users className="h-5 w-5" />
              Supplier Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SupplierForm supplier={supplier} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
