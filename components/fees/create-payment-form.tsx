"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createFeePayment,
  getStudentFeeSummary,
} from "@/app/dashboard/fees/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, User, DollarSign, CreditCard, Save } from "lucide-react";

const paymentSchema = z.object({
  student_id: z.string().min(1, "Student is required"),
  fee_structure_id: z.string().optional(),
  amount_paid: z.string().min(1, "Amount is required"),
  payment_date: z.string().min(1, "Payment date is required"),
  payment_method: z.enum([
    "cash",
    "card",
    "upi",
    "cheque",
    "bank_transfer",
    "other",
  ]),
  transaction_id: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "completed", "failed"]),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface CreatePaymentFormProps {
  students: any[];
}

export default function CreatePaymentForm({
  students,
}: CreatePaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [feeSummary, setFeeSummary] = useState<any>(null);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "cash",
      status: "completed",
    },
  });

  const handleStudentChange = async (studentId: string) => {
    const result = await getStudentFeeSummary(studentId);
    if (result.success && result.data) {
      setFeeSummary(result.data.summary);
      setSelectedStudent(result.data.student);
      if (result.data.feeStructure) {
        form.setValue("fee_structure_id", (result.data.feeStructure as any).id);
      }
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsLoading(true);
    try {
      const result = await createFeePayment({
        ...data,
        amount_paid: parseFloat(data.amount_paid),
      } as any);

      if (result.success) {
        toast.success("Payment recorded successfully");
        router.push("/dashboard/fees");
      } else {
        toast.error(result.error || "Failed to record payment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="student_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleStudentChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.admission_no} - {student.first_name}{" "}
                            {student.last_name}
                            {student.class?.name
                              ? ` (${student.class.name})`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {feeSummary && (
                <div className="glass-effect p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Fee Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Total Due
                      </p>
                      <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        ₹{feeSummary.totalDue?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Total Paid
                      </p>
                      <p className="font-semibold text-lg text-green-600 dark:text-green-400">
                        ₹{feeSummary.totalPaid?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Balance
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          feeSummary.balance > 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        ₹{feeSummary.balance?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <CreditCard className="h-5 w-5 text-green-500 dark:text-green-400" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount_paid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="bank_transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transaction_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Record Payment
            </Button>
            <Link href="/dashboard/fees" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
