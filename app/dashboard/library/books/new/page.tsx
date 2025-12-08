import BookForm from "@/components/library/book-form";

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Book</h1>
        <p className="text-muted-foreground">
          Add a new book to the library catalog
        </p>
      </div>

      <BookForm />
    </div>
  );
}
