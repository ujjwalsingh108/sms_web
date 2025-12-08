"use client";

import { useState } from "react";
import { LibraryBook } from "@/app/dashboard/library/actions";
import BooksFilters from "./books-filters";
import BooksTable from "./books-table";

type BooksListClientProps = {
  books: LibraryBook[];
};

export default function BooksListClient({ books }: BooksListClientProps) {
  const [filteredBooks, setFilteredBooks] = useState(books);

  return (
    <div className="space-y-4">
      <BooksFilters books={books} onFilter={setFilteredBooks} />
      <BooksTable books={filteredBooks} />
    </div>
  );
}
