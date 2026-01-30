"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  admission_no: string;
};

type Staff = {
  id: string;
  first_name: string;
  last_name: string;
  employee_id: string;
};

export default function NewGatePassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [personType, setPersonType] = useState<"student" | "staff">("student");
  const [students, setStudents] = useState<Student[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [formData, setFormData] = useState({
    person_id: "",
    pass_type: "",
    purpose: "",
    date_of_exit: "",
    expected_return: "",
    remarks: "",
  });

  useEffect(() => {
    fetchStudentsAndStaff();
  }, []);

  const fetchStudentsAndStaff = async () => {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: members } = await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .single();

      if (!members) return;

      // Fetch students
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, first_name, last_name, admission_no")
        .eq("tenant_id", (members as { tenant_id: string }).tenant_id)
        .eq("status", "active")
        .order("first_name");

      // Fetch staff
      const { data: staffData } = await supabase
        .from("staff")
        .select("id, first_name, last_name, employee_id")
        .eq("tenant_id", (members as { tenant_id: string }).tenant_id)
        .eq("status", "active")
        .order("first_name");

      setStudents((studentsData as Student[]) || []);
      setStaffMembers((staffData as Staff[]) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to continue");
        router.push("/login");
        return;
      }

      const { data: members } = await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .single();

      if (!members) {
        toast.error("No active tenant found");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("gate_passes") as any).insert([
        {
          tenant_id: (members as { tenant_id: string }).tenant_id,
          student_id: personType === "student" ? formData.person_id : null,
          staff_id: personType === "staff" ? formData.person_id : null,
          pass_type: formData.pass_type,
          purpose: formData.purpose,
          date_of_exit: formData.date_of_exit,
          expected_return: formData.expected_return,
          remarks: formData.remarks || null,
          status: "pending",
        },
      ]);

      if (error) throw error;

      toast.success("Gate pass created successfully");
      router.push("/dashboard/security/gate-passes");
      router.refresh();
    } catch (error) {
      console.error("Error creating gate pass:", error);
      toast.error("Failed to create gate pass. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/dashboard/security/gate-passes">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Issue Gate Pass
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
            Create a new exit permission for student or staff
          </p>
        </div>

        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Gate Pass Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Person Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Pass For <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={personType}
                  onValueChange={(value: string) => {
                    setPersonType(value as "student" | "staff");
                    setFormData({ ...formData, person_id: "" });
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="cursor-pointer">
                      Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="staff" id="staff" />
                    <Label htmlFor="staff" className="cursor-pointer">
                      Staff
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Person Selection */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="person_id" className="text-sm font-medium">
                    Select {personType === "student" ? "Student" : "Staff"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.person_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, person_id: value })
                    }
                    required
                  >
                    <SelectTrigger id="person_id" className="w-full">
                      <SelectValue
                        placeholder={`Select ${
                          personType === "student" ? "student" : "staff member"
                        }`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {personType === "student" ? (
                        students.length > 0 ? (
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          students.map((student: any) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.first_name} {student.last_name} (
                              {student.admission_no})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500">
                            No students found
                          </div>
                        )
                      ) : staffMembers.length > 0 ? (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        staffMembers.map((staff: any) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.first_name} {staff.last_name} (
                            {staff.employee_id})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          No staff members found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pass Type */}
                <div className="space-y-2">
                  <Label htmlFor="pass_type" className="text-sm font-medium">
                    Pass Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.pass_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pass_type: value })
                    }
                    required
                  >
                    <SelectTrigger id="pass_type" className="w-full">
                      <SelectValue placeholder="Select pass type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="temporary">
                        Temporary (Single Day)
                      </SelectItem>
                      <SelectItem value="medical">Medical Leave</SelectItem>
                      <SelectItem value="home">Home Visit</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="official">Official Work</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Exit Date */}
                <div className="space-y-2">
                  <Label htmlFor="date_of_exit" className="text-sm font-medium">
                    Date of Exit <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date_of_exit"
                    type="date"
                    value={formData.date_of_exit}
                    onChange={(e) =>
                      setFormData({ ...formData, date_of_exit: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>

                {/* Expected Return Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="expected_return"
                    className="text-sm font-medium"
                  >
                    Expected Return Date
                  </Label>
                  <Input
                    id="expected_return"
                    type="date"
                    value={formData.expected_return}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expected_return: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-sm font-medium">
                  Purpose of Exit <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  placeholder="Provide detailed reason for exit..."
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-sm font-medium">
                  Additional Remarks (Optional)
                </Label>
                <Textarea
                  id="remarks"
                  placeholder="Any additional information or special instructions..."
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.person_id ||
                    !formData.pass_type ||
                    !formData.date_of_exit ||
                    !formData.purpose
                  }
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Issue Gate Pass"}
                </Button>
                <Link
                  href="/dashboard/security/gate-passes"
                  className="w-full sm:w-auto"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              ℹ️ Gate Pass Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>Approval Required:</strong> All gate passes require
              approval from authorized personnel
            </p>
            <p>
              <strong>Valid ID:</strong> Person must carry valid ID card when
              exiting campus
            </p>
            <p>
              <strong>Return Time:</strong> Must return by expected return
              date/time
            </p>
            <p>
              <strong>Emergency Passes:</strong> Contact security office for
              immediate gate pass needs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
