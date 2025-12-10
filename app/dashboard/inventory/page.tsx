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
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage items, categories, suppliers, and purchase orders
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-base font-medium">
                Total Items
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <Package className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stats?.totalItems || 0}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-base font-medium">
                Low Stock
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600">
                <AlertTriangle className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {stats?.lowStockItems || 0}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Items need restocking
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-base font-medium">
                Categories
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <FolderOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats?.totalCategories || 0}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Item categories
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-base font-medium">
                Total Value
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹{stats?.totalValue.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Current inventory value
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-base font-medium">
                Active Suppliers
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {stats?.activeSuppliers || 0}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Available suppliers
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm md:text-base font-medium">
                Pending Orders
              </CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600">
                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {stats?.pendingOrders || 0}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Awaiting delivery
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/dashboard/inventory/items/new">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </Link>
              <Link href="/dashboard/inventory/categories">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Manage Categories
                </Button>
              </Link>
              <Link href="/dashboard/inventory/suppliers">
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Suppliers
                </Button>
              </Link>
              <Link href="/dashboard/inventory/purchase-orders/new">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  New Purchase Order
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-red-300 dark:border-red-800 glass-effect shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <div className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  The following items are running low on stock:
                </p>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {lowStockItems.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-xl bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm md:text-base truncate">
                          {item.item_name}
                        </p>
                        <p className="text-xs md:text-sm text-red-600 dark:text-red-400 font-medium mt-1">
                          Stock: {item.quantity} / Min: {item.minimum_quantity}
                        </p>
                      </div>
                      <Link href={`/dashboard/inventory/items/${item.id}/edit`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Link href="/dashboard/inventory/items">
            <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Package className="h-5 w-5" />
                  Inventory Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
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
            <Card className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <ShoppingCart className="h-5 w-5" />
                  Purchase Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm md:text-base text-muted-foreground">
                  Create and track purchase orders, manage suppliers, and
                  monitor deliveries
                </p>
                <Button variant="link" className="mt-3 p-0">
                  View Orders →
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
