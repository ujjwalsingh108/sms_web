"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LibraryBook } from "@/app/dashboard/library/actions";
import { Search } from "lucide-react";

type BooksFiltersProps = {
  books: LibraryBook[];
  onFilter: (filtered: LibraryBook[]) => void;
};

export default function BooksFilters({ books, onFilter }: BooksFiltersProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleFilterChange = (
    searchValue: string,
    status: string,
    category: string
  ) => {
    let filtered = books;

    if (searchValue) {
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchValue.toLowerCase()) ||
          book.isbn?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((book) => book.status === status);
    }

    if (category !== "all") {
      filtered = filtered.filter((book) => book.category === category);
    }

    onFilter(filtered);
  };

  const categories = Array.from(
    new Set(books.map((book) => book.category).filter(Boolean))
  );

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by title, author, or ISBN..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange(e.target.value, statusFilter, categoryFilter);
            }}
          />
        </div>
      </div>

      <div className="w-full md:w-48">
        <Label>Status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            handleFilterChange(search, value, categoryFilter);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {categories.length > 0 && (
        <div className="w-full md:w-48">
          <Label>Category</Label>
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              handleFilterChange(search, statusFilter, value);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category as string}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
