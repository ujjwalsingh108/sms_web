"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SalesExecutive } from "@/lib/types/sales-executive";

export function SalesLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Check if user is a sales executive
        const { data: salesExec } = (await supabase
          .from("sales_executives")
          .select("id, employment_status, is_deleted")
          .eq("user_id", data.user.id)
          .single()) as {
          data: Pick<
            SalesExecutive,
            "id" | "employment_status" | "is_deleted"
          > | null;
        };

        if (!salesExec) {
          await supabase.auth.signOut();
          toast.error("You are not registered as a sales executive");
          return;
        }

        if (salesExec.is_deleted) {
          await supabase.auth.signOut();
          toast.error("Your account has been deactivated");
          return;
        }

        if (salesExec.employment_status !== "active") {
          await supabase.auth.signOut();
          toast.error(`Your account is ${salesExec.employment_status}`);
          return;
        }

        toast.success("Login successful!");
        router.push("/sales/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@company.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Login
      </Button>
    </form>
  );
}
