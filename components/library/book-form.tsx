"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LibraryBook,
  createLibraryBook,
  updateLibraryBook,
} from "@/app/dashboard/library/actions";
import { ArrowLeft, BookOpen, DollarSign, Package, Save } from "lucide-react";
import Link from "next/link";

type BookFormProps = {
  book?: LibraryBook;
};

export default function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (book) {
        await updateLibraryBook(book.id, formData);
      } else {
        await createLibraryBook(formData);
      }
      router.push("/dashboard/library/books");
      router.refresh();
    } catch (error) {
      console.error("Error saving book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Book Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={book?.title}
                  required
                  placeholder="Enter book title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={book?.author || ""}
                  placeholder="Enter author name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  defaultValue={book?.isbn || ""}
                  placeholder="Enter ISBN number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input
                  id="publisher"
                  name="publisher"
                  defaultValue={book?.publisher || ""}
                  placeholder="Enter publisher name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={book?.category || ""}
                  placeholder="e.g., Fiction, Science, History"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rack_number">Rack Number</Label>
                <Input
                  id="rack_number"
                  name="rack_number"
                  defaultValue={book?.rack_number || ""}
                  placeholder="Enter rack location"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Package className="h-5 w-5 text-green-500 dark:text-green-400" />
              Inventory Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="total_copies">
                  Total Copies <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="total_copies"
                  name="total_copies"
                  type="number"
                  min="1"
                  defaultValue={book?.total_copies || 1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="available_copies">
                  Available Copies <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="available_copies"
                  name="available_copies"
                  type="number"
                  min="0"
                  defaultValue={book?.available_copies || 1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={book?.price || ""}
                  placeholder="Enter book price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="status"
                  defaultValue={book?.status || "available"}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {book ? "Update Book" : "Add Book"}
              </>
            )}
          </Button>
          <Link href="/dashboard/library/books" className="flex-1">
            <Button type="button" variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </form>
  );
}
