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
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Manage items, categories, suppliers, and purchase orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Items
            </CardTitle>
            <div className="p-2 rounded-lg primary-gradient">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {stats?.totalItems || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Low Stock
            </CardTitle>
            <div className="p-2 rounded-lg danger-gradient">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {stats?.lowStockItems || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Categories
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {stats?.totalCategories || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Item categories
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Value
            </CardTitle>
            <div className="p-2 rounded-lg success-gradient">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ₹{stats?.totalValue.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Suppliers
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              {stats?.activeSuppliers || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Available suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pending Orders
            </CardTitle>
            <div className="p-2 rounded-lg warning-gradient">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
              {stats?.pendingOrders || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting delivery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/inventory/items/new">
              <Button className="w-full primary-gradient text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </Link>
            <Link href="/dashboard/inventory/categories">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/dashboard/inventory/suppliers">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
                <Users className="h-4 w-4 mr-2" />
                Manage Suppliers
              </Button>
            </Link>
            <Link href="/dashboard/inventory/purchase-orders/new">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
                <ShoppingCart className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-300 dark:border-red-800 glass-effect shadow-lg shadow-red-500/20">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <div className="p-2 rounded-lg danger-gradient">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                The following items are running low on stock:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lowStockItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-xl bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-gray-800 dark:text-gray-200">
                        {item.item_name}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
                        Stock: {item.quantity} / Min: {item.minimum_quantity}
                      </p>
                    </div>
                    <Link href={`/dashboard/inventory/items/${item.id}/edit`}>
                      <Button
                        size="sm"
                        className="danger-gradient text-white hover:opacity-90"
                      >
                        Update
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
              {lowStockItems.length > 6 && (
                <Link href="/dashboard/inventory/items">
                  <Button
                    variant="link"
                    className="mt-4 text-red-600 dark:text-red-400 hover:text-red-700"
                  >
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
