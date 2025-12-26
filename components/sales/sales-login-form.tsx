"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { SalesExecutive } from "@/lib/types/sales-executive";

export function SalesLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <Card className="shadow-2xl border-0 rounded-2xl">
      <CardHeader className="space-y-2 pb-4 pt-6 px-6 sm:px-8">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sales Portal Login
        </CardTitle>
        <CardDescription className="text-center text-sm text-gray-600">
          Enter your credentials to access the sales dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 px-6 sm:px-8 pb-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={loading}
              className="h-11 px-4 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
                className="h-11 px-4 pr-12 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors"
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 px-6 sm:px-8 pb-6">
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
