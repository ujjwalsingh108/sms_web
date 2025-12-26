"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOwnProfile } from "@/app/admin/sales-executives/actions";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  salesExecutive: any;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

export function SalesProfileEditForm({ salesExecutive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: salesExecutive.full_name,
    phone: salesExecutive.phone,
    alternatePhone: salesExecutive.alternate_phone || "",
    addressLine1: salesExecutive.address_line1,
    addressLine2: salesExecutive.address_line2 || "",
    city: salesExecutive.city,
    state: salesExecutive.state,
    postalCode: salesExecutive.postal_code,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateOwnProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-semibold text-gray-700"
            >
              Full Name *
            </Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              disabled
              value={salesExecutive.email}
              className="h-11 bg-gray-100 border-gray-300 text-gray-600"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-gray-700"
            >
              Phone *
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="alternatePhone"
              className="text-sm font-semibold text-gray-700"
            >
              Alternate Phone
            </Label>
            <Input
              id="alternatePhone"
              type="tel"
              value={formData.alternatePhone}
              onChange={(e) =>
                setFormData({ ...formData, alternatePhone: e.target.value })
              }
              className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="addressLine1"
            className="text-sm font-semibold text-gray-700"
          >
            Address Line 1 *
          </Label>
          <Input
            id="addressLine1"
            required
            value={formData.addressLine1}
            onChange={(e) =>
              setFormData({ ...formData, addressLine1: e.target.value })
            }
            className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="addressLine2"
            className="text-sm font-semibold text-gray-700"
          >
            Address Line 2
          </Label>
          <Input
            id="addressLine2"
            value={formData.addressLine2}
            onChange={(e) =>
              setFormData({ ...formData, addressLine2: e.target.value })
            }
            className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-sm font-semibold text-gray-700"
            >
              City *
            </Label>
            <Input
              id="city"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="state"
              className="text-sm font-semibold text-gray-700"
            >
              State *
            </Label>
            <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData({ ...formData, state: value })
              }
            >
              <SelectTrigger className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="postalCode"
              className="text-sm font-semibold text-gray-700"
            >
              Postal Code *
            </Label>
            <Input
              id="postalCode"
              required
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Assigned Region
            </Label>
            <Input
              disabled
              value={salesExecutive.assigned_region || "Not assigned"}
              className="h-11 bg-gray-100 border-gray-300 text-gray-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Commission Rate
            </Label>
            <Input
              disabled
              value={
                salesExecutive.commission_type === "percentage"
                  ? `${salesExecutive.commission_rate}%`
                  : `₹${salesExecutive.fixed_commission_amount?.toLocaleString(
                      "en-IN"
                    )}`
              }
              className="h-11 bg-gray-100 border-gray-300 text-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="h-11 px-6 border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Profile
        </Button>
      </div>
    </form>
  );
}
