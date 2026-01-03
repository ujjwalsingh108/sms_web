"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createExamSchedule,
  updateExamSchedule,
  getExams,
  getClasses,
  getSubjects,
} from "@/app/dashboard/exams/actions";
import { Loader2 } from "lucide-react";

const scheduleFormSchema = z.object({
  exam_id: z.string().min(1, "Exam is required"),
  class_id: z.string().min(1, "Class is required"),
  subject_id: z.string().min(1, "Subject is required"),
  exam_date: z.string().min(1, "Exam date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  room_number: z.string().optional(),
  max_marks: z.string().min(1, "Maximum marks is required"),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

type ScheduleFormProps = {
  initialData?: {
    id: string;
    exam_id: string;
    class_id: string;
    subject_id: string;
    exam_date: string;
    start_time: string | null;
    end_time: string | null;
    room_number: string | null;
    max_marks: number;
  };
};

export function ScheduleForm({ initialData }: ScheduleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      exam_id: initialData?.exam_id || "",
      class_id: initialData?.class_id || "",
      subject_id: initialData?.subject_id || "",
      exam_date: initialData?.exam_date || "",
      start_time: initialData?.start_time || "",
      end_time: initialData?.end_time || "",
      room_number: initialData?.room_number || "",
      max_marks: initialData?.max_marks?.toString() || "100",
    },
  });

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        const [examsResult, classesResult, subjectsResult] = await Promise.all([
          getExams(),
          getClasses(),
          getSubjects(),
        ]);

        if (examsResult.success) setExams(examsResult.data || []);
        if (classesResult.success) setClasses(classesResult.data || []);
        if (subjectsResult.success) setSubjects(subjectsResult.data || []);
      } catch (error) {
        toast.error("Failed to load form data");
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, []);

  async function onSubmit(data: ScheduleFormValues) {
    setIsLoading(true);

    try {
      const formData = {
        ...data,
        max_marks: parseInt(data.max_marks),
      };

      let result;
      if (initialData) {
        result = await updateExamSchedule(initialData.id, formData);
      } else {
        result = await createExamSchedule(formData);
      }

      if (result.success) {
        toast.success(
          initialData
            ? "Schedule updated successfully"
            : "Schedule created successfully"
        );
        router.push("/dashboard/exams/schedules");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Schedule Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Schedule Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="exam_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name}
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
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
              name="subject_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
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
              name="max_marks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Marks</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Date & Time Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Date & Time</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="exam_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Room 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time (Optional)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Schedule" : "Create Schedule"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/exams/schedules")}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
