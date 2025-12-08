"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { issueBook, LibraryBook } from "@/app/dashboard/library/actions";
import { ArrowLeft } from "lucide-react";

type IssueBookFormProps = {
  books: LibraryBook[];
  students: any[];
  staff: any[];
};

export default function IssueBookForm({
  books,
  students,
  staff,
}: IssueBookFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [borrowerType, setBorrowerType] = useState<"student" | "staff">(
    "student"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await issueBook(formData);
      router.push("/dashboard/library/transactions");
      router.refresh();
    } catch (error) {
      console.error("Error issuing book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableBooks = books.filter((book) => book.available_copies > 0);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="book_id">
              Select Book <span className="text-red-500">*</span>
            </Label>
            <Select name="book_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a book" />
              </SelectTrigger>
              <SelectContent>
                {availableBooks.length === 0 ? (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    No books available
                  </div>
                ) : (
                  availableBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} ({book.available_copies} available)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Borrower Type <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="borrower_type"
                  value="student"
                  checked={borrowerType === "student"}
                  onChange={() => setBorrowerType("student")}
                  className="h-4 w-4"
                />
                <span>Student</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="borrower_type"
                  value="staff"
                  checked={borrowerType === "staff"}
                  onChange={() => setBorrowerType("staff")}
                  className="h-4 w-4"
                />
                <span>Staff</span>
              </label>
            </div>
          </div>

          {borrowerType === "student" ? (
            <div className="space-y-2">
              <Label htmlFor="student_id">
                Select Student <span className="text-red-500">*</span>
              </Label>
              <Select name="student_id" required={borrowerType === "student"}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.length === 0 ? (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No active students
                    </div>
                  ) : (
                    students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name} (
                        {student.admission_no})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="staff_id">
                Select Staff <span className="text-red-500">*</span>
              </Label>
              <Select name="staff_id" required={borrowerType === "staff"}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.length === 0 ? (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No active staff
                    </div>
                  ) : (
                    staff.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name} (
                        {member.employee_id})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="due_date">
              Due Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
            />
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
              {isLoading ? "Issuing..." : "Issue Book"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
