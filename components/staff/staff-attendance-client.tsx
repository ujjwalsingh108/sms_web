"use client";

import { useEffect, useState } from "react";
import { getStaffAttendance, getStaff } from "@/app/dashboard/staff/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import StaffAttendanceFilters from "@/components/staff/staff-attendance-filters";
import StaffAttendanceTable from "@/components/staff/staff-attendance-table";
import StaffAttendanceForm from "@/components/staff/staff-attendance-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type StaffAttendanceClientProps = {
  filters?: {
    staffId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  };
};

export default function StaffAttendanceClient({
  filters,
}: StaffAttendanceClientProps) {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, [filters]);

  async function loadAttendance() {
    try {
      setLoading(true);
      const data = await getStaffAttendance(filters);
      setAttendance(data);
    } catch (error) {
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    setDialogOpen(false);
    loadAttendance();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Attendance Records
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                View and manage staff attendance
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Mark Staff Attendance</DialogTitle>
                  <DialogDescription>
                    Record attendance for a staff member
                  </DialogDescription>
                </DialogHeader>
                <StaffAttendanceForm onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <StaffAttendanceFilters />
          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">Loading attendance...</div>
            ) : (
              <StaffAttendanceTable attendance={attendance} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
