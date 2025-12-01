import { CreateSchoolForm } from "@/components/admin/create-school-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateSchoolPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/schools"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Schools
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New School</h1>
        <p className="text-gray-600 mt-1">
          Set up a new school instance with subdomain and admin credentials
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateSchoolForm />
        </CardContent>
      </Card>
    </div>
  );
}
