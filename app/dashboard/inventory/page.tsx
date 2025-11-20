import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function InventoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select(`
      *,
      role:role_id(id, name, display_name),
      tenant:tenant_id(id, name, email)
    `)
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as { tenant_id: string } | undefined;

  if (!member) {
    redirect("/login");
  }

  // Fetch inventory items
  const { data: items } = await supabase
    .from("inventory_items")
    .select(`
      *,
      category:inventory_categories(name)
    `)
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch purchase orders
  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select(`
      *,
      supplier:suppliers(name)
    `)
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false })
    .limit(10);

  type Item = {
    quantity: number;
    reorder_level: number;
  };

  const totalItems = items?.length || 0;
  const lowStockItems =
    (items as Item[] | null)?.filter((item) => item.quantity <= item.reorder_level)
      .length || 0;

  type PurchaseOrder = {
    status: string;
  };

  const pendingOrders =
    (purchaseOrders as PurchaseOrder[] | null)?.filter((po) => po.status === "pending")
      .length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage items, stock, and purchases</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/inventory/items/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </Link>
          <Link href="/dashboard/inventory/purchase-orders/new">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{totalItems}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{lowStockItems}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{pendingOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Item Code</th>
                  <th className="text-left p-3">Item Name</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Quantity</th>
                  <th className="text-left p-3">Unit</th>
                  <th className="text-left p-3">Reorder Level</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items && items.length > 0 ? (
                  items.map((item: any) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{item.item_code}</td>
                      <td className="p-3 font-medium">{item.item_name}</td>
                      <td className="p-3">{item.category?.name || "N/A"}</td>
                      <td className="p-3">
                        <span
                          className={`font-semibold ${
                            item.quantity <= item.reorder_level
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-3">{item.unit || "N/A"}</td>
                      <td className="p-3">{item.reorder_level || "N/A"}</td>
                      <td className="p-3">
                        {item.quantity <= item.reorder_level ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/inventory/items/${item.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-500">
                      No inventory items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Purchase Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">PO Number</th>
                  <th className="text-left p-3">Supplier</th>
                  <th className="text-left p-3">Order Date</th>
                  <th className="text-left p-3">Expected Date</th>
                  <th className="text-left p-3">Total Amount</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders && purchaseOrders.length > 0 ? (
                  purchaseOrders.map((po: any) => (
                    <tr key={po.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{po.po_number}</td>
                      <td className="p-3">{po.supplier?.name || "N/A"}</td>
                      <td className="p-3">
                        {new Date(po.order_date).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {po.expected_delivery_date
                          ? new Date(po.expected_delivery_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3 font-semibold">₹{po.total_amount || "0"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            po.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : po.status === "approved"
                              ? "bg-blue-100 text-blue-800"
                              : po.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/inventory/purchase-orders/${po.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-8 text-gray-500">
                      No purchase orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
