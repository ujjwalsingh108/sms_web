import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { getLibraryTransactions } from "../actions";
import TransactionsListClient from "@/components/library/transactions-list-client";

export const dynamic = "force-dynamic";

export default async function LibraryTransactionsPage() {
  const transactionsResult = await getLibraryTransactions();
  const transactions = transactionsResult.success
    ? transactionsResult.data
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/library">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Book Transactions</h1>
            <p className="text-muted-foreground">
              View all book issues and returns
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/dashboard/library/issue/new">
            <Plus className="mr-2 h-4 w-4" />
            Issue Book
          </Link>
        </Button>
      </div>

      <TransactionsListClient transactions={transactions || []} />
    </div>
  );
}
