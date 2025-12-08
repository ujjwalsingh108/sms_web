import IssueBookForm from "@/components/library/issue-book-form";
import { getLibraryBooks, getStudents, getStaff } from "../../actions";

export default async function IssueBookPage() {
  const [booksResult, studentsResult, staffResult] = await Promise.all([
    getLibraryBooks(),
    getStudents(),
    getStaff(),
  ]);

  const books = booksResult.success ? booksResult.data : [];
  const students = studentsResult.success ? studentsResult.data : [];
  const staff = staffResult.success ? staffResult.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Issue Book</h1>
        <p className="text-muted-foreground">
          Issue a book to student or staff member
        </p>
      </div>

      <IssueBookForm
        books={books || []}
        students={students || []}
        staff={staff || []}
      />
    </div>
  );
}
