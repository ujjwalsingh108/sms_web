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
import { ArrowLeft, Save, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewAllocationPage() {
  const router = useRouter();
  const supabase = createClient();

  const [students, setStudents] = useState<any[]>([]);
  const [hostels, setHostels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    student_id: "",
    hostel_id: "",
    room_id: "",
    allocation_date: new Date().toISOString().split("T")[0],
    monthly_fee: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, first_name, last_name")
        .order("first_name");
      setStudents(studentsData || []);

      const { data: hostelsData } = await supabase
        .from("hostels")
        .select("id, name")
        .order("name");
      setHostels(hostelsData || []);
    };
    fetchData();
  }, [supabase]);

  useEffect(() => {
    if (formData.hostel_id) {
      const fetchRooms = async () => {
        const { data: roomsData } = await supabase
          .from("hostel_rooms")
          .select(
            "id, room_number, capacity, occupied_beds, status, monthly_fee"
          )
          .eq("hostel_id", formData.hostel_id)
          .order("room_number");
        setRooms(roomsData || []);
      };
      fetchRooms();
    } else {
      setRooms([]);
      setFormData((prev) => ({ ...prev, room_id: "", monthly_fee: "" }));
    }
  }, [formData.hostel_id, supabase]);

  const handleRoomChange = (roomId: string) => {
    const selectedRoom = rooms.find((r) => r.id === roomId);
    setFormData({
      ...formData,
      room_id: roomId,
      monthly_fee: selectedRoom?.monthly_fee?.toString() || "",
    });
  };

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

      // Check if room has available capacity
      const { data: room } = await supabase
        .from("hostel_rooms")
        .select("capacity, occupied_beds")
        .eq("id", formData.room_id)
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (room && (room as any).occupied_beds >= (room as any).capacity) {
        alert("This room is at full capacity.");
        setLoading(false);
        return;
      }

      // Insert allocation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: allocationError } = await (
        supabase.from("hostel_allocations") as any
      ).insert([
        {
          ...formData,
          monthly_fee: parseFloat(formData.monthly_fee) || 0,
          status: "active",
          tenant_id: (tenantData as any)?.tenant_id,
        },
      ]);

      if (allocationError) throw allocationError;

      // Update room occupied beds
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("hostel_rooms") as any)
        .update({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          occupied_beds: ((room as any)?.occupied_beds || 0) + 1,
          status:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((room as any)?.occupied_beds || 0) + 1 >=
            ((room as any)?.capacity || 1)
              ? "occupied"
              : "available",
        })
        .eq("id", formData.room_id);

      router.push("/dashboard/hostel/allocations");
      router.refresh();
    } catch (error) {
      console.error("Error creating allocation:", error);
      alert("Failed to create allocation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/hostel/allocations">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            New Room Allocation
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Allocation Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="student_id"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Student <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.student_id}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, student_id: value })
                  }
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.first_name} {student.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                    setFormData({ ...formData, hostel_id: value, room_id: "" })
                  }
                  required
                >
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map((hostel) => (
                      <SelectItem key={hostel.id} value={hostel.id}>
                        {hostel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="room_id"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Room <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.room_id}
                  onValueChange={handleRoomChange}
                  required
                  disabled={!formData.hostel_id}
                >
                  <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue
                      placeholder={
                        formData.hostel_id
                          ? "Select room"
                          : "Select hostel first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms
                      .filter(
                        (room) =>
                          room.status !== "maintenance" &&
                          room.occupied_beds < room.capacity
                      )
                      .map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.room_number} ({room.occupied_beds}/
                          {room.capacity} beds) - ₹{room.monthly_fee}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {formData.hostel_id &&
                  rooms.filter(
                    (r) =>
                      r.status !== "maintenance" && r.occupied_beds < r.capacity
                  ).length === 0 && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      No available rooms in this hostel
                    </p>
                  )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="allocation_date"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Allocation Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="allocation_date"
                    type="date"
                    value={formData.allocation_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        allocation_date: e.target.value,
                      })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Creating..." : "Allocate Room"}
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
                    Allocation Guidelines:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>Only available rooms with vacant beds are shown</li>
                    <li>
                      The monthly fee is automatically set from the room's
                      default fee
                    </li>
                    <li>You can adjust the fee if needed for special cases</li>
                    <li>Room capacity will be updated automatically</li>
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
