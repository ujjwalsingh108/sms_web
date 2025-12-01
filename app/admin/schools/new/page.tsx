import { createClient } from "@/lib/supabase/server";
import { CreateSchoolForm } from "@/components/admin/create-school-form";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateSchoolPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <AdminHeader
        title="Create New School"
        description="Set up a new school instance with subdomain and admin credentials"
        user={user}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl">
          <Link href="/admin/schools">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateSchoolForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
