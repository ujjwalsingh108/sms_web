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

export default function EditAllocationPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    allocation_date: "",
    checkout_date: "",
    monthly_fee: "",
    status: "",
  });

  const [originalStatus, setOriginalStatus] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchAllocation = async () => {
      const { data, error } = await supabase
        .from("hostel_allocations")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (error) {
        console.error("Error fetching allocation:", error);
        router.push("/dashboard/hostel/allocations");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allocation = data as any;
      setFormData({
        allocation_date: allocation.allocation_date?.split("T")[0] || "",
        checkout_date: allocation.checkout_date?.split("T")[0] || "",
        monthly_fee: allocation.monthly_fee?.toString() || "",
        status: allocation.status || "",
      });
      setOriginalStatus(allocation.status);
      setRoomId(allocation.room_id);
      setFetching(false);
    };

    fetchAllocation();
  }, [params.id, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If status changed from active to vacated, update room occupied beds
      if (originalStatus === "active" && formData.status === "vacated") {
        const { data: room } = await supabase
          .from("hostel_rooms")
          .select("occupied_beds, capacity")
          .eq("id", roomId)
          .single();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (room as any) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newOccupied = Math.max(
            0,
            ((room as any).occupied_beds || 1) - 1
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from("hostel_rooms") as any)
            .update({
              occupied_beds: newOccupied,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              status:
                newOccupied < (room as any).capacity ? "available" : "occupied",
            })
            .eq("id", roomId);
        }

        // Set checkout date to today if not set
        if (!formData.checkout_date) {
          formData.checkout_date = new Date().toISOString().split("T")[0];
        }
      }

      // Update allocation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("hostel_allocations") as any)
        .update({
          allocation_date: formData.allocation_date,
          checkout_date: formData.checkout_date || null,
          monthly_fee: parseFloat(formData.monthly_fee) || 0,
          status: formData.status,
        })
        .eq("id", params.id);

      if (error) throw error;

      router.push(`/dashboard/hostel/allocations/${params.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating allocation:", error);
      alert("Failed to update allocation. Please try again.");
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
          <Link href={`/dashboard/hostel/allocations/${params.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Allocation
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
                    htmlFor="checkout_date"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Checkout Date
                  </Label>
                  <Input
                    id="checkout_date"
                    type="date"
                    value={formData.checkout_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        checkout_date: e.target.value,
                      })
                    }
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
                      <SelectItem value="active">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value="vacated">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                          Vacated
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.status === "vacated" && (
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    <strong>Note:</strong> Changing status to "Vacated" will
                    free up a bed in the room and make it available for new
                    allocations. If checkout date is not set, it will be set to
                    today.
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Updating..." : "Update Allocation"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
