import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { getSuppliers, getItems } from "../../actions";
import PurchaseOrderForm from "@/components/inventory/purchase-order-form";

export default async function NewPurchaseOrderPage() {
  const [suppliersResult, itemsResult] = await Promise.all([
    getSuppliers(),
    getItems(),
  ]);

  const suppliers =
    suppliersResult.success && suppliersResult.data ? suppliersResult.data : [];
  const items = itemsResult.success && itemsResult.data ? itemsResult.data : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          New Purchase Order
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Create a new purchase order
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseOrderForm suppliers={suppliers} items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
