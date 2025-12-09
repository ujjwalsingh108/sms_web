"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createItem, updateItem } from "@/app/dashboard/inventory/actions";
import type {
  InventoryItem,
  InventoryCategory,
} from "@/app/dashboard/inventory/actions";

interface ItemFormProps {
  item?: InventoryItem;
  categories: InventoryCategory[];
}

export default function ItemForm({ item, categories }: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const data = {
      category_id: formData.get("category_id") as string,
      item_name: formData.get("item_name") as string,
      item_code: formData.get("item_code") as string,
      description: formData.get("description") as string,
      unit: formData.get("unit") as string,
      quantity: Number(formData.get("quantity")),
      minimum_quantity: Number(formData.get("minimum_quantity")),
      unit_price: Number(formData.get("unit_price")),
      location: formData.get("location") as string,
      status: formData.get("status") as string,
    };

    const result = item
      ? await updateItem(item.id, data)
      : await createItem(data);

    setLoading(false);

    if (result.success) {
      router.push("/dashboard/inventory/items");
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Item Name */}
        <div className="space-y-2">
          <Label htmlFor="item_name">
            Item Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="item_name"
            name="item_name"
            type="text"
            placeholder="e.g., A4 Paper, Whiteboard Marker"
            defaultValue={item?.item_name}
            required
            disabled={loading}
          />
        </div>

        {/* Item Code */}
        <div className="space-y-2">
          <Label htmlFor="item_code">
            Item Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="item_code"
            name="item_code"
            type="text"
            placeholder="e.g., ITM-001"
            defaultValue={item?.item_code || undefined}
            required
            disabled={loading}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category_id">
            Category <span className="text-red-500">*</span>
          </Label>
          <select
            id="category_id"
            name="category_id"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={item?.category_id || undefined}
            required
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <Label htmlFor="unit">
            Unit <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unit"
            name="unit"
            type="text"
            placeholder="e.g., pcs, kg, liters"
            defaultValue={item?.unit || undefined}
            required
            disabled={loading}
          />
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">
            Current Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            defaultValue={item?.quantity}
            required
            disabled={loading}
          />
        </div>

        {/* Minimum Quantity */}
        <div className="space-y-2">
          <Label htmlFor="minimum_quantity">
            Minimum Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="minimum_quantity"
            name="minimum_quantity"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            defaultValue={item?.minimum_quantity}
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            Alert will be shown when stock reaches this level
          </p>
        </div>

        {/* Unit Price */}
        <div className="space-y-2">
          <Label htmlFor="unit_price">
            Unit Price (₹) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unit_price"
            name="unit_price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            defaultValue={item?.unit_price}
            required
            disabled={loading}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            type="text"
            placeholder="e.g., Warehouse A, Shelf 3"
            defaultValue={item?.location || ""}
            disabled={loading}
          />
        </div>

        {/* Status */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <select
            id="status"
            name="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={item?.status || "available"}
            required
            disabled={loading}
          >
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the item (optional)"
          rows={4}
          defaultValue={item?.description || ""}
          disabled={loading}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none"
        >
          {loading ? "Saving..." : item ? "Update Item" : "Create Item"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1 sm:flex-none"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
