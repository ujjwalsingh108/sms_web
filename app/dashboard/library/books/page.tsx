import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getLibraryBooks } from "../actions";
import BooksListClient from "@/components/library/books-list-client";

export default async function LibraryBooksPage() {
  const booksResult = await getLibraryBooks();
  const books = booksResult.success ? booksResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books Catalog</h1>
          <p className="text-muted-foreground">Manage all library books</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/library/books/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      <BooksListClient books={books || []} />
    </div>
  );
}
