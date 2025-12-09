"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, DollarSign, Package } from "lucide-react";
import Link from "next/link";
import type { PurchaseOrderWithDetails } from "@/app/dashboard/inventory/actions";

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrderWithDetails[];
}

export default function PurchaseOrdersTable({
  purchaseOrders,
}: PurchaseOrdersTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  if (purchaseOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No purchase orders found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first purchase order to get started
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
                Order Number
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Supplier
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Order Date
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Expected Delivery
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                Total Amount
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
            {purchaseOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.items?.length || 0} items
                  </p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">
                    {order.supplier?.name || "N/A"}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">
                    {order.expected_delivery_date
                      ? new Date(
                          order.expected_delivery_date
                        ).toLocaleDateString()
                      : "—"}
                  </p>
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  ₹{order.total_amount.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusBadge(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end">
                    <Link
                      href={`/dashboard/inventory/purchase-orders/${order.id}`}
                    >
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {purchaseOrders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {order.order_number}
                </h3>
                <p className="text-sm text-gray-600">
                  {order.supplier?.name || "N/A"}
                </p>
              </div>
              <Badge className={getStatusBadge(order.status)}>
                {order.status}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Order Date
                </p>
                <p className="font-medium text-sm">
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Expected Delivery
                </p>
                <p className="font-medium text-sm">
                  {order.expected_delivery_date
                    ? new Date(
                        order.expected_delivery_date
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Items
                </p>
                <p className="font-medium text-sm">
                  {order.items?.length || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Total Amount
                </p>
                <p className="font-medium text-sm">
                  ₹{order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>

            {order.remarks && (
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">Remarks</p>
                <p className="text-sm text-gray-700">{order.remarks}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t">
              <Link
                href={`/dashboard/inventory/purchase-orders/${order.id}`}
                className="w-full"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
