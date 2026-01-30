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
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

type AccountHead = {
  id: string;
  name: string;
  type: string;
};

type Transaction = {
  id: string;
  transaction_date: string;
  account_head_id: string;
  type: string;
  amount: number;
  payment_method?: string | null;
  reference_number?: string | null;
  description?: string | null;
};

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const transactionId = params?.id as string;
  const [loading, setLoading] = useState(false);
  const [accountHeads, setAccountHeads] = useState<AccountHead[]>([]);
  const [formData, setFormData] = useState({
    transaction_date: "",
    account_head_id: "",
    type: "",
    amount: "",
    payment_method: "",
    reference_number: "",
    description: "",
  });
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    fetchAccountHeads();
    fetchTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  const fetchAccountHeads = async () => {
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
      const { data } = await supabase
        .from("account_heads")
        .select("id, name, type")
        .eq("tenant_id", (members as { tenant_id: string }).tenant_id)
        .order("name");
      setAccountHeads((data as AccountHead[]) || []);
    } catch (error) {
      console.error("Error fetching account heads:", error);
    }
  };

  const fetchTransaction = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !transactionId) return;
      const { data: members } = await supabase
        .from("members")
        .select("tenant_id")
        .eq("user_id", user.id)
        .eq("status", "approved")
        .single();
      if (!members) return;
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .eq("tenant_id", (members as { tenant_id: string }).tenant_id)
        .single();
      if (data) {
        const txn = data as Transaction;
        setFormData({
          transaction_date: txn.transaction_date?.split("T")[0] || "",
          account_head_id: txn.account_head_id || "",
          type: txn.type || "",
          amount: txn.amount?.toString() || "",
          payment_method: txn.payment_method || "",
          reference_number: txn.reference_number || "",
          description: txn.description || "",
        });
        setInitialLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
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
      // Update transaction
      const { error } = await (supabase.from("transactions") as any)
        .update({
          transaction_date: formData.transaction_date,
          account_head_id: formData.account_head_id,
          type: formData.type,
          amount: parseFloat(formData.amount),
          payment_method: formData.payment_method || null,
          reference_number: formData.reference_number || null,
          description: formData.description || null,
        })
        .eq("id", transactionId)
        .eq("tenant_id", (members as { tenant_id: string }).tenant_id);
      if (error) throw error;
      toast.success("Transaction updated successfully");
      router.push(`/dashboard/accounts/transactions/${transactionId}/view`);
      router.refresh();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine transaction type based on selected account head
  const selectedAccountHead = accountHeads.find(
    (ah) => ah.id === formData.account_head_id
  );
  const suggestedType = selectedAccountHead
    ? selectedAccountHead.type === "income"
      ? "credit"
      : selectedAccountHead.type === "expense"
      ? "debit"
      : ""
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href={`/dashboard/accounts/transactions/${transactionId}/view`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Transaction
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
              Update financial transaction details
            </p>
          </div>
        </div>
        <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {initialLoaded ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Transaction Date */}
                  <div className="space-y-2">
                    <Label htmlFor="transaction_date" className="text-sm font-medium">
                      Transaction Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="transaction_date"
                      type="date"
                      value={formData.transaction_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          transaction_date: e.target.value,
                        })
                      }
                      required
                      className="w-full"
                    />
                  </div>
                  {/* Account Head */}
                  <div className="space-y-2">
                    <Label htmlFor="account_head_id" className="text-sm font-medium">
                      Account Head <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.account_head_id}
                      onValueChange={(value) => {
                        setFormData({
                          ...formData,
                          account_head_id: value,
                          type: value ? suggestedType : formData.type,
                        });
                      }}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select account head" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountHeads.map((ah) => (
                          <SelectItem key={ah.id} value={ah.id}>
                            {ah.name} ({ah.type.charAt(0).toUpperCase() + ah.type.slice(1)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">
                      Transaction Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Credit (Income)</SelectItem>
                        <SelectItem value="debit">Debit (Expense)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-sm font-medium">
                      Amount <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                      className="w-full"
                    />
                  </div>
                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label htmlFor="payment_method" className="text-sm font-medium">
                      Payment Method
                    </Label>
                    <Input
                      id="payment_method"
                      type="text"
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({ ...formData, payment_method: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  {/* Reference Number */}
                  <div className="space-y-2">
                    <Label htmlFor="reference_number" className="text-sm font-medium">
                      Reference Number
                    </Label>
                    <Input
                      id="reference_number"
                      type="text"
                      value={formData.reference_number}
                      onChange={(e) =>
                        setFormData({ ...formData, reference_number: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Update Transaction"}
                  </Button>
                  <Link href={`/dashboard/accounts/transactions/${transactionId}`}>
                    <Button variant="outline">Cancel</Button>
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Loading transaction details...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
