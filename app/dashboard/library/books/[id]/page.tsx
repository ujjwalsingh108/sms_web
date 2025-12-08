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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/library/books">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-muted-foreground">Book Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/library/books/${book.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeleteBookButton bookId={book.id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ISBN</p>
                <p className="font-medium">{book.isbn || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(book.status)}>
                  {book.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Author</p>
                <p className="font-medium">{book.author || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Publisher</p>
                <p className="font-medium">{book.publisher || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{book.category || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rack Number</p>
                <p className="font-medium">{book.rack_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">
                  {book.price ? `₹${book.price.toFixed(2)}` : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Copies</p>
              <p className="text-3xl font-bold">{book.total_copies}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Copies</p>
              <p className="text-3xl font-bold text-green-600">
                {book.available_copies}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issued Copies</p>
              <p className="text-3xl font-bold text-blue-600">
                {book.total_copies - book.available_copies}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
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
  );
}
