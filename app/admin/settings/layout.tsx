import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "@/lib/helpers/admin";

export default async function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const isAdmin = await isSuperAdmin();
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
