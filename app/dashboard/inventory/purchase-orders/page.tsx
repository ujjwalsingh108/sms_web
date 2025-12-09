import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import Link from "next/link";
import { getPurchaseOrders } from "../actions";
import PurchaseOrdersTable from "@/components/inventory/purchase-orders-table";

export const dynamic = "force-dynamic";

export default async function PurchaseOrdersPage() {
  const purchaseOrdersResult = await getPurchaseOrders();
  const purchaseOrders =
    purchaseOrdersResult.success && purchaseOrdersResult.data
      ? purchaseOrdersResult.data
      : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Purchase Orders
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage all purchase orders ({purchaseOrders.length})
          </p>
        </div>
        <Link href="/dashboard/inventory/purchase-orders/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Purchase Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            All Purchase Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseOrdersTable purchaseOrders={purchaseOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
