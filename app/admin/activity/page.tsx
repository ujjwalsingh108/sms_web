import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, TrendingUp, Calendar } from "lucide-react";

export default async function ActivityLogsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get recent activity logs with user details
  const { data: activityLogs } = await supabase
    .from("admin_activity_logs")
    .select(
      `
      id,
      action,
      resource_type,
      resource_id,
      details,
      ip_address,
      created_at,
      admin_user_id
    `
    )
    .order("created_at", { ascending: false })
    .limit(50);

  // Get activity stats
  const { count: todayLogs } = await supabase
    .from("admin_activity_logs")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date().toISOString().split("T")[0]);

  const { count: weekLogs } = await supabase
    .from("admin_activity_logs")
    .select("*", { count: "exact", head: true })
    .gte(
      "created_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    );

  return (
    <div>
      <AdminHeader
        title="Activity Logs"
        description="Monitor all admin activities"
        user={user}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayLogs || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Activities today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Week
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekLogs || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Admins
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(activityLogs?.map((log: any) => log.admin_user_id))
                  .size || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Active admins</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLogs && activityLogs.length > 0 ? (
              <div className="space-y-4">
                {activityLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-start gap-3 pb-4 border-b last:border-0"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {log.action}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                        {log.resource_type && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded">
                            {log.resource_type}
                          </span>
                        )}
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                        {log.ip_address && <span>IP: {log.ip_address}</span>}
                      </div>
                      {log.details && (
                        <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No activity logs found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
