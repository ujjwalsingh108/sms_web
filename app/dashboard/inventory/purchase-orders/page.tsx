import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/inventory">
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Purchase Orders
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage all purchase orders ({purchaseOrders.length})
              </p>
            </div>
          </div>
          <Link href="/dashboard/inventory/purchase-orders/new">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </Link>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <ShoppingCart className="h-5 w-5" />
              All Purchase Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PurchaseOrdersTable purchaseOrders={purchaseOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
