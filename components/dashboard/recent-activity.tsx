import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export async function RecentActivity({ tenantId }: { tenantId: string }) {
  const supabase = await createClient();

  // Get recent fee payments
  const { data: recentPayments } = await supabase
    .from("fee_payments")
    .select("*, student:students(first_name, last_name, admission_no)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Fee Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPayments && recentPayments.length > 0 ? (
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">
                    {payment.student?.first_name} {payment.student?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Admission No: {payment.student?.admission_no}
                  </p>
                  <p className="text-xs text-gray-400">
                    {payment.created_at &&
                      formatDistanceToNow(new Date(payment.created_at), {
                        addSuffix: true,
                      })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ₹{Number(payment.amount_paid).toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {payment.payment_method}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No recent payments</p>
        )}
      </CardContent>
    </Card>
  );
}
