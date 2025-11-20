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

  type Payment = {
    id: string;
    amount_paid: number;
    payment_method: string;
    created_at: string;
    student?: {
      first_name: string;
      last_name: string;
      admission_no: string;
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">
          Recent Fee Payments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {recentPayments && recentPayments.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {(recentPayments as Payment[]).map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 last:border-0 gap-2"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">
                    {payment.student?.first_name} {payment.student?.last_name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    Admission No: {payment.student?.admission_no}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400">
                    {payment.created_at &&
                      formatDistanceToNow(new Date(payment.created_at), {
                        addSuffix: true,
                      })}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-green-600 text-base md:text-lg">
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
