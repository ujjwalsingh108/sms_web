"use client";

import { useState } from "react";
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

export default function NewAccountHeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      // Get current user and tenant
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

      // Insert account head
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("account_heads") as any).insert([
        {
          tenant_id: (members as { tenant_id: string }).tenant_id,
          name: formData.name,
          type: formData.type,
          description: formData.description || null,
        },
      ]);

      if (error) throw error;

      alert("Account head created successfully");
      router.push("/dashboard/accounts/account-heads");
      router.refresh();
    } catch (error) {
      console.error("Error creating account head:", error);
      alert("Failed to create account head. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/dashboard/accounts/account-heads">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
          New Account Head
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
          Create a new account classification for transactions
        </p>
      </div>

      <Card className="glass-effect border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Account Head Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Account Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Tuition Fees, Salary Expense"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Account Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  required
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Income
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Expense
                      </div>
                    </SelectItem>
                    <SelectItem value="asset">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Asset
                      </div>
                    </SelectItem>
                    <SelectItem value="liability">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        Liability
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Income: Money received | Expense: Money spent | Asset:
                  Resources owned | Liability: Debts owed
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of this account head"
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
                disabled={loading || !formData.name || !formData.type}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90 shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create Account Head"}
              </Button>
              <Link
                href="/dashboard/accounts/account-heads"
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

      {/* Help Section */}
      <Card className="glass-effect border-0 shadow-lg bg-blue-50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Quick Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Income:</strong> Use for revenue sources (Tuition Fees,
            Donations, Admission Fees)
          </p>
          <p>
            <strong>Expense:</strong> Use for operational costs (Salaries,
            Utilities, Maintenance)
          </p>
          <p>
            <strong>Asset:</strong> Use for owned resources (Cash, Equipment,
            Buildings)
          </p>
          <p>
            <strong>Liability:</strong> Use for debts and obligations (Loans,
            Payables)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
