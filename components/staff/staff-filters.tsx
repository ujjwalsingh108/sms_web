"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getDepartments } from "@/app/dashboard/staff/actions";

export default function StaffFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [departments, setDepartments] = useState<string[]>([]);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [department, setDepartment] = useState(
    searchParams.get("department") || "all"
  );
  const [status, setStatus] = useState(searchParams.get("status") || "all");

  useEffect(() => {
    loadFilters();
  }, []);

  async function loadFilters() {
    const depts = await getDepartments();
    setDepartments(depts);
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (department !== "all") params.set("department", department);
    if (status !== "all") params.set("status", status);

    router.push(`/dashboard/staff?${params.toString()}`);
  }

  function clearFilters() {
    setSearch("");
    setDepartment("all");
    setStatus("all");
    router.push("/dashboard/staff");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs sm:text-sm">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Name, ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department" className="text-xs sm:text-sm">
            Department
          </Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger id="department" className="text-sm">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs sm:text-sm">
            Status
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status" className="text-sm">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={applyFilters} className="w-full sm:w-auto" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full sm:w-auto"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
