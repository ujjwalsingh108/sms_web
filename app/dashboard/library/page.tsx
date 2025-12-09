import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BookCopy,
  BookCheck,
  AlertTriangle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { getLibraryStats } from "./actions";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const statsResult = await getLibraryStats();
  const stats = statsResult.success ? statsResult.data : null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Library Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage books, issues, and returns
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg"
          >
            <Link href="/dashboard/library/books/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 shadow-lg"
          >
            <Link href="/dashboard/library/issue/new">
              <Plus className="mr-2 h-4 w-4" />
              Issue Book
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Books
            </CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {stats?.totalBooks || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All copies in library
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available
            </CardTitle>
            <div className="p-2 rounded-lg success-gradient">
              <BookCopy className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {stats?.availableBooks || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ready to issue
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Issued
            </CardTitle>
            <div className="p-2 rounded-lg primary-gradient">
              <BookCheck className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {stats?.issuedBooks || 0}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Currently issued
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card-hover glass-effect border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overdue
            </CardTitle>
            <div className="p-2 rounded-lg danger-gradient">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              {stats?.overdueBooks || 0}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Books Catalog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              View and manage all library books
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/library/books">View All Books</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Issue & Return</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage book transactions
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard/library/transactions">
                View Transactions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Generate library reports
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/library/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
