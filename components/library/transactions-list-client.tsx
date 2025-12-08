"use client";

import { useState } from "react";
import { LibraryTransaction } from "@/app/dashboard/library/actions";
import TransactionsFilters from "./transactions-filters";
import TransactionsTable from "./transactions-table";

type TransactionsListClientProps = {
  transactions: LibraryTransaction[];
};

export default function TransactionsListClient({
  transactions,
}: TransactionsListClientProps) {
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  return (
    <div className="space-y-4">
      <TransactionsFilters
        transactions={transactions}
        onFilter={setFilteredTransactions}
      />
      <TransactionsTable transactions={filteredTransactions} />
    </div>
  );
}
