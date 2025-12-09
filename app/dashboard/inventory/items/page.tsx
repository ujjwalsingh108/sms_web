import { getItems, getCategories } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Inventory Items
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage all inventory items and stock levels
          </p>
        </div>
        <Link href="/dashboard/inventory/items/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ItemsTable items={items} />
        </CardContent>
      </Card>
    </div>
  );
}
