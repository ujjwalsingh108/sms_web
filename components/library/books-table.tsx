"use client";

import { Database } from "@/lib/supabase/database.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit, BookOpen } from "lucide-react";
import Link from "next/link";

type LibraryBook = Database["public"]["Tables"]["library_books"]["Row"];

interface LibraryBooksTableProps {
  books: LibraryBook[];
}

export function LibraryBooksTable({ books }: LibraryBooksTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Total Copies</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Rack No</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No books found. Add your first book to get started.
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{book.category}</Badge>
                </TableCell>
                <TableCell>{book.total_copies}</TableCell>
                <TableCell>
                  <span
                    className={
                      book.available_copies > 0
                        ? "text-green-600 font-semibold"
                        : "text-red-600"
                    }
                  >
                    {book.available_copies}
                  </span>
                </TableCell>
                <TableCell>{book.rack_no || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/library/${book.id}`}>
                      <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/library/${book.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit Book">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/library/issue?book=${book.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Issue Book"
                        disabled={book.available_copies === 0}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
