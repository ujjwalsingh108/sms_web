import { getItems, getCategories } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ItemsTable from "@/components/inventory/items-table";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const [itemsResult, categoriesResult] = await Promise.all([
    getItems(),
    getCategories(),
  ]);

  const items = itemsResult.success && itemsResult.data ? itemsResult.data : [];
  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Inventory Items
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage all inventory items and stock levels
              </p>
            </div>
          </div>
          <Link href="/dashboard/inventory/items/new">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </Link>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Package className="h-5 w-5" />
              All Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemsTable items={items} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
