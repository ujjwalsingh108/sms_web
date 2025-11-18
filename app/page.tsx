import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            School <span className="text-blue-600">ERP</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive School Management System - Streamline admission, fees,
            library, transport, attendance, exams, and more.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/login">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="px-8">
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
            {[
              "Admission Management",
              "Fee Collection",
              "Library System",
              "Transport Tracking",
              "Exam Management",
              "Attendance System",
              "Staff Management",
              "Hostel Management",
            ].map((feature) => (
              <Card
                key={feature}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-gray-700">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-16 text-sm text-gray-500">
            <p>© 2025 Nescomm. Developed by Ujjwal Singh</p>
          </div>
        </div>
      </div>
    </div>
  );
}
