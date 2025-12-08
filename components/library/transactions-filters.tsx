"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LibraryTransaction } from "@/app/dashboard/library/actions";
import { Search } from "lucide-react";

type TransactionsFiltersProps = {
  transactions: LibraryTransaction[];
  onFilter: (filtered: LibraryTransaction[]) => void;
};

export default function TransactionsFilters({
  transactions,
  onFilter,
}: TransactionsFiltersProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleFilterChange = (searchValue: string, status: string) => {
    let filtered = transactions;

    if (searchValue) {
      filtered = filtered.filter(
        (t) =>
          t.book?.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          t.student?.admission_no
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          t.staff?.employee_id
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }

    onFilter(filtered);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by book title, student, or staff..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange(e.target.value, statusFilter);
            }}
          />
        </div>
      </div>

      <div className="w-full md:w-48">
        <Label>Status</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            handleFilterChange(search, value);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
