"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { deleteCategory } from "@/app/dashboard/inventory/actions";
import { useRouter } from "next/navigation";
import type { InventoryCategory } from "@/app/dashboard/inventory/actions";

interface CategoriesTableProps {
  categories: InventoryCategory[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    const result = await deleteCategory(id);
    setDeletingId(null);

    if (!result.success) {
      alert(result.error || "Failed to delete category");
    } else {
      router.refresh();
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No categories found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first category to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toggle Descriptions (Mobile) */}
      <div className="md:hidden flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDescriptions(!showDescriptions)}
        >
          {showDescriptions ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Descriptions
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Descriptions
            </>
          )}
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Description
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900">{category.name}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-600 text-sm">
                    {category.description || "—"}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/inventory/categories/${category.id}/edit`}
                    >
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deletingId === category.id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deletingId === category.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {category.name}
              </h3>
              {showDescriptions && category.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Link
                href={`/dashboard/inventory/categories/${category.id}/edit`}
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
                onClick={() => handleDelete(category.id, category.name)}
                disabled={deletingId === category.id}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deletingId === category.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
