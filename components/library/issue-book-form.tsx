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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { issueBook, LibraryBook } from "@/app/dashboard/library/actions";
import { ArrowLeft, BookOpen, User, Calendar, Save } from "lucide-react";
import Link from "next/link";

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
      <div className="space-y-6">
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Book Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <User className="h-5 w-5 text-green-500 dark:text-green-400" />
              Borrower Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              Return Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              "Issuing..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Issue Book
              </>
            )}
          </Button>
          <Link href="/dashboard/library/transactions" className="flex-1">
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
