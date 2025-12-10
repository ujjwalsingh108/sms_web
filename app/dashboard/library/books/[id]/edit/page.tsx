import { notFound } from "next/navigation";
import { getLibraryBookById } from "../../../actions";
import BookForm from "@/components/library/book-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBookPage({ params }: PageProps) {
  const resolvedParams = await params;
  const bookResult = await getLibraryBookById(resolvedParams.id);

  if (!bookResult.success || !bookResult.data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-white/50 dark:hover:bg-gray-800/50"
          >
            <Link href={`/dashboard/library/books/${resolvedParams.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Book
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Update book information
            </p>
          </div>
        </div>

        <BookForm book={bookResult.data} />
      </div>
    </div>
  );
}
