"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { validateSubdomain } from "@/lib/utils/validation";

export function CreateSchoolForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null
  );

  const [formData, setFormData] = useState({
    school_name: "",
    subdomain: "",
    admin_email: "",
    admin_password: "",
    phone: "",
    address: "",
    subscription_plan: "trial" as "trial" | "basic" | "standard" | "premium",
    max_students: 100,
    max_staff: 20,
  });

  const checkIdentifierAvailability = async (identifier: string) => {
    if (!identifier) {
      setSubdomainAvailable(null);
      return;
    }

    const validation = validateSubdomain(identifier);
    if (!validation.valid) {
      setError(validation.error || "Invalid identifier");
      setSubdomainAvailable(false);
      return;
    }

    setSubdomainChecking(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: checkError } = await supabase
        .from("school_instances")
        .select("subdomain")
        .eq("subdomain", identifier)
        .single();

      if (checkError && checkError.code === "PGRST116") {
        // No rows returned - identifier is available
        setSubdomainAvailable(true);
      } else if (data) {
        setSubdomainAvailable(false);
        setError("This school identifier is already taken");
      }
    } catch (err) {
      console.error("Error checking identifier:", err);
    } finally {
      setSubdomainChecking(false);
    }
  };

  const handleIdentifierChange = (value: string) => {
    const lowercase = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, subdomain: lowercase });

    // Debounce the check
    const timer = setTimeout(() => {
      checkIdentifierAvailability(lowercase);
    }, 500);

    return () => clearTimeout(timer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      // Get current user (superadmin)
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error("Not authenticated");
      }

      // 1. Create tenant (school)
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          name: formData.school_name,
          email: formData.admin_email,
          phone: formData.phone || null,
          address: formData.address || null,
        } as never)
        .select()
        .single();

      if (tenantError) throw tenantError;

      // 2. Create school admin user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.admin_email,
        password: formData.admin_password,
        options: {
          data: {
            full_name: `${formData.school_name} Admin`,
            role: "admin",
          },
        },
      });

      if (authError) throw authError;

      // 3. Get admin role for school administrator
      const { data: adminRole } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "admin")
        .single();

      if (!adminRole) throw new Error("Admin role not found");

      const typedAdminRole = adminRole as { id: string };

      // 4. Create member entry linking user to tenant
      if (authData.user) {
        const typedTenant = tenant as { id: string };
        const { error: memberError } = await supabase.from("members").insert({
          user_id: authData.user.id,
          tenant_id: typedTenant.id,
          role_id: typedAdminRole.id,
          status: "approved",
        } as never);

        if (memberError) throw memberError;
      }

      // 5. Create school instance record
      const typedTenantForInstance = tenant as { id: string };
      const { error: instanceError } = await supabase
        .from("school_instances")
        .insert({
          tenant_id: typedTenantForInstance.id,
          subdomain: formData.subdomain,
          school_name: formData.school_name,
          admin_email: formData.admin_email,
          admin_user_id: authData.user?.id || null,
          status: "active",
          setup_completed: false,
          subscription_plan: formData.subscription_plan,
          max_students: formData.max_students,
          max_staff: formData.max_staff,
          created_by: currentUser.id, // Add created_by field
        } as never);

      if (instanceError) throw instanceError;

      // Success!
      router.push("/admin/schools");
      router.refresh();
    } catch (err) {
      console.error("Error creating school:", err);
      setError(err instanceof Error ? err.message : "Failed to create school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* School Name */}
      <div className="space-y-2">
        <Label htmlFor="school_name">
          School Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="school_name"
          value={formData.school_name}
          onChange={(e) =>
            setFormData({ ...formData, school_name: e.target.value })
          }
          placeholder="e.g., DPS Ranchi"
          required
        />
      </div>

      {/* School Subdomain */}
      <div className="space-y-2">
        <Label htmlFor="subdomain">
          School Subdomain <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="subdomain"
            value={formData.subdomain}
            onChange={(e) => handleIdentifierChange(e.target.value)}
            placeholder="e.g., dps-ranchi"
            required
            className="flex-1"
          />
          <span className="text-gray-600">.smartschoolerp.xyz</span>
          {subdomainChecking && <Loader2 className="h-5 w-5 animate-spin" />}
          {!subdomainChecking && subdomainAvailable === true && (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
          {!subdomainChecking && subdomainAvailable === false && (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </div>
        <p className="text-sm text-gray-600">
          School will be accessible at:{" "}
          <strong>
            {formData.subdomain || "[subdomain]"}.smartschoolerp.xyz
          </strong>
        </p>
      </div>

      {/* Admin Email */}
      <div className="space-y-2">
        <Label htmlFor="admin_email">
          Admin Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="admin_email"
          type="email"
          value={formData.admin_email}
          onChange={(e) =>
            setFormData({ ...formData, admin_email: e.target.value })
          }
          placeholder="admin@school.com"
          required
        />
        <p className="text-sm text-gray-600">
          This email will be used for school admin login
        </p>
      </div>

      {/* Admin Password */}
      <div className="space-y-2">
        <Label htmlFor="admin_password">
          Admin Password <span className="text-red-500">*</span>
        </Label>
        <Input
          id="admin_password"
          type="password"
          value={formData.admin_password}
          onChange={(e) =>
            setFormData({ ...formData, admin_password: e.target.value })
          }
          placeholder="Minimum 6 characters"
          minLength={6}
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+91 1234567890"
        />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          placeholder="School address"
          rows={3}
        />
      </div>

      {/* Subscription Plan */}
      <div className="space-y-2">
        <Label htmlFor="subscription_plan">Subscription Plan</Label>
        <Select
          value={formData.subscription_plan}
          onValueChange={(value: any) =>
            setFormData({ ...formData, subscription_plan: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trial">Trial (Free)</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Max Students/Staff */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="max_students">Max Students</Label>
          <Input
            id="max_students"
            type="number"
            value={formData.max_students}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_students: parseInt(e.target.value),
              })
            }
            min={1}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_staff">Max Staff</Label>
          <Input
            id="max_staff"
            type="number"
            value={formData.max_staff}
            onChange={(e) =>
              setFormData({
                ...formData,
                max_staff: parseInt(e.target.value),
              })
            }
            min={1}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !subdomainAvailable}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create School
        </Button>
      </div>
    </form>
  );
}
