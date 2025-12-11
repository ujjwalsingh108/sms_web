"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function EditHostelPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    hostel_type: "",
    address: "",
    total_rooms: "",
    warden_name: "",
    warden_phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchHostel = async () => {
      const { data, error } = await supabase
        .from("hostels")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (error) {
        console.error("Error fetching hostel:", error);
        router.push("/dashboard/hostel/hostels");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hostel = data as any;
      setFormData({
        name: hostel.name || "",
        hostel_type: hostel.hostel_type || "",
        address: hostel.address || "",
        total_rooms: hostel.total_rooms?.toString() || "",
        warden_name: hostel.warden_name || "",
        warden_phone: hostel.warden_phone || "",
      });
      setFetching(false);
    };

    fetchHostel();
  }, [params.id, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("hostels") as any)
        .update({
          ...formData,
          total_rooms: parseInt(formData.total_rooms) || 0,
        })
        .eq("id", params.id as string);

      if (error) throw error;

      router.push(`/dashboard/hostel/hostels/${params.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating hostel:", error);
      alert("Failed to update hostel. Please try again.");
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
          <Link href={`/dashboard/hostel/hostels/${params.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Edit Hostel
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Hostel Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Hostel Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter hostel name"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="hostel_type"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Hostel Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.hostel_type}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, hostel_type: value })
                    }
                    required
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boys">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          Boys Hostel
                        </span>
                      </SelectItem>
                      <SelectItem value="girls">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                          Girls Hostel
                        </span>
                      </SelectItem>
                      <SelectItem value="mixed">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                          Mixed Hostel
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="total_rooms"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Total Rooms <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="total_rooms"
                    type="number"
                    min="0"
                    value={formData.total_rooms}
                    onChange={(e) =>
                      setFormData({ ...formData, total_rooms: e.target.value })
                    }
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter total rooms"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
                  placeholder="Enter hostel address..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="warden_name"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Warden Name
                  </Label>
                  <Input
                    id="warden_name"
                    value={formData.warden_name}
                    onChange={(e) =>
                      setFormData({ ...formData, warden_name: e.target.value })
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter warden name"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="warden_phone"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Warden Phone
                  </Label>
                  <Input
                    id="warden_phone"
                    type="tel"
                    value={formData.warden_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, warden_phone: e.target.value })
                    }
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Enter warden phone"
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
                  {loading ? "Updating..." : "Update Hostel"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
