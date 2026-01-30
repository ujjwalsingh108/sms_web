"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Package, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPurchaseOrder } from "@/app/dashboard/inventory/actions";
import type {
  Supplier,
  InventoryItemWithCategory,
} from "@/app/dashboard/inventory/actions";

interface PurchaseOrderFormProps {
  suppliers: Supplier[];
  items: InventoryItemWithCategory[];
}

interface OrderItem {
  id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function PurchaseOrderForm({
  suppliers,
  items,
}: PurchaseOrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: crypto.randomUUID(),
      inventory_item_id: "",
      quantity: 1,
      unit_price: 0,
      total_price: 0,
    },
  ]);
  const router = useRouter();

  const addItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: crypto.randomUUID(),
        inventory_item_id: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (orderItems.length === 1) {
      toast.error("At least one item is required");
      return;
    }
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-fill unit price when item is selected
          if (field === "inventory_item_id" && value) {
            const selectedItem = items.find((i) => i.id === value);
            if (selectedItem) {
              updatedItem.unit_price = selectedItem.unit_price;
            }
          }

          // Calculate total price
          updatedItem.total_price =
            updatedItem.quantity * updatedItem.unit_price;

          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate items
    const invalidItems = orderItems.filter(
      (item) =>
        !item.inventory_item_id || item.quantity <= 0 || item.unit_price <= 0
    );

    if (invalidItems.length > 0) {
      setError("Please fill in all item details correctly");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const data = {
      order_number: formData.get("order_number") as string,
      supplier_id: formData.get("supplier_id") as string,
      order_date: formData.get("order_date") as string,
      expected_delivery_date: formData.get("expected_delivery_date") as string,
      total_amount: calculateTotalAmount(),
      status: formData.get("status") as string,
      remarks: formData.get("remarks") as string,
      items: orderItems.map((item) => ({
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })),
    };

    const result = await createPurchaseOrder(data);

    setLoading(false);

    if (result.success) {
      router.push("/dashboard/inventory/purchase-orders");
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Number */}
        <div className="space-y-2">
          <Label htmlFor="order_number">
            Order Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="order_number"
            name="order_number"
            type="text"
            placeholder="e.g., PO-2024-001"
            required
            disabled={loading}
          />
        </div>

        {/* Supplier */}
        <div className="space-y-2">
          <Label htmlFor="supplier_id">
            Supplier <span className="text-red-500">*</span>
          </Label>
          <select
            id="supplier_id"
            name="supplier_id"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            required
            disabled={loading}
          >
            <option value="">Select a supplier</option>
            {suppliers
              .filter((s) => s.status === "active")
              .map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
          </select>
        </div>

        {/* Order Date */}
        <div className="space-y-2">
          <Label htmlFor="order_date">
            Order Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="order_date"
            name="order_date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
            disabled={loading}
          />
        </div>

        {/* Expected Delivery Date */}
        <div className="space-y-2">
          <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
          <Input
            id="expected_delivery_date"
            name="expected_delivery_date"
            type="date"
            disabled={loading}
          />
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          name="remarks"
          placeholder="Additional notes or instructions (optional)"
          rows={3}
          disabled={loading}
        />
      </div>

      {/* Order Items */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {orderItems.map((orderItem, index) => {
            const selectedItem = items.find(
              (i) => i.id === orderItem.inventory_item_id
            );

            return (
              <div
                key={orderItem.id}
                className="border rounded-lg p-4 space-y-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Item {index + 1}
                  </h4>
                  {orderItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(orderItem.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Item Selection */}
                  <div className="space-y-2 md:col-span-2">
                    <Label>
                      Inventory Item <span className="text-red-500">*</span>
                    </Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={orderItem.inventory_item_id}
                      onChange={(e) =>
                        updateItem(
                          orderItem.id,
                          "inventory_item_id",
                          e.target.value
                        )
                      }
                      disabled={loading}
                    >
                      <option value="">Select an item</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.item_name} ({item.item_code}) - ₹
                          {item.unit_price.toFixed(2)}/{item.unit}
                        </option>
                      ))}
                    </select>
                    {selectedItem && (
                      <p className="text-xs text-gray-500">
                        Current stock: {selectedItem.quantity}{" "}
                        {selectedItem.unit}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label>
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={orderItem.quantity}
                      onChange={(e) => {
                        // Strip leading zeroes so typing "100" doesn't result in "0100"
                        const raw = e.target.value;
                        const cleaned = raw.replace(/^0+(?=\d)/, "");
                        updateItem(
                          orderItem.id,
                          "quantity",
                          parseInt(cleaned) || 0
                        );
                      }}
                      disabled={loading}
                    />
                    {selectedItem && (
                      <p className="text-xs text-gray-500">
                        Unit: {selectedItem.unit}
                      </p>
                    )}
                  </div>

                  {/* Unit Price */}
                  <div className="space-y-2">
                    <Label>
                      Unit Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={orderItem.unit_price}
                      onChange={(e) =>
                        updateItem(
                          orderItem.id,
                          "unit_price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Total Price */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Item Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{orderItem.total_price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grand Total */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              Total Amount:
            </span>
            <span className="text-2xl font-bold text-blue-600">
              ₹{calculateTotalAmount().toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {orderItems.length} item{orderItems.length !== 1 ? "s" : ""} in this
            order
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1 sm:flex-none"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Creating..." : "Create Purchase Order"}
        </Button>
      </div>
    </form>
  );
}
