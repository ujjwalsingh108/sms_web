"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  createCategory,
  updateCategory,
} from "@/app/dashboard/inventory/actions";
import type { InventoryCategory } from "@/app/dashboard/inventory/actions";

interface CategoryFormProps {
  category?: InventoryCategory;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const result = category
      ? await updateCategory(category.id, data)
      : await createCategory(data);

    setLoading(false);

    if (result.success) {
      router.push("/dashboard/inventory/categories");
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

      <div className="space-y-2">
        <Label htmlFor="name">
          Category Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Stationery, Electronics"
          defaultValue={category?.name}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of this category (optional)"
          rows={4}
          defaultValue={category?.description || ""}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none"
        >
          {loading
            ? "Saving..."
            : category
            ? "Update Category"
            : "Create Category"}
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
