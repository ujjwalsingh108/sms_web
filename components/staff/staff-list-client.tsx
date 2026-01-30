"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import StaffFilters from "@/components/staff/staff-filters";
import StaffTable from "@/components/staff/staff-table";

type StaffListClientProps = {
  filters?: {
    department?: string;
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
      toast.error("Failed to delete staff member");
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
