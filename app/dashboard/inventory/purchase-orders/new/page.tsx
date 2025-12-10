import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory/purchase-orders">
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              New Purchase Order
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new purchase order
            </p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <ShoppingCart className="h-5 w-5" />
              Purchase Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PurchaseOrderForm suppliers={suppliers} items={items} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
