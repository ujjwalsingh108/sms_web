"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  createSupplier,
  updateSupplier,
} from "@/app/dashboard/inventory/actions";
import type { Supplier } from "@/app/dashboard/inventory/actions";
import { Save } from "lucide-react";

interface SupplierFormProps {
  supplier?: Supplier;
}

export default function SupplierForm({ supplier }: SupplierFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const data = {
      name: formData.get("name") as string,
      contact_person: formData.get("contact_person") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      status: formData.get("status") as string,
    };

    const result = supplier
      ? await updateSupplier(supplier.id, data)
      : await createSupplier(data);

    setLoading(false);

    if (result.success) {
      router.push("/dashboard/inventory/suppliers");
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Supplier Name */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">
            Supplier Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., ABC Stationery Suppliers"
            defaultValue={supplier?.name}
            required
            disabled={loading}
          />
        </div>

        {/* Contact Person */}
        <div className="space-y-2">
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            name="contact_person"
            type="text"
            placeholder="e.g., John Doe"
            defaultValue={supplier?.contact_person || ""}
            disabled={loading}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g., +91 9876543210"
            defaultValue={supplier?.phone || ""}
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g., contact@supplier.com"
            defaultValue={supplier?.email || ""}
            disabled={loading}
          />
        </div>

        {/* Status */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <select
            id="status"
            name="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={supplier?.status || "active"}
            required
            disabled={loading}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Complete supplier address (optional)"
          rows={3}
          defaultValue={supplier?.address || ""}
          disabled={loading}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1 sm:flex-none"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading
            ? "Saving..."
            : supplier
            ? "Update Supplier"
            : "Create Supplier"}
        </Button>
      </div>
    </form>
  );
}
