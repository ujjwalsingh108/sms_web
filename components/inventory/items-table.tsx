"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteItem } from "@/app/dashboard/inventory/actions";
import { useRouter } from "next/navigation";
import type { InventoryItemWithCategory } from "@/app/dashboard/inventory/actions";

interface ItemsTableProps {
  items: InventoryItemWithCategory[];
}

export default function ItemsTable({ items }: ItemsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete item "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    const result = await deleteItem(id);
    setDeletingId(null);

    if (!result.success) {
      toast.error(result.error || "Failed to delete item");
    } else {
      router.refresh();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: "bg-green-100 text-green-800",
      out_of_stock: "bg-red-100 text-red-800",
      discontinued: "bg-gray-100 text-gray-800",
    };
    return (
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.available
    );
  };

  const isLowStock = (item: InventoryItemWithCategory) => {
    return item.quantity <= item.minimum_quantity;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No inventory items found</p>
        <p className="text-gray-400 text-sm mt-2">
          Add your first inventory item to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Item Details
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Category
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                Quantity
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                Unit Price
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b hover:bg-gray-50 ${
                  isLowStock(item) ? "bg-red-50" : ""
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-start gap-2">
                    {isLowStock(item) && (
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.item_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Code: {item.item_code}
                      </p>
                      {item.location && (
                        <p className="text-xs text-gray-500">
                          Location: {item.location}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline">
                    {item.category?.name || "Uncategorized"}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <div>
                    <p className="font-medium">
                      {item.quantity} {item.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Min: {item.minimum_quantity}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  ₹{item.unit_price.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusBadge(item.status)}>
                    {item.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/inventory/items/${item.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.item_name)}
                      disabled={deletingId === item.id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 space-y-3 ${
              isLowStock(item) ? "bg-red-50 border-red-200" : "bg-white"
            } shadow-sm`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                {isLowStock(item) && (
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.item_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Code: {item.item_code}
                  </p>
                </div>
              </div>
              <Badge className={getStatusBadge(item.status)}>
                {item.status.replace("_", " ")}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium text-sm">
                  {item.category?.name || "Uncategorized"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-sm">{item.location || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="font-medium text-sm">
                  {item.quantity} {item.unit}
                  <span className="text-xs text-gray-500 ml-1">
                    (Min: {item.minimum_quantity})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Unit Price</p>
                <p className="font-medium text-sm">
                  ₹{item.unit_price.toFixed(2)}
                </p>
              </div>
            </div>

            {item.description && (
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Link
                href={`/dashboard/inventory/items/${item.id}/edit`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(item.id, item.item_name)}
                disabled={deletingId === item.id}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deletingId === item.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
