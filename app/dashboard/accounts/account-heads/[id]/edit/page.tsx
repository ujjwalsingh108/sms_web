import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AccountHeadForm from "@/components/accounts/account-head-form";

export default async function EditAccountHeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { data: members } = await supabase
    .from("members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .eq("status", "approved");

  const member = members?.[0] as { tenant_id: string } | undefined;

  if (!member) return redirect("/login");

  const { data: accountHeads } = await supabase
    .from("account_heads")
    .select("*")
    .eq("tenant_id", member.tenant_id)
    .eq("id", id)
    .single();

  if (!accountHeads) {
    notFound();
  }

  const accountHead = accountHeads as {
    id: string;
    name: string;
    type: string;
    description?: string | null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/accounts/account-heads">
            <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Edit Account Head
            </h1>
            <p className="text-muted-foreground mt-1">Update account head details</p>
          </div>
        </div>

        <Card className="glass-effect border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Account Head Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Client-side form component */}
            <AccountHeadForm accountHead={accountHead} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
