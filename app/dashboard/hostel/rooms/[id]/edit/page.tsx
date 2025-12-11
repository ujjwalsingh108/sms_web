"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Save } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [hostels, setHostels] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    hostel_id: "",
    room_number: "",
    floor_number: "",
    room_type: "",
    capacity: "",
    monthly_fee: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch hostels
      const { data: hostelsData } = await supabase
        .from("hostels")
        .select("id, name, hostel_type")
        .order("name");
      setHostels(hostelsData || []);

      // Fetch room
      const { data: roomData, error } = await supabase
        .from("hostel_rooms")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (error) {
        console.error("Error fetching room:", error);
        router.push("/dashboard/hostel/rooms");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const room = roomData as any;
      setFormData({
        hostel_id: room.hostel_id || "",
        room_number: room.room_number || "",
        floor_number: room.floor_number?.toString() || "",
        room_type: room.room_type || "",
        capacity: room.capacity?.toString() || "",
        monthly_fee: room.monthly_fee?.toString() || "",
        status: room.status || "",
      });
      setFetching(false);
    };

    fetchData();
  }, [params.id, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("hostel_rooms") as any)
        .update({
          ...formData,
          floor_number: parseInt(formData.floor_number) || 0,
          capacity: parseInt(formData.capacity) || 1,
          monthly_fee: parseFloat(formData.monthly_fee) || 0,
        })
        .eq("id", params.id as string);

      if (error) throw error;

      router.push(`/dashboard/hostel/rooms/${params.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/hostel/rooms/${params.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Room
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
                  {loading ? "Updating..." : "Update Room"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
