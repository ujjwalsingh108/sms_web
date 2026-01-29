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
import { createClient } from "@/lib/supabase/client";

type AccountHead = {
  id: string;
  name: string;
  type: string;
};

export default function NewTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accountHeads, setAccountHeads] = useState<AccountHead[]>([]);
  const [formData, setFormData] = useState({
    transaction_date: new Date().toISOString().split("T")[0],
    account_head_id: "",
    type: "",
    amount: "",
    payment_method: "",
    reference_number: "",
    description: "",
  });

  useEffect(() => {
    fetchAccountHeads();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login to continue");
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
        alert("No active tenant found");
        return;
      }

      // Insert transaction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("transactions") as any).insert([
        {
          tenant_id: (members as { tenant_id: string }).tenant_id,
          transaction_date: formData.transaction_date,
          account_head_id: formData.account_head_id,
          type: formData.type,
          amount: parseFloat(formData.amount),
          payment_method: formData.payment_method || null,
          reference_number: formData.reference_number || null,
          description: formData.description || null,
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      alert("Transaction created successfully");
      router.push("/dashboard/accounts");
      router.refresh();
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
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
          <Link href="/dashboard/accounts">
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
              New Transaction
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
              Record a new financial transaction
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transaction Date */}
                <div className="space-y-2">
                  <Label
                    htmlFor="transaction_date"
                    className="text-sm font-medium"
                  >
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
                  <Label htmlFor="account_head" className="text-sm font-medium">
                    Account Head <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.account_head_id}
                    onValueChange={(value) => {
                      const accountHead = accountHeads.find(
                        (ah) => ah.id === value
                      );
                      setFormData({
                        ...formData,
                        account_head_id: value,
                        type: accountHead
                          ? accountHead.type === "income"
                            ? "credit"
                            : accountHead.type === "expense"
                            ? "debit"
                            : ""
                          : "",
                      });
                    }}
                    required
                  >
                    <SelectTrigger id="account_head" className="w-full">
                      <SelectValue placeholder="Select account head" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountHeads.length > 0 ? (
                        accountHeads.map((head) => (
                          <SelectItem key={head.id} value={head.id}>
                            {head.name} ({head.type})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          No account heads found. Create one first.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction Type */}
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
                    <SelectTrigger id="type" className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Credit (Income/Receipt)
                        </div>
                      </SelectItem>
                      <SelectItem value="debit">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Debit (Expense/Payment)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {suggestedType && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Suggested:{" "}
                      {suggestedType === "credit"
                        ? "Credit (Income)"
                        : "Debit (Expense)"}{" "}
                      based on account type
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Amount (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
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
                  <Label
                    htmlFor="payment_method"
                    className="text-sm font-medium"
                  >
                    Payment Method
                  </Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) =>
                      setFormData({ ...formData, payment_method: value })
                    }
                  >
                    <SelectTrigger id="payment_method" className="w-full">
                      <SelectValue placeholder="Select method (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="online">Online Transfer</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reference Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="reference_number"
                    className="text-sm font-medium"
                  >
                    Reference Number
                  </Label>
                  <Input
                    id="reference_number"
                    type="text"
                    placeholder="Cheque/Transaction ID (optional)"
                    value={formData.reference_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reference_number: e.target.value,
                      })
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
                  placeholder="Additional details about this transaction"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.account_head_id ||
                    !formData.type ||
                    !formData.amount
                  }
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save Transaction"}
                </Button>
                <Link href="/dashboard/accounts" className="w-full sm:w-auto">
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
      </div>
    </div>
  );
}
