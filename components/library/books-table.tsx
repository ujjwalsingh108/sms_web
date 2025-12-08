"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  LibraryBook,
  deleteLibraryBook,
} from "@/app/dashboard/library/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BooksTableProps = {
  books: LibraryBook[];
};

export default function BooksTable({ books }: BooksTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteLibraryBook(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "unavailable":
        return "bg-gray-500";
      case "damaged":
        return "bg-orange-500";
      case "lost":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {books.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No books found
          </div>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="border rounded-lg p-4 space-y-3 bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <p className="font-semibold text-base">{book.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {book.author || "Unknown Author"}
                  </p>
                </div>
                <Badge className={getStatusColor(book.status)}>
                  {book.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">ISBN:</span>
                  <span className="ml-1 font-medium">{book.isbn || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-1 font-medium">
                    {book.category || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <span className="ml-1 font-medium">
                    {book.available_copies}/{book.total_copies}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Rack:</span>
                  <span className="ml-1 font-medium">
                    {book.rack_number || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link href={`/dashboard/library/books/${book.id}`}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link href={`/dashboard/library/books/${book.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(book.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  ISBN
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">
                  Rack
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Available
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No books found
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {book.title}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {book.author || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {book.isbn || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {book.category || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">
                      {book.rack_number || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {book.available_copies}/{book.total_copies}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(book.status)}>
                        {book.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/dashboard/library/books/${book.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" asChild>
                          <Link
                            href={`/dashboard/library/books/${book.id}/edit`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(book.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              book from the library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
