"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, Users, Calendar, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  markBulkAttendance,
  getStudentsForAttendance,
  getClassAttendanceStats,
} from "@/app/dashboard/attendance/actions";

interface MarkAttendanceFormProps {
  classes: { id: string; name: string }[];
  preselectedClass?: string;
  preselectedSection?: string;
}

interface StudentForAttendance {
  id: string;
  admission_no: string;
  first_name: string;
  last_name: string;
  class: { id: string; name: string } | null;
  section: { id: string; name: string } | null;
  attendance?: {
    status: "present" | "absent" | "half_day" | "late";
    remarks: string | null;
  } | null;
}

export default function MarkAttendanceForm({
  classes,
  preselectedClass,
  preselectedSection,
}: MarkAttendanceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<StudentForAttendance[]>([]);
  const [stats, setStats] = useState<any>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    class_id: preselectedClass || "",
    section_id: preselectedSection || "",
  });

  const [attendanceData, setAttendanceData] = useState<
    Map<
      string,
      { status: "present" | "absent" | "half_day" | "late"; remarks: string }
    >
  >(new Map());

  useEffect(() => {
    if (formData.class_id) {
      loadSections(formData.class_id);
    } else {
      setSections([]);
      setStudents([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.class_id]);

  useEffect(() => {
    if (formData.class_id && formData.date) {
      loadStudents();
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.class_id, formData.section_id, formData.date]);

  const loadSections = async (classId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("sections")
      .select("id, name")
      .eq("class_id", classId)
      .order("name");

    setSections(data || []);
  };

  const loadStudents = async () => {
    if (!formData.class_id) return;

    setLoadingStudents(true);
    const result = await getStudentsForAttendance(
      formData.class_id,
      formData.section_id || undefined,
      formData.date
    );

    if (result.success && result.data) {
      setStudents(result.data);

      // Initialize attendance data - set all students with existing records or default to present
      const newAttendanceData = new Map();
      result.data.forEach((student: StudentForAttendance) => {
        if (student.attendance) {
          // Use existing attendance record
          newAttendanceData.set(student.id, {
            status: student.attendance.status,
            remarks: student.attendance.remarks || "",
          });
        } else {
          // Default all students to present
          newAttendanceData.set(student.id, {
            status: "present",
            remarks: "",
          });
        }
      });
      setAttendanceData(newAttendanceData);
    } else {
      toast.error(result.error || "Failed to load students");
    }

    setLoadingStudents(false);
  };

  const loadStats = async () => {
    if (!formData.class_id || !formData.date) return;

    const result = await getClassAttendanceStats(
      formData.class_id,
      formData.date,
      formData.section_id || undefined
    );

    if (result.success) {
      setStats(result.data);
    }
  };

  const handleStatusChange = (
    studentId: string,
    status: "present" | "absent" | "half_day" | "late"
  ) => {
    const current = attendanceData.get(studentId) || {
      status: "present",
      remarks: "",
    };
    const updated = new Map(attendanceData);
    updated.set(studentId, { ...current, status });
    setAttendanceData(updated);
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    const current = attendanceData.get(studentId) || {
      status: "present",
      remarks: "",
    };
    const updated = new Map(attendanceData);
    updated.set(studentId, { ...current, remarks });
    setAttendanceData(updated);
  };

  const markAllAs = (status: "present" | "absent" | "half_day" | "late") => {
    const updated = new Map();
    students.forEach((student) => {
      updated.set(student.id, {
        status,
        remarks: attendanceData.get(student.id)?.remarks || "",
      });
    });
    setAttendanceData(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.class_id || !formData.date) {
      toast.error("Please select class and date");
      return;
    }

    if (attendanceData.size === 0) {
      toast.error("Please mark attendance for at least one student");
      return;
    }

    setLoading(true);

    try {
      const attendance = Array.from(attendanceData.entries()).map(
        ([student_id, data]) => ({
          student_id,
          status: data.status,
          remarks: data.remarks || undefined,
        })
      );

      const result = await markBulkAttendance({
        class_id: formData.class_id,
        section_id: formData.section_id || undefined,
        date: formData.date,
        attendance,
      });

      if (result.success) {
        toast.success("Attendance marked successfully");
        router.push("/dashboard/attendance");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to mark attendance");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="glass-effect border-0 shadow-xl">
        <CardContent className="pt-6">
          {/* Selection Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Class <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.class_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, class_id: value, section_id: "" })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Section</label>
              <Select
                value={formData.section_id || "all"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    section_id: value === "all" ? "" : value,
                  })
                }
                disabled={!formData.class_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total_students}</div>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.present}
              </div>
              <p className="text-xs text-muted-foreground">Present</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {stats.absent}
              </div>
              <p className="text-xs text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                {stats.half_day}
              </div>
              <p className="text-xs text-muted-foreground">Half Day</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                {stats.late}
              </div>
              <p className="text-xs text-muted-foreground">Late</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
                {stats.not_marked}
              </div>
              <p className="text-xs text-muted-foreground">Not Marked</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      {students.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markAllAs("present")}
          >
            Mark All Present
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markAllAs("absent")}
          >
            Mark All Absent
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markAllAs("half_day")}
          >
            Mark All Half Day
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markAllAs("late")}
          >
            Mark All Late
          </Button>
        </div>
      )}

      {/* Students Table */}
      {loadingStudents ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No students found for the selected criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Admission No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => {
                const attendance = attendanceData.get(student.id);
                return (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.admission_no}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.class?.name || "N/A"}</TableCell>
                    <TableCell>{student.section?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Select
                        value={attendance?.status || "present"}
                        onValueChange={(value: any) =>
                          handleStatusChange(student.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">
                            <Badge variant="default">Present</Badge>
                          </SelectItem>
                          <SelectItem value="absent">
                            <Badge variant="destructive">Absent</Badge>
                          </SelectItem>
                          <SelectItem value="half_day">
                            <Badge variant="secondary">Half Day</Badge>
                          </SelectItem>
                          <SelectItem value="late">
                            <Badge variant="outline">Late</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={attendance?.remarks || ""}
                        onChange={(e) =>
                          handleRemarksChange(student.id, e.target.value)
                        }
                        placeholder="Optional remarks"
                        className="min-h-[60px]"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Submit Button */}
      {students.length > 0 && (
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || attendanceData.size === 0}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Attendance
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
