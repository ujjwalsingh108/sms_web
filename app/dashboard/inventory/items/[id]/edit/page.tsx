import { getItemById, getCategories } from "../../../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory/items">
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Item
            </h1>
            <p className="text-muted-foreground mt-1">Update item details and stock levels</p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Package className="h-5 w-5" />
              {item.item_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ItemForm item={item} categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
