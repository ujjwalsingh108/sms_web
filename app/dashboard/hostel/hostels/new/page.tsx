"use client";

import { useState } from "react";
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
import { ArrowLeft, Save, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewHostelPage() {
  const router = useRouter();
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
      const { error } = await (supabase.from("hostels") as any).insert([
        {
          ...formData,
          total_rooms: parseInt(formData.total_rooms) || 0,
          tenant_id: (tenantData as any)?.tenant_id,
        },
      ]);

      if (error) throw error;

      router.push("/dashboard/hostel/hostels");
      router.refresh();
    } catch (error) {
      console.error("Error creating hostel:", error);
      alert("Failed to create hostel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/hostel/hostels">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Hostel
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
                  {loading ? "Creating..." : "Create Hostel"}
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
                    Hostel Management Guidelines:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    <li>
                      Specify the total number of rooms available in the hostel
                    </li>
                    <li>
                      Assign a warden to manage and oversee hostel operations
                    </li>
                    <li>
                      Ensure contact information is accurate for emergencies
                    </li>
                    <li>
                      You can add individual rooms after creating the hostel
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
