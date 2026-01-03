"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, BookOpen, Code, FileText, GraduationCap } from "lucide-react";
import {
  createSubject,
  updateSubject,
  type Subject,
  type Class,
} from "@/app/dashboard/academic/actions";

const formSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters"),
  code: z
    .string()
    .min(2, "Subject code must be at least 2 characters")
    .max(10, "Subject code must be at most 10 characters")
    .toUpperCase(),
  description: z.string().optional(),
  class_ids: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface SubjectFormProps {
  subject?: Subject & { class_ids?: string[] };
  classes: Class[];
  mode: "create" | "edit";
}

export function SubjectForm({ subject, classes, mode }: SubjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subject?.name || "",
      code: subject?.code || "",
      description: subject?.description || "",
      class_ids: subject?.class_ids || [],
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const result =
        mode === "create"
          ? await createSubject(values)
          : await updateSubject(subject!.id, values);

      if (result.success) {
        toast.success(
          mode === "create"
            ? "Subject created successfully"
            : "Subject updated successfully"
        );
        router.push("/dashboard/academic");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="glass-effect border-0 rounded-2xl p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Subject Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Subject Information</h3>
                <p className="text-sm text-muted-foreground">
                  Basic details about the subject
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Subject Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Mathematics"
                        {...field}
                        className="glass-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Subject Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., MATH"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        className="glass-input uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      A unique code to identify the subject
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the subject"
                      className="glass-input resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Class Assignment Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Assign to Classes</h3>
                <p className="text-sm text-muted-foreground">
                  Select which classes will study this subject
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="class_ids"
              render={() => (
                <FormItem>
                  {classes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No classes available.</p>
                      <p className="text-sm mt-2">
                        Please create classes first before assigning subjects.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {classes.map((classItem) => (
                        <FormField
                          key={classItem.id}
                          control={form.control}
                          name="class_ids"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={classItem.id}
                                className="flex flex-row items-start space-x-3 space-y-0 glass-effect p-4 rounded-xl hover:shadow-md transition-all"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      classItem.id
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            classItem.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== classItem.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium cursor-pointer">
                                    {classItem.name}
                                  </FormLabel>
                                  {classItem.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {classItem.description}
                                    </p>
                                  )}
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Subject"
              ) : (
                "Update Subject"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
