"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Phone as PhoneIcon,
  GraduationCap,
  Save,
  Plus,
  X,
  Edit2,
  Users as UsersIcon,
} from "lucide-react";
import {
  updateStudent,
  getSectionsByClass,
  addGuardian,
  updateGuardian,
  deleteGuardian,
} from "@/app/dashboard/students/actions";
import type { StudentWithDetails, Class } from "@/lib/types/modules";

const studentSchema = z.object({
  admission_no: z.string().min(1, "Admission number is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  blood_group: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  class_id: z.string().optional(),
  section_id: z.string().optional(),
  admission_date: z.string().optional(),
  status: z.enum(["active", "inactive", "graduated", "transferred"]),
});

const guardianSchema = z.object({
  name: z.string().min(1, "Guardian name is required"),
  relationship: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  occupation: z.string().optional(),
  address: z.string().optional(),
  is_primary: z.boolean(),
});

type StudentFormValues = z.infer<typeof studentSchema>;
type GuardianFormValues = z.infer<typeof guardianSchema>;

interface EditStudentFormProps {
  student: StudentWithDetails;
  classes: Class[];
}

export function EditStudentForm({ student, classes }: EditStudentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [guardians, setGuardians] = useState<any[]>(student.guardians || []);
  const [showGuardianForm, setShowGuardianForm] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<any>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      admission_no: student.admission_no,
      first_name: student.first_name,
      last_name: student.last_name,
      date_of_birth: student.date_of_birth || "",
      gender: student.gender || undefined,
      blood_group: student.blood_group || "",
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
      class_id: student.class_id || "",
      section_id: student.section_id || "",
      admission_date: student.admission_date || "",
      status: student.status,
    },
  });

  const guardianForm = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianSchema),
    defaultValues: {
      name: "",
      is_primary: false,
    },
  });

  const selectedClassId = form.watch("class_id");

  useEffect(() => {
    if (selectedClassId) {
      getSectionsByClass(selectedClassId).then((result) => {
        if (result.success) {
          setSections(result.data || []);
        }
      });
    } else {
      setSections([]);
    }
  }, [selectedClassId]);

  // Load initial sections if class is selected
  useEffect(() => {
    if (student.class_id) {
      getSectionsByClass(student.class_id).then((result) => {
        if (result.success) {
          setSections(result.data || []);
        }
      });
    }
  }, [student.class_id]);

  const handleAddGuardian = async (data: GuardianFormValues) => {
    try {
      const result = await addGuardian(student.id, data);
      if (result.success) {
        setGuardians([...guardians, result.data]);
        guardianForm.reset({ name: "", is_primary: false });
        setShowGuardianForm(false);
        toast.success("Guardian added successfully");
      } else {
        toast.error(result.error || "Failed to add guardian");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleUpdateGuardian = async (data: GuardianFormValues) => {
    if (!editingGuardian) return;

    try {
      const result = await updateGuardian(editingGuardian.id, data);
      if (result.success) {
        setGuardians(
          guardians.map((g) => (g.id === editingGuardian.id ? result.data : g))
        );
        guardianForm.reset({ name: "", is_primary: false });
        setEditingGuardian(null);
        setShowGuardianForm(false);
        toast.success("Guardian updated successfully");
      } else {
        toast.error(result.error || "Failed to update guardian");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteGuardian = async (guardianId: string) => {
    if (!confirm("Are you sure you want to remove this guardian?")) return;

    try {
      const result = await deleteGuardian(guardianId, student.id);
      if (result.success) {
        setGuardians(guardians.filter((g) => g.id !== guardianId));
        toast.success("Guardian removed successfully");
      } else {
        toast.error(result.error || "Failed to remove guardian");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const startEditGuardian = (guardian: any) => {
    setEditingGuardian(guardian);
    guardianForm.reset({
      name: guardian.name,
      relationship: guardian.relationship || "",
      phone: guardian.phone || "",
      email: guardian.email || "",
      occupation: guardian.occupation || "",
      address: guardian.address || "",
      is_primary: guardian.is_primary,
    });
    setShowGuardianForm(true);
  };

  const cancelGuardianForm = () => {
    setShowGuardianForm(false);
    setEditingGuardian(null);
    guardianForm.reset({ name: "", is_primary: false });
  };

  const onSubmit = async (data: StudentFormValues) => {
    setLoading(true);

    try {
      const result = await updateStudent({
        id: student.id,
        ...data,
      });

      if (result.success) {
        toast.success("Student updated successfully");
        router.push(`/dashboard/students/${student.id}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update student");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <User className="h-5 w-5 text-blue-500" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="admission_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="ADM001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="admission_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="blood_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group</FormLabel>
                    <FormControl>
                      <Input placeholder="O+" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <PhoneIcon className="h-5 w-5 text-green-500" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="student@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter full address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedClassId || sections.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Guardians Section */}
        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <UsersIcon className="h-5 w-5 text-indigo-500" />
                Guardians
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingGuardian(null);
                  guardianForm.reset({ name: "", is_primary: false });
                  setShowGuardianForm(!showGuardianForm);
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Guardian
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display Existing Guardians */}
            {guardians.length > 0 && (
              <div className="space-y-2">
                {guardians.map((guardian) => (
                  <Card
                    key={guardian.id}
                    className="glass-effect border-0 shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{guardian.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {guardian.relationship || "Guardian"}
                            {guardian.is_primary && " (Primary)"}
                          </p>
                          {guardian.phone && (
                            <p className="text-sm">{guardian.phone}</p>
                          )}
                          {guardian.email && (
                            <p className="text-sm text-muted-foreground">
                              {guardian.email}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditGuardian(guardian)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteGuardian(guardian.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Guardian Form */}
            {showGuardianForm && (
              <Card className="glass-effect border-0 shadow-md bg-gray-50/50 dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-base">
                    {editingGuardian ? "Edit Guardian" : "Add Guardian"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={guardianForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Guardian name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={guardianForm.control}
                        name="relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="Father/Mother" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={guardianForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 98765 43210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={guardianForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="guardian@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={guardianForm.control}
                      name="occupation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <FormControl>
                            <Input placeholder="Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={guardianForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter address"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={guardianForm.control}
                      name="is_primary"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Primary Guardian</FormLabel>
                            <FormDescription>
                              Mark as primary contact for this student
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          if (editingGuardian) {
                            guardianForm.handleSubmit(handleUpdateGuardian)();
                          } else {
                            guardianForm.handleSubmit(handleAddGuardian)();
                          }
                        }}
                      >
                        {editingGuardian ? "Update Guardian" : "Add Guardian"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={cancelGuardianForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
            {loading ? "Updating..." : "Update Student"}
          </Button>
          <Link href={`/dashboard/students/${student.id}`} className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={loading}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
