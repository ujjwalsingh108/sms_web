"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Props = {
  accountHead: {
    id: string;
    name: string;
    type: string;
    description?: string | null;
  };
};

export default function AccountHeadForm({ accountHead }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: accountHead.name || "",
    type: accountHead.type || "",
    description: accountHead.description || "",
  });

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

      // Update account head
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("account_heads") as any)
        .update({
          name: formData.name,
          type: formData.type,
          description: formData.description || null,
        })
        .eq("id", accountHead.id);

      if (error) throw error;

      toast.success("Account head updated successfully");
      router.push("/dashboard/accounts/account-heads");
      router.refresh();
    } catch (err) {
      console.error("Error updating account head:", err);
      toast.error("Failed to update account head. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Account Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Tuition Fees, Salary Expense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">
            Account Type <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="liability">Liability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Brief description of this account head"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading || !formData.name || !formData.type}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Updating..." : "Update Account Head"}
        </Button>
      </div>
    </form>
  );
}
