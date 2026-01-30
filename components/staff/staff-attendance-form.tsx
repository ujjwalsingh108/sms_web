"use client";

import { useState, useEffect } from "react";
import {
  markStaffAttendance,
  getStaff,
  type Staff,
} from "@/app/dashboard/staff/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type StaffAttendanceFormProps = {
  onSuccess?: () => void;
};

export default function StaffAttendanceForm({
  onSuccess,
}: StaffAttendanceFormProps) {
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  async function loadStaff() {
    try {
      const data = await getStaff({ status: "active" });
      setStaffList(data);
    } catch (error) {
      console.error("Failed to load staff:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await markStaffAttendance(formData);
      onSuccess?.();
      e.currentTarget.reset();
      setSelectedStaff("");
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      toast.error("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="staff_id" className="text-xs sm:text-sm">
          Staff Member <span className="text-red-500">*</span>
        </Label>
        <Select
          name="staff_id"
          value={selectedStaff}
          onValueChange={setSelectedStaff}
          required
        >
          <SelectTrigger id="staff_id" className="text-sm">
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            {staffList.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.first_name} {staff.last_name} ({staff.employee_id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-xs sm:text-sm">
          Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-xs sm:text-sm">
          Status <span className="text-red-500">*</span>
        </Label>
        <Select name="status" defaultValue="present" required>
          <SelectTrigger id="status" className="text-sm">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="half_day">Half Day</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="check_in" className="text-xs sm:text-sm">
            Check In Time
          </Label>
          <Input
            id="check_in"
            name="check_in"
            type="time"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="check_out" className="text-xs sm:text-sm">
            Check Out Time
          </Label>
          <Input
            id="check_out"
            name="check_out"
            type="time"
            className="text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-xs sm:text-sm">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          className="text-sm resize-none"
          placeholder="Add any notes or remarks"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Mark Attendance
      </Button>
    </form>
  );
}
