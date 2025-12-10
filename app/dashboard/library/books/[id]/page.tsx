import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, BookOpen } from "lucide-react";
import Link from "next/link";
import { getLibraryBookById } from "../../actions";
import DeleteBookButton from "@/components/library/delete-book-button";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const bookResult = await getLibraryBookById(resolvedParams.id);

  if (!bookResult.success || !bookResult.data) {
    notFound();
  }

  const book = bookResult.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "unavailable":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800/50 dark:to-slate-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700";
      case "damaged":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 dark:from-orange-900/30 dark:to-amber-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "lost":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-800/50 dark:to-slate-800/50 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-white/50 dark:hover:bg-gray-800/50"
              >
                <Link href="/dashboard/library/books">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {book.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Book Details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all border-0"
              >
                <Link href={`/dashboard/library/books/${book.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <DeleteBookButton bookId={book.id} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  Book Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      ISBN
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {book.isbn || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Status
                    </p>
                    <Badge className={getStatusColor(book.status)}>
                      {book.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Author
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {book.author || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Publisher
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {book.publisher || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {book.category || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Rack Number
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {book.rack_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Price
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {book.price ? `₹${book.price.toFixed(2)}` : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Total Copies
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {book.total_copies}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Available Copies
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {book.available_copies}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Issued Copies
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {book.total_copies - book.available_copies}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Created At
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(book.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
