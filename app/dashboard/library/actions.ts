"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentTenant } from "@/lib/helpers/tenant";

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

export type LibraryReport = {
  id: string;
  tenant_id: string;
  report_name: string;
  report_type:
    | "books_inventory"
    | "issued_books"
    | "overdue_books"
    | "returned_books"
    | "student_history"
    | "popular_books"
    | "fine_collection"
    | "monthly_summary"
    | "annual_summary";
  description: string | null;
  date_from: string | null;
  date_to: string | null;
  filters: Record<string, any>;
  generated_by: string | null;
  generated_at: string | null;
  file_url: string | null;
  status: "draft" | "generating" | "completed" | "failed";
  created_at: string;
  updated_at: string;
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

    // Get the current user's tenant
    const tenant = await getCurrentTenant();

    if (!tenant) {
      console.error("No tenant found for user");
      return { success: false, error: "Unable to determine tenant" };
    }

    console.log("User tenant:", tenant.tenant_id);

    // Helper function to get form value with or without prefix
    const getFormValue = (key: string): string | null => {
      let value = formData.get(key);
      if (!value) {
        // Try with "1_" prefix
        value = formData.get(`1_${key}`);
      }
      return value as string | null;
    };

    const parseIntOrDefault = (val: string | null, defaultValue: number) => {
      const n = val == null ? NaN : parseInt(String(val), 10);
      return Number.isFinite(n) ? n : defaultValue;
    };

    const bookData = {
      tenant_id: tenant.tenant_id,
      isbn: getFormValue("isbn"),
      title: getFormValue("title"),
      author: getFormValue("author"),
      publisher: getFormValue("publisher"),
      category: getFormValue("category"),
      total_copies: parseInt(getFormValue("total_copies") || "1") || 1,
      available_copies: parseIntOrDefault(getFormValue("available_copies"), 1),
      rack_number: getFormValue("rack_number"),
      price: getFormValue("price")
        ? parseFloat(getFormValue("price") as string)
        : null,
      status: getFormValue("status") || "available",
    };

    console.log("Inserting book data:", bookData);

    const { error, data } = await supabaseAny
      .from("library_books")
      .insert(bookData)
      .select();

    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }

    console.log("Book created successfully:", data);

    revalidatePath("/dashboard/library");
    revalidatePath("/dashboard/library/books");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating library book:", error);
    return {
      success: false,
      error: error?.message || "Failed to create library book",
    };
  }
}

export async function updateLibraryBook(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const parseIntOrDefault = (val: any, defaultValue: number) => {
      const s = val == null ? null : String(val);
      const n = s == null ? NaN : parseInt(s, 10);
      return Number.isFinite(n) ? n : defaultValue;
    };

    const bookData = {
      isbn: formData.get("isbn") as string,
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      publisher: formData.get("publisher") as string,
      category: formData.get("category") as string,
      total_copies: parseIntOrDefault(formData.get("total_copies"), 1),
      available_copies: parseIntOrDefault(formData.get("available_copies"), 1),
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
      .eq("is_deleted", false)
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

    // Get the current user's tenant
    const tenant = await getCurrentTenant();

    if (!tenant) {
      console.error("No tenant found for user");
      return { success: false, error: "Unable to determine tenant" };
    }

    const bookId = formData.get("book_id") as string;
    const studentId = (formData.get("student_id") as string) || null;
    const staffId = (formData.get("staff_id") as string) || null;
    const dueDate = formData.get("due_date") as string;
    const remarks = (formData.get("remarks") as string) || null;

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
      tenant_id: tenant.tenant_id,
      book_id: bookId,
      student_id: studentId,
      staff_id: staffId,
      issue_date: new Date().toISOString().split("T")[0],
      due_date: dueDate,
      status: "issued",
      remarks: remarks,
      issued_by: user?.id,
    };

    const { error: transactionError } = await supabaseAny
      .from("library_transactions")
      .insert(transactionData);

    if (transactionError) {
      console.error("Transaction insert error:", transactionError);
      throw transactionError;
    }

    // Update book available copies
    const { error: updateError } = await supabaseAny
      .from("library_books")
      .update({ available_copies: book.available_copies - 1 })
      .eq("id", bookId);

    if (updateError) throw updateError;

    revalidatePath("/dashboard/library");
    revalidatePath("/dashboard/library/transactions");
    return { success: true };
  } catch (error: any) {
    console.error("Error issuing book:", error);
    return {
      success: false,
      error: error?.message || "Failed to issue book",
    };
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
      .select("book_id, status")
      .eq("id", transactionId)
      .single();

    if (transError) throw transError;

    if (transaction.status === "returned") {
      return { success: false, error: "Book already returned" };
    }

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
    revalidatePath("/dashboard/library/transactions");
    return { success: true };
  } catch (error: any) {
    console.error("Error returning book:", error);
    return {
      success: false,
      error: error?.message || "Failed to return book",
    };
  }
}

