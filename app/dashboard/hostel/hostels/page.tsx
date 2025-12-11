import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Building2, Users, Bed, CheckCircle } from "lucide-react";

export default async function HostelsListPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const { data: tenantData } = await supabase
    .from("users")
    .select("tenant_id")
    .eq("id", userData.user?.id || "")
    .single();

  const { data: hostels } = await supabase
    .from("hostels")
    .select("*")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .eq("tenant_id", (tenantData as any)?.tenant_id || "")
    .order("created_at", { ascending: false });

  // Calculate statistics
  const totalHostels = hostels?.length || 0;
  const boysHostels =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hostels?.filter((h: any) => h.hostel_type === "boys").length || 0;
  const girlsHostels =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hostels?.filter((h: any) => h.hostel_type === "girls").length || 0;
  const totalRooms =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hostels?.reduce((sum: number, h: any) => sum + (h.total_rooms || 0), 0) ||
    0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/hostel">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Hostels
            </h1>
          </div>
          <Link href="/dashboard/hostel/hostels/new">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Building2 className="mr-2 h-4 w-4" />
              Add Hostel
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-300">
          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                Total Hostels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {totalHostels}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Boys Hostels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {boysHostels}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-600" />
                Girls Hostels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {girlsHostels}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Bed className="h-4 w-4 text-green-600" />
                Total Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {totalRooms}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hostels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels && hostels.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hostels.map((hostel: any) => (
              <Card
                key={hostel.id}
                className="glass-effect border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        {hostel.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                        {hostel.hostel_type} Hostel
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        hostel.hostel_type === "boys"
                          ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-400"
                          : hostel.hostel_type === "girls"
                          ? "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 dark:from-pink-900/30 dark:to-rose-900/30 dark:text-pink-400"
                          : "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 dark:from-purple-900/30 dark:to-indigo-900/30 dark:text-purple-400"
                      }`}
                    >
                      {hostel.hostel_type}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Address:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {hostel.address || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="h-4 w-4 text-indigo-600" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Rooms:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {hostel.total_rooms || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Warden:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {hostel.warden_name || "Not assigned"}
                      </span>
                    </div>
                    {hostel.warden_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Phone:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {hostel.warden_phone}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Link
                      href={`/dashboard/hostel/hostels/${hostel.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/dashboard/hostel/hostels/${hostel.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-purple-100 dark:hover:bg-purple-900/20"
                      >
                        <Building2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="glass-effect border-0 shadow-xl col-span-full">
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No hostels found
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Click &quot;Add Hostel&quot; to create your first hostel
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
