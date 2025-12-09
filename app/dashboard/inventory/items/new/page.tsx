import { getCategories } from "../../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import ItemForm from "@/components/inventory/item-form";

export default async function NewItemPage() {
  const categoriesResult = await getCategories();
  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Add New Item
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Create a new inventory item
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Item Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ItemForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
