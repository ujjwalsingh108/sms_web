import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, DollarSign } from "lucide-react";

export async function DashboardStats({
  tenantId,
  role,
}: {
  tenantId: string;
  role: string;
}) {
  const supabase = await createClient();

  // Fetch stats based on role
  const stats = [];

  if (["superadmin", "admin", "teacher"].includes(role)) {
    const { count: studentsCount } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active");

    stats.push({
      title: "Total Students",
      value: studentsCount || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    });
  }

  if (["superadmin", "admin"].includes(role)) {
    const { count: staffCount } = await supabase
      .from("staff")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId)
      .eq("status", "active");

    stats.push({
      title: "Total Staff",
      value: staffCount || 0,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    });
  }

  if (["superadmin", "admin", "librarian"].includes(role)) {
    const { count: booksCount } = await supabase
      .from("library_books")
      .select("*", { count: "exact", head: true })
      .eq("tenant_id", tenantId);

    stats.push({
      title: "Library Books",
      value: booksCount || 0,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    });
  }

  if (["superadmin", "admin", "accountant"].includes(role)) {
    const { data: payments } = await supabase
      .from("fee_payments")
      .select("amount_paid")
      .eq("tenant_id", tenantId)
      .eq("status", "completed")
      .gte(
        "payment_date",
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0]
      );

    type PaymentData = { amount_paid: number };

    const totalRevenue =
      (payments as PaymentData[] | null)?.reduce(
        (sum, p) => sum + Number(p.amount_paid),
        0
      ) || 0;

    stats.push({
      title: "Monthly Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-1.5 md:p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
