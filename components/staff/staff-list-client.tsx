"use client";

import { useEffect, useState } from "react";
import {
  getStaff,
  deleteStaff,
  type Staff,
} from "@/app/dashboard/staff/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import StaffFilters from "@/components/staff/staff-filters";
import StaffTable from "@/components/staff/staff-table";

type StaffListClientProps = {
  filters?: {
    department?: string;
    designation?: string;
    status?: string;
    search?: string;
  };
};

export default function StaffListClient({ filters }: StaffListClientProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, [filters]);

  async function loadStaff() {
    try {
      setLoading(true);
      const data = await getStaff(filters);
      setStaff(data);
    } catch (error) {
      console.error("Failed to load staff:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      await deleteStaff(id);
      await loadStaff();
    } catch (error) {
      console.error("Failed to delete staff:", error);
      alert("Failed to delete staff member");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Staff Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your school staff members
          </p>
        </div>
        <Link href="/dashboard/staff/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Staff List</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            View and manage all staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffFilters />
          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">Loading staff...</div>
            ) : (
              <StaffTable staff={staff} onDelete={handleDelete} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
