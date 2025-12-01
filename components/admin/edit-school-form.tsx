"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { updateSchool } from "@/app/admin/schools/actions";

interface EditSchoolFormProps {
  school: {
    id: string;
    school_name: string;
    subdomain: string;
    status: string;
    subscription_plan: string;
    max_students: number;
    max_staff: number;
    setup_completed: boolean;
    tenant_id: string;
    tenant: {
      name: string;
      email: string;
      phone: string | null;
      address: string | null;
    };
  };
}

export function EditSchoolForm({ school }: EditSchoolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    school_name: school.school_name,
    status: school.status,
    subscription_plan: school.subscription_plan,
    max_students: school.max_students,
    max_staff: school.max_staff,
    tenant_name: school.tenant.name,
    tenant_phone: school.tenant.phone || "",
    tenant_address: school.tenant.address || "",
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateSchool(
        school.id,
        school.tenant_id,
        {
          school_name: formData.school_name,
          status: formData.status,
          subscription_plan: formData.subscription_plan,
          max_students: formData.max_students,
          max_staff: formData.max_staff,
          tenant_name: formData.tenant_name,
          tenant_phone: formData.tenant_phone,
          tenant_address: formData.tenant_address,
        },
        {
          school_name: school.school_name,
          status: school.status,
          subscription_plan: school.subscription_plan,
          max_students: school.max_students,
          max_staff: school.max_staff,
          subdomain: school.subdomain,
          tenant: school.tenant,
        }
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("School updated", {
        description: "School details have been successfully updated.",
      });

      router.push("/admin/schools");
      router.refresh();
    } catch (error) {
      console.error("Error updating school:", error);
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update school. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subdomain - Read Only */}
          <div>
            <Label htmlFor="subdomain">Subdomain</Label>
            <Input
              id="subdomain"
              value={school.subdomain}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Subdomain cannot be changed after creation
            </p>
          </div>

          {/* School Name */}
          <div>
            <Label htmlFor="school_name">
              School Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="school_name"
              value={formData.school_name}
              onChange={(e) =>
                setFormData({ ...formData, school_name: e.target.value })
              }
              required
            />
          </div>

          {/* Tenant Name */}
          <div>
            <Label htmlFor="tenant_name">
              Organization Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tenant_name"
              value={formData.tenant_name}
              onChange={(e) =>
                setFormData({ ...formData, tenant_name: e.target.value })
              }
              required
            />
          </div>

          {/* Contact Info - Read Only */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={school.tenant.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Contact email cannot be changed
            </p>
          </div>

          <div>
            <Label htmlFor="tenant_phone">Phone</Label>
            <Input
              id="tenant_phone"
              type="tel"
              value={formData.tenant_phone}
              onChange={(e) =>
                setFormData({ ...formData, tenant_phone: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="tenant_address">Address</Label>
            <Input
              id="tenant_address"
              value={formData.tenant_address}
              onChange={(e) =>
                setFormData({ ...formData, tenant_address: e.target.value })
              }
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Plan */}
          <div>
            <Label htmlFor="subscription_plan">
              Subscription Plan <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.subscription_plan}
              onValueChange={(value) =>
                setFormData({ ...formData, subscription_plan: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_students">
                Max Students <span className="text-red-500">*</span>
              </Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                value={formData.max_students}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_students: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="max_staff">
                Max Staff <span className="text-red-500">*</span>
              </Label>
              <Input
                id="max_staff"
                type="number"
                min="1"
                value={formData.max_staff}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_staff: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/schools")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
