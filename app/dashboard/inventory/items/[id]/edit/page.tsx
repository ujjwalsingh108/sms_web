import { getItemById, getCategories } from "../../../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { notFound } from "next/navigation";
import ItemForm from "@/components/inventory/item-form";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [itemResult, categoriesResult] = await Promise.all([
    getItemById(id),
    getCategories(),
  ]);

  if (!itemResult.success || !itemResult.data) {
    notFound();
  }

  const item = itemResult.data;
  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Edit Item
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Update item details and stock levels
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {item.item_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ItemForm item={item} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
