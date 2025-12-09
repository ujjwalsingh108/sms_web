import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Edit Supplier
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Update supplier information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Supplier Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm supplier={supplier} />
        </CardContent>
      </Card>
    </div>
  );
}
