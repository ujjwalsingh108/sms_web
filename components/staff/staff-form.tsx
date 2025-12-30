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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  DollarSign,
  Save,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type StaffFormProps = {
  staff?: Staff;
  mode?: "create" | "edit";
};

export default function StaffForm({ staff, mode = "create" }: StaffFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    staff?.photo_url || null
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhotoPreview(null);
    const fileInput = document.getElementById("photo") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

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
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="h-5 w-5 text-blue-500" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo and Form Fields Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6">
            {/* Left side - Form Fields */}
            <div className="space-y-4 order-2 lg:order-1">
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

                {mode === "create" && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs sm:text-sm">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="text-sm"
                      placeholder="Enter secure password"
                      minLength={8}
                    />
                    <p className="text-xs text-gray-500">
                      Minimum 8 characters required
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="grid gap-4 grid-cols-4">
                  <div className="space-y-2 col-span-1">
                    <Label htmlFor="salutation" className="text-xs sm:text-sm">
                      Salutation
                    </Label>
                    <Select
                      name="salutation"
                      defaultValue={staff?.salutation || ""}
                    >
                      <SelectTrigger id="salutation" className="text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Miss">Miss</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-3">
                    <Label htmlFor="first_name" className="text-xs sm:text-sm">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      defaultValue={staff?.first_name}
                      required
                      className="text-sm"
                      placeholder="Rajesh"
                    />
                  </div>
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
                    placeholder="Sharma"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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
                <Label
                  htmlFor="address"
                  className="text-xs sm:text-sm flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-gray-500" />
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

            {/* Right side - Photo Upload */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="space-y-2 w-full sm:w-auto flex flex-col items-center">
                <Label
                  htmlFor="photo"
                  className="text-xs sm:text-sm block text-center"
                >
                  Photo
                </Label>
                <div className="relative">
                  {photoPreview ? (
                    <div className="relative group">
                      <Image
                        src={photoPreview}
                        alt="Staff photo"
                        width={120}
                        height={160}
                        className="rounded-lg object-cover border-2 border-blue-200 shadow-md w-full sm:w-[120px] h-auto sm:h-[160px] max-w-[200px] sm:max-w-none"
                      />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <label
                        htmlFor="photo"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg flex items-center justify-center"
                      >
                        <Upload className="h-6 w-6 text-white" />
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full sm:w-[120px] h-[160px] sm:h-[160px] max-w-[200px] sm:max-w-none border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                    >
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs text-gray-500 mt-2 text-center px-2">
                        Upload Photo
                      </span>
                    </label>
                  )}
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                <p className="text-[10px] text-gray-500 text-center max-w-[120px]">
                  Max 5MB
                  <br />
                  JPG, PNG
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Briefcase className="h-5 w-5 text-green-500" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="space-y-2">
              <Label htmlFor="staff_type" className="text-xs sm:text-sm">
                Staff Type
              </Label>
              <Select
                name="staff_type"
                defaultValue={staff?.staff_type || "teacher"}
              >
                <SelectTrigger id="staff_type" className="text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="vice_principal">Vice Principal</SelectItem>
                  <SelectItem value="clerk">Clerk</SelectItem>
                  <SelectItem value="librarian">Librarian</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="lab_assistant">Lab Assistant</SelectItem>
                  <SelectItem value="sports_coach">Sports Coach</SelectItem>
                  <SelectItem value="counselor">Counselor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {mode === "edit" ? "Update Staff" : "Add Staff"}
        </Button>
        <Link
          href={staff ? `/dashboard/staff/${staff.id}` : "/dashboard/staff"}
          className="flex-1"
        >
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            className="w-full"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
