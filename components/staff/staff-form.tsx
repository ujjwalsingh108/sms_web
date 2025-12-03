"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createStaff,
  updateStaff,
  type Staff,
} from "@/app/dashboard/staff/actions";
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

type StaffFormProps = {
  staff?: Staff;
  mode?: "create" | "edit";
};

export default function StaffForm({ staff, mode = "create" }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (mode === "edit" && staff) {
        await updateStaff(staff.id, formData);
      } else {
        await createStaff(formData);
      }

      router.push("/dashboard/staff");
      router.refresh();
    } catch (error) {
      console.error("Failed to save staff:", error);
      alert("Failed to save staff member");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">
          Personal Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="employee_id" className="text-xs sm:text-sm">
              Employee ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="employee_id"
              name="employee_id"
              defaultValue={staff?.employee_id}
              required
              className="text-sm"
              placeholder="EMP001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={staff?.email}
              required
              className="text-sm"
              placeholder="staff@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-xs sm:text-sm">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              name="first_name"
              defaultValue={staff?.first_name}
              required
              className="text-sm"
              placeholder="John"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-xs sm:text-sm">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              name="last_name"
              defaultValue={staff?.last_name}
              required
              className="text-sm"
              placeholder="Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs sm:text-sm">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={staff?.phone || ""}
              className="text-sm"
              placeholder="+1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth" className="text-xs sm:text-sm">
              Date of Birth
            </Label>
            <Input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              defaultValue={staff?.date_of_birth || ""}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-xs sm:text-sm">
              Gender
            </Label>
            <Select name="gender" defaultValue={staff?.gender || ""}>
              <SelectTrigger id="gender" className="text-sm">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-xs sm:text-sm">
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            defaultValue={staff?.address || ""}
            rows={3}
            className="text-sm resize-none"
            placeholder="Enter full address"
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">
          Professional Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="designation" className="text-xs sm:text-sm">
              Designation
            </Label>
            <Input
              id="designation"
              name="designation"
              defaultValue={staff?.designation || ""}
              className="text-sm"
              placeholder="Teacher, Principal, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-xs sm:text-sm">
              Department
            </Label>
            <Input
              id="department"
              name="department"
              defaultValue={staff?.department || ""}
              className="text-sm"
              placeholder="Science, Mathematics, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualification" className="text-xs sm:text-sm">
              Qualification
            </Label>
            <Input
              id="qualification"
              name="qualification"
              defaultValue={staff?.qualification || ""}
              className="text-sm"
              placeholder="B.Ed, M.Ed, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_joining" className="text-xs sm:text-sm">
              Date of Joining
            </Label>
            <Input
              id="date_of_joining"
              name="date_of_joining"
              type="date"
              defaultValue={staff?.date_of_joining || ""}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-xs sm:text-sm">
              Salary
            </Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              step="0.01"
              defaultValue={staff?.salary || ""}
              className="text-sm"
              placeholder="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs sm:text-sm">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              name="status"
              defaultValue={staff?.status || "active"}
              required
            >
              <SelectTrigger id="status" className="text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Update Staff" : "Add Staff"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
