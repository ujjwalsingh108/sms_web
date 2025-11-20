import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LibraryBooksTable } from "@/components/library/books-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: members } = await supabase
    .from("members")
    .select(
      `
      *,
      role:role_id(id, name, display_name),
      tenant:tenant_id(id, name, email)
    `
    )
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as { tenant_id: string } | undefined;

  if (!member) {
    redirect("/login");
  }

  // Fetch library books
  const { data: books } = await supabase
    .from("library_books")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .order("created_at", { ascending: false });

  // Fetch active transactions
  const { count: issuedCount } = await supabase
    .from("library_transactions")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", member.tenant_id)
    .eq("status", "issued");

  const { count: overdueCount } = await supabase
    .from("library_transactions")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", member.tenant_id)
    .eq("status", "overdue");

  type Book = {
    total_copies: number;
    available_copies: number;
  };

  const totalBooks =
    (books as Book[] | null)?.reduce((sum, b) => sum + b.total_copies, 0) || 0;
  const availableBooks =
    (books as Book[] | null)?.reduce((sum, b) => sum + b.available_copies, 0) ||
    0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Library Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage books and issue/return transactions
          </p>
        </div>
        <Link href="/dashboard/library/add-book" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Books
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {availableBooks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {issuedCount || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <LibraryBooksTable books={books || []} />
    </div>
  );
}
