import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  AlertTriangle,
  FolderOpen,
  DollarSign,
  Users,
  ShoppingCart,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { getInventoryStats, getItems } from "./actions";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const statsResult = await getInventoryStats();
  const itemsResult = await getItems();

  const stats = statsResult.success ? statsResult.data : null;
  const items = itemsResult.success && itemsResult.data ? itemsResult.data : [];

  // Low stock items
  const lowStockItems = items.filter(
    (item) => item.quantity <= item.minimum_quantity
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Inventory Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage items, categories, suppliers, and purchase orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats?.lowStockItems || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalCategories || 0}
            </div>
            <p className="text-xs text-muted-foreground">Item categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats?.totalValue.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Suppliers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeSuppliers || 0}
            </div>
            <p className="text-xs text-muted-foreground">Available suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/inventory/items/new">
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </Link>
            <Link href="/dashboard/inventory/categories">
              <Button className="w-full" variant="outline">
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/dashboard/inventory/suppliers">
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Suppliers
              </Button>
            </Link>
            <Link href="/dashboard/inventory/purchase-orders/new">
              <Button className="w-full" variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                The following items are running low on stock:
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {lowStockItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.item_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {item.quantity} / Min: {item.minimum_quantity}
                      </p>
                    </div>
                    <Link href={`/dashboard/inventory/items/${item.id}/edit`}>
                      <Button size="sm" variant="ghost">
                        Update
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
              {lowStockItems.length > 6 && (
                <Link href="/dashboard/inventory/items">
                  <Button variant="link" className="mt-2">
                    View all {lowStockItems.length} low stock items →
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Navigation */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/dashboard/inventory/items">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage all inventory items, track stock levels, and
                update quantities
              </p>
              <Button variant="link" className="mt-3 p-0">
                Manage Items →
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/inventory/purchase-orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and track purchase orders, manage suppliers, and monitor
                deliveries
              </p>
              <Button variant="link" className="mt-3 p-0">
                View Orders →
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
