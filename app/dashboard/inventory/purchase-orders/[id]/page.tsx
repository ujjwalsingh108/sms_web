import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  Calendar,
  DollarSign,
  Truck,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPurchaseOrderById, updatePurchaseOrderStatus } from "../../actions";
import { revalidatePath } from "next/cache";

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPurchaseOrderById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const purchaseOrder = result.data;

  async function handleStatusUpdate(formData: FormData) {
    "use server";
    const status = formData.get("status") as string;
    await updatePurchaseOrderStatus(id, status);
    revalidatePath(`/dashboard/inventory/purchase-orders/${id}`);
  }

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    approved: {
      color: "bg-blue-100 text-blue-800",
      icon: CheckCircle,
    },
    delivered: {
      color: "bg-green-100 text-green-800",
      icon: Truck,
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  };

  const currentStatus =
    statusConfig[purchaseOrder.status as keyof typeof statusConfig];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <Link href="/dashboard/inventory/purchase-orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {purchaseOrder.order_number}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Purchase order details
            </p>
          </div>
        </div>
        <Badge className={currentStatus.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {purchaseOrder.status.charAt(0).toUpperCase() +
            purchaseOrder.status.slice(1)}
        </Badge>
      </div>

      {/* Status Update Form */}
      {purchaseOrder.status !== "delivered" &&
        purchaseOrder.status !== "cancelled" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={handleStatusUpdate}
                className="flex flex-col sm:flex-row gap-4"
              >
                <select
                  name="status"
                  className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  defaultValue={purchaseOrder.status}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button type="submit">Update Status</Button>
              </form>
              {purchaseOrder.status === "approved" && (
                <p className="text-sm text-gray-600 mt-2">
                  Note: Marking as "Delivered" will automatically update
                  inventory quantities.
                </p>
              )}
            </CardContent>
          </Card>
        )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Number</p>
              <p className="text-base font-semibold">
                {purchaseOrder.order_number}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Supplier</p>
              <p className="text-base font-semibold">
                {purchaseOrder.supplier?.name || "N/A"}
              </p>
              {purchaseOrder.supplier?.contact_person && (
                <p className="text-sm text-gray-600">
                  Contact: {purchaseOrder.supplier.contact_person}
                </p>
              )}
              {purchaseOrder.supplier?.phone && (
                <p className="text-sm text-gray-600">
                  Phone: {purchaseOrder.supplier.phone}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Order Date
                </p>
                <p className="text-base">
                  {new Date(purchaseOrder.order_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  Expected Delivery
                </p>
                <p className="text-base">
                  {purchaseOrder.expected_delivery_date
                    ? new Date(
                        purchaseOrder.expected_delivery_date
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            {purchaseOrder.remarks && (
              <div>
                <p className="text-sm font-medium text-gray-500">Remarks</p>
                <p className="text-sm text-gray-700">{purchaseOrder.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{purchaseOrder.total_amount.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Number of Items:</span>
                <span className="font-medium">
                  {purchaseOrder.items?.length || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">
                  {purchaseOrder.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({purchaseOrder.items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Item Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Item Code
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Unit Price
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
                  purchaseOrder.items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {item.inventory_item?.item_name || "N/A"}
                          </p>
                          {item.inventory_item?.category && (
                            <p className="text-sm text-gray-600">
                              {item.inventory_item.category.name}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.inventory_item?.item_code || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {item.quantity} {item.inventory_item?.unit || "units"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        ₹{item.unit_price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        ₹{item.total_price.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
              purchaseOrder.items.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.inventory_item?.item_name || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Code: {item.inventory_item?.item_code || "N/A"}
                      </p>
                      {item.inventory_item?.category && (
                        <p className="text-sm text-gray-600">
                          Category: {item.inventory_item.category.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium">
                        {item.quantity} {item.inventory_item?.unit || "units"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unit Price</p>
                      <p className="font-medium">
                        ₹{item.unit_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">Total Price</p>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{item.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">No items found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
