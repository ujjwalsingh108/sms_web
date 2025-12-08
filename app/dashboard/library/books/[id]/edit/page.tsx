import { notFound } from "next/navigation";
import { getLibraryBookById } from "../../../actions";
import BookForm from "@/components/library/book-form";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Book</h1>
        <p className="text-muted-foreground">Update book information</p>
      </div>

      <BookForm book={bookResult.data} />
    </div>
  );
}
