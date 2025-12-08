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
import { Card, CardContent } from "@/components/ui/card";
import {
  LibraryBook,
  createLibraryBook,
  updateLibraryBook,
} from "@/app/dashboard/library/actions";
import { ArrowLeft } from "lucide-react";
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
      <Card>
        <CardContent className="pt-6 space-y-6">
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

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : book ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
