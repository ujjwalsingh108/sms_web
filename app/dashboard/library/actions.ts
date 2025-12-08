"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// TypeScript Types
export type LibraryBook = {
  id: string;
  tenant_id: string;
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  category: string | null;
  total_copies: number;
  available_copies: number;
  rack_number: string | null;
  price: number | null;
  status: "available" | "unavailable" | "damaged" | "lost";
  created_at: string;
};

export type LibraryTransaction = {
  id: string;
  tenant_id: string;
  book_id: string;
  student_id: string | null;
  staff_id: string | null;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  fine_amount: number;
  status: "issued" | "returned" | "overdue" | "lost";
  remarks: string | null;
  issued_by: string | null;
  created_at: string;
  book?: LibraryBook;
  student?: any;
  staff?: any;
};

// =====================================================
// LIBRARY BOOKS OPERATIONS
// =====================================================

export async function getLibraryBooks() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: books, error } = await supabaseAny
      .from("library_books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: books as LibraryBook[] };
  } catch (error) {
    console.error("Error fetching library books:", error);
    return { success: false, error: "Failed to fetch library books" };
  }
}

export async function getLibraryBookById(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: book, error } = await supabaseAny
      .from("library_books")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: book as LibraryBook };
  } catch (error) {
    console.error("Error fetching library book:", error);
    return { success: false, error: "Failed to fetch library book" };
  }
}

export async function createLibraryBook(formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const bookData = {
      isbn: formData.get("isbn") as string,
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      publisher: formData.get("publisher") as string,
      category: formData.get("category") as string,
      total_copies: parseInt(formData.get("total_copies") as string) || 1,
      available_copies:
        parseInt(formData.get("available_copies") as string) || 1,
      rack_number: formData.get("rack_number") as string,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : null,
      status: (formData.get("status") as string) || "available",
    };

    const { error } = await supabaseAny.from("library_books").insert(bookData);

    if (error) throw error;

    revalidatePath("/dashboard/library");
    return { success: true };
  } catch (error) {
    console.error("Error creating library book:", error);
    return { success: false, error: "Failed to create library book" };
  }
}

export async function updateLibraryBook(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const bookData = {
      isbn: formData.get("isbn") as string,
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      publisher: formData.get("publisher") as string,
      category: formData.get("category") as string,
      total_copies: parseInt(formData.get("total_copies") as string) || 1,
      available_copies:
        parseInt(formData.get("available_copies") as string) || 1,
      rack_number: formData.get("rack_number") as string,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : null,
      status: formData.get("status") as string,
    };

    const { error } = await supabaseAny
      .from("library_books")
      .update(bookData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/library");
    revalidatePath(`/dashboard/library/books/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating library book:", error);
    return { success: false, error: "Failed to update library book" };
  }
}

export async function deleteLibraryBook(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { error } = await supabaseAny
      .from("library_books")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/library");
    return { success: true };
  } catch (error) {
    console.error("Error deleting library book:", error);
    return { success: false, error: "Failed to delete library book" };
  }
}

// =====================================================
// LIBRARY TRANSACTIONS OPERATIONS
// =====================================================

export async function getLibraryTransactions() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: transactions, error } = await supabaseAny
      .from("library_transactions")
      .select(
        `
        *,
        book:library_books(*),
        student:students(id, first_name, last_name, admission_no),
        staff:staff(id, first_name, last_name, employee_id)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: transactions as LibraryTransaction[] };
  } catch (error) {
    console.error("Error fetching library transactions:", error);
    return { success: false, error: "Failed to fetch library transactions" };
  }
}