export async function updateTransaction(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const updateData: any = {};

    const dueDate = formData.get("due_date") as string;
    const returnDate = formData.get("return_date") as string;
    const fineAmount = formData.get("fine_amount") as string;
    const status = formData.get("status") as string;
    const remarks = formData.get("remarks") as string;

    if (dueDate) updateData.due_date = dueDate;
    if (returnDate) updateData.return_date = returnDate;
    if (fineAmount) updateData.fine_amount = parseFloat(fineAmount);
    if (status) updateData.status = status;
    if (remarks !== undefined) updateData.remarks = remarks || null;

    const { error } = await supabaseAny
      .from("library_transactions")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/library");
    revalidatePath("/dashboard/library/transactions");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    return {
      success: false,
      error: error?.message || "Failed to update transaction",
    };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get transaction to check if book needs to be returned first
    const { data: transaction, error: fetchError } = await supabaseAny
      .from("library_transactions")
      .select("book_id, status")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // If the book is still issued, increment available copies
    if (transaction.status === "issued" || transaction.status === "overdue") {
      const { data: book, error: bookError } = await supabaseAny
        .from("library_books")
        .select("available_copies")
        .eq("id", transaction.book_id)
        .single();

      if (!bookError && book) {
        await supabaseAny
          .from("library_books")
          .update({ available_copies: book.available_copies + 1 })
          .eq("id", transaction.book_id);
      }
    }

    // Soft delete the transaction
    const { error } = await supabaseAny
      .from("library_transactions")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/library");
    revalidatePath("/dashboard/library/transactions");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    return {
      success: false,
      error: error?.message || "Failed to delete transaction",
    };
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

// =====================================================
// LIBRARY REPORTS OPERATIONS
// =====================================================

export async function getLibraryReports() {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: reports, error } = await supabaseAny
      .from("library_reports")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: reports as LibraryReport[] };
  } catch (error) {
    console.error("Error fetching library reports:", error);
    return { success: false, error: "Failed to fetch library reports" };
  }
}

export async function getLibraryReportById(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const { data: report, error } = await supabaseAny
      .from("library_reports")
      .select("*")
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    if (error) throw error;

    return { success: true, data: report as LibraryReport };
  } catch (error) {
    console.error("Error fetching library report:", error);
    return { success: false, error: "Failed to fetch library report" };
  }
}

export async function createLibraryReport(formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const tenant = await getCurrentTenant();

    if (!tenant) {
      return { success: false, error: "Unable to determine tenant" };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const reportData = {
      tenant_id: tenant.tenant_id,
      report_name: formData.get("report_name") as string,
      report_type: formData.get("report_type") as string,
      description: (formData.get("description") as string) || null,
      date_from: (formData.get("date_from") as string) || null,
      date_to: (formData.get("date_to") as string) || null,
      filters: JSON.parse((formData.get("filters") as string) || "{}"),
      status: "draft",
      generated_by: user?.id,
    };

    const { error, data } = await supabaseAny
      .from("library_reports")
      .insert(reportData)
      .select();

    if (error) {
      console.error("Database insert error:", error);
      throw error;
    }

    revalidatePath("/dashboard/library/reports");
    return { success: true, data: data[0] };
  } catch (error: any) {
    console.error("Error creating library report:", error);
    return {
      success: false,
      error: error?.message || "Failed to create library report",
    };
  }
}

