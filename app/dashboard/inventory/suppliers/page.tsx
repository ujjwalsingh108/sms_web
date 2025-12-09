import { getSuppliers } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import SuppliersTable from "@/components/inventory/suppliers-table";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliersResult = await getSuppliers();
  const suppliers =
    suppliersResult.success && suppliersResult.data ? suppliersResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Suppliers
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage supplier contacts and information
          </p>
        </div>
        <Link href="/dashboard/inventory/suppliers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Suppliers ({suppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SuppliersTable suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  );
}
