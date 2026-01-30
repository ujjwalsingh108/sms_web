"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Save, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

function NewRoomForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [hostels, setHostels] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    hostel_id: searchParams.get("hostel_id") || "",
    room_number: "",
    floor_number: "",
    room_type: "",
    capacity: "1",
    monthly_fee: "",
    status: "available",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHostels = async () => {
      const { data } = await supabase
        .from("hostels")
        .select("id, name, hostel_type")
        .order("name");
      setHostels(data || []);
    };
    fetchHostels();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: tenantData } = await supabase
        .from("users")
        .select("tenant_id")
        .eq("id", userData.user?.id || "")
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("hostel_rooms") as any).insert([
        {
          ...formData,
          floor_number: parseInt(formData.floor_number) || 0,
          capacity: parseInt(formData.capacity) || 1,
          monthly_fee: parseFloat(formData.monthly_fee) || 0,
          occupied_beds: 0,
          tenant_id: (tenantData as any)?.tenant_id,
        },
      ]);

      if (error) throw error;

      if (searchParams.get("hostel_id")) {
        router.push(`/dashboard/hostel/hostels/${formData.hostel_id}`);
      } else {
        router.push("/dashboard/hostel/rooms");
      }
      router.refresh();
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href={
              searchParams.get("hostel_id")
                ? `/dashboard/hostel/hostels/${searchParams.get("hostel_id")}`
                : "/dashboard/hostel/rooms"
            }
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Room
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Room Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="hostel_id"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Hostel <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.hostel_id}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, hostel_id: value })
                  }
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map((hostel) => (
                      <SelectItem key={hostel.id} value={hostel.id}>
                        {hostel.name} ({hostel.hostel_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="room_number"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Room Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="room_number"
                    value={formData.room_number}
                    onChange={(e) =>
                      setFormData({ ...formData, room_number: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g., 101, A-201"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="floor_number"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Floor Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="floor_number"
                    type="number"
                    min="0"
                    value={formData.floor_number}
                    onChange={(e) =>
                      setFormData({ ...formData, floor_number: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter floor number"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="room_type"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Room Type
                  </Label>
                  <Input
                    id="room_type"
                    value={formData.room_type}
                    onChange={(e) =>
                      setFormData({ ...formData, room_type: e.target.value })
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="e.g., Single, Double, Shared"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="capacity"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Capacity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Number of beds"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="monthly_fee"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Monthly Fee (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="monthly_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_fee}
                    onChange={(e) =>
                      setFormData({ ...formData, monthly_fee: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter monthly fee"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, status: value })
                    }
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Available
                        </span>
                      </SelectItem>
                      <SelectItem value="occupied">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          Occupied
                        </span>
                      </SelectItem>
                      <SelectItem value="maintenance">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                          Maintenance
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Creating..." : "Create Room"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="glass-effect border-0 shadow-xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-purple-900 dark:text-purple-300">
                    Room Management Guidelines:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Room numbers must be unique within a hostel</li>
                    <li>
                      Capacity indicates the maximum number of students that can
                      occupy the room
                    </li>
                    <li>
                      Set status to "Maintenance" if the room is under repair
                    </li>
                    <li>
                      Monthly fee will be the default fee for new allocations
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default function NewRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <NewRoomForm />
    </Suspense>
  );
}