export async function updateLibraryReport(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const reportData: any = {
      report_name: formData.get("report_name") as string,
      report_type: formData.get("report_type") as string,
      description: (formData.get("description") as string) || null,
      date_from: (formData.get("date_from") as string) || null,
      date_to: (formData.get("date_to") as string) || null,
      filters: JSON.parse((formData.get("filters") as string) || "{}"),
      updated_at: new Date().toISOString(),
    };

    const status = formData.get("status") as string;
    if (status) {
      reportData.status = status;
    }

    const { error } = await supabaseAny
      .from("library_reports")
      .update(reportData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/library/reports");
    revalidatePath(`/dashboard/library/reports/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating library report:", error);
    return {
      success: false,
      error: error?.message || "Failed to update library report",
    };
  }
}

export async function generateLibraryReport(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    // Get report details
    const { data: report, error: reportError } = await supabaseAny
      .from("library_reports")
      .select("*")
      .eq("id", id)
      .single();

    if (reportError) throw reportError;

    // Update status to generating
    await supabaseAny
      .from("library_reports")
      .update({ status: "generating" })
      .eq("id", id);

    // Generate report data based on report type
    let reportData: any = {};

    switch (report.report_type) {
      case "books_inventory":
        const { data: books } = await supabaseAny
          .from("library_books")
          .select("*")
          .eq("is_deleted", false);
        reportData = { books };
        break;

      case "issued_books":
        const { data: issuedBooks } = await supabaseAny
          .from("library_transactions")
          .select("*, book:library_books(*), student:students(*)")
          .eq("status", "issued")
          .eq("is_deleted", false);
        reportData = { transactions: issuedBooks };
        break;

      case "overdue_books":
        const today = new Date().toISOString().split("T")[0];
        const { data: overdueBooks } = await supabaseAny
          .from("library_transactions")
          .select("*, book:library_books(*), student:students(*)")
          .in("status", ["issued", "overdue"])
          .lt("due_date", today)
          .eq("is_deleted", false);
        reportData = { transactions: overdueBooks };
        break;

      case "returned_books":
        const { data: returnedBooks } = await supabaseAny
          .from("library_transactions")
          .select("*, book:library_books(*), student:students(*)")
          .eq("status", "returned")
          .gte("return_date", report.date_from || "1900-01-01")
          .lte("return_date", report.date_to || "2100-12-31")
          .eq("is_deleted", false);
        reportData = { transactions: returnedBooks };
        break;

      case "fine_collection":
        const { data: fines } = await supabaseAny
          .from("library_transactions")
          .select("*, book:library_books(*), student:students(*)")
          .gt("fine_amount", 0)
          .eq("is_deleted", false);
        reportData = { transactions: fines };
        break;

      default:
        reportData = { message: "Report type not implemented" };
    }

    // Update report status to completed
    await supabaseAny
      .from("library_reports")
      .update({
        status: "completed",
        generated_at: new Date().toISOString(),
        filters: { ...report.filters, data: reportData },
      })
      .eq("id", id);

    revalidatePath("/dashboard/library/reports");
    return { success: true, data: reportData };
  } catch (error: any) {
    console.error("Error generating library report:", error);

    // Update status to failed
    const supabase = await createClient();
    const supabaseAny: any = supabase;
    await supabaseAny
      .from("library_reports")
      .update({ status: "failed" })
      .eq("id", id);

    return {
      success: false,
      error: error?.message || "Failed to generate library report",
    };
  }
}

export async function deleteLibraryReport(id: string) {
  try {
    const supabase = await createClient();
    const supabaseAny: any = supabase;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabaseAny
      .from("library_reports")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/library/reports");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting library report:", error);
    return {
      success: false,
      error: error?.message || "Failed to delete library report",
    };
  }
}