export async function getLibraryTransactionById(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: transaction, error } = await supabaseAny
      .from("library_transactions")
      .select(
        `
        *,
        book:library_books(*),
        student:students(id, first_name, last_name, admission_no),
        staff:staff(id, first_name, last_name, employee_id)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: transaction as LibraryTransaction };
  } catch (error) {
    console.error("Error fetching library transaction:", error);
    return { success: false, error: "Failed to fetch library transaction" };
  }
}

export async function issueBook(formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const bookId = formData.get("book_id") as string;
    const studentId = (formData.get("student_id") as string) || null;
    const staffId = (formData.get("staff_id") as string) || null;
    const dueDate = formData.get("due_date") as string;

    // Check if book is available
    const { data: book, error: bookError } = await supabaseAny
      .from("library_books")
      .select("available_copies")
      .eq("id", bookId)
      .single();

    if (bookError) throw bookError;
    if (!book || book.available_copies <= 0) {
      return { success: false, error: "Book not available" };
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Create transaction
    const transactionData = {
      book_id: bookId,
      student_id: studentId,
      staff_id: staffId,
      issue_date: new Date().toISOString().split("T")[0],
      due_date: dueDate,
      status: "issued",
      issued_by: user?.id,
    };

    const { error: transactionError } = await supabaseAny
      .from("library_transactions")
      .insert(transactionData);

    if (transactionError) throw transactionError;

    // Update book available copies
    const { error: updateError } = await supabaseAny
      .from("library_books")
      .update({ available_copies: book.available_copies - 1 })
      .eq("id", bookId);

    if (updateError) throw updateError;

    revalidatePath("/dashboard/library");
    return { success: true };
  } catch (error) {
    console.error("Error issuing book:", error);
    return { success: false, error: "Failed to issue book" };
  }
}

export async function returnBook(transactionId: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const fineAmount = formData.get("fine_amount")
      ? parseFloat(formData.get("fine_amount") as string)
      : 0;
    const remarks = (formData.get("remarks") as string) || null;

    // Get transaction
    const { data: transaction, error: transError } = await supabaseAny
      .from("library_transactions")
      .select("book_id")
      .eq("id", transactionId)
      .single();

    if (transError) throw transError;

    // Update transaction
    const updateData = {
      return_date: new Date().toISOString().split("T")[0],
      fine_amount: fineAmount,
      status: "returned",
      remarks: remarks,
    };

    const { error: updateError } = await supabaseAny
      .from("library_transactions")
      .update(updateData)
      .eq("id", transactionId);

    if (updateError) throw updateError;

    // Update book available copies
    const { data: book, error: bookError } = await supabaseAny
      .from("library_books")
      .select("available_copies")
      .eq("id", transaction.book_id)
      .single();

    if (bookError) throw bookError;

    const { error: updateBookError } = await supabaseAny
      .from("library_books")
      .update({ available_copies: book.available_copies + 1 })
      .eq("id", transaction.book_id);

    if (updateBookError) throw updateBookError;

    revalidatePath("/dashboard/library");
    return { success: true };
  } catch (error) {
    console.error("Error returning book:", error);
    return { success: false, error: "Failed to return book" };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { error } = await supabaseAny
      .from("library_transactions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/library");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: "Failed to delete transaction" };
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export async function getLibraryStats() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: books } = await supabaseAny
      .from("library_books")
      .select("total_copies, available_copies, status");

    const { data: transactions } = await supabaseAny
      .from("library_transactions")
      .select("status");

    const totalBooks =
      books?.reduce(
        (sum: number, book: any) => sum + (book.total_copies || 0),
        0
      ) || 0;
    const availableBooks =
      books?.reduce(
        (sum: number, book: any) => sum + (book.available_copies || 0),
        0
      ) || 0;
    const issuedBooks =
      transactions?.filter((t: any) => t.status === "issued").length || 0;
    const overdueBooks =
      transactions?.filter((t: any) => t.status === "overdue").length || 0;

    return {
      success: true,
      data: {
        totalBooks,
        availableBooks,
        issuedBooks,
        overdueBooks,
      },
    };
  } catch (error) {
    console.error("Error fetching library stats:", error);
    return { success: false, error: "Failed to fetch library stats" };
  }
}

export async function getStudents() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: students, error } = await supabaseAny
      .from("students")
      .select("id, first_name, last_name, admission_no")
      .eq("status", "active")
      .order("first_name");

    if (error) throw error;

    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, error: "Failed to fetch students" };
  }
}

export async function getStaff() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: staff, error } = await supabaseAny
      .from("staff")
      .select("id, first_name, last_name, employee_id")
      .eq("status", "active")
      .order("first_name");

    if (error) throw error;

    return { success: true, data: staff };
  } catch (error) {
    console.error("Error fetching staff:", error);
    return { success: false, error: "Failed to fetch staff" };
  }
}
