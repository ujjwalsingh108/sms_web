import { getCategories } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CategoriesTable from "@/components/inventory/categories-table";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categoriesResult = await getCategories();
  const categories =
    categoriesResult.success && categoriesResult.data
      ? categoriesResult.data
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/inventory">
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Item Categories
              </h1>
              <p className="text-muted-foreground mt-1">
                Organize inventory items into categories
              </p>
            </div>
          </div>
          <Link href="/dashboard/inventory/categories/new">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FolderOpen className="h-5 w-5" />
              All Categories ({categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoriesTable categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
