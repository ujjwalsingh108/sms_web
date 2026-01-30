"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Phone, Mail, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteSupplier } from "@/app/dashboard/inventory/actions";
import { useRouter } from "next/navigation";
import type { Supplier } from "@/app/dashboard/inventory/actions";

interface SuppliersTableProps {
  suppliers: Supplier[];
}

export default function SuppliersTable({ suppliers }: SuppliersTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete supplier "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    const result = await deleteSupplier(id);
    setDeletingId(null);

    if (!result.success) {
      toast.error(result.error || "Failed to delete supplier");
    } else {
      router.refresh();
    }
  };

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No suppliers found</p>
        <p className="text-gray-400 text-sm mt-2">
          Add your first supplier to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Supplier Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Contact Person
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Phone
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900">{supplier.name}</p>
                  {supplier.address && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {supplier.address}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">
                    {supplier.contact_person || "—"}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">{supplier.phone || "—"}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">{supplier.email || "—"}</p>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    className={
                      supplier.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {supplier.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/inventory/suppliers/${supplier.id}/edit`}
                    >
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(supplier.id, supplier.name)}
                      disabled={deletingId === supplier.id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deletingId === supplier.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden space-y-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {supplier.name}
                </h3>
                {supplier.address && (
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {supplier.address}
                  </p>
                )}
              </div>
              <Badge
                className={
                  supplier.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {supplier.status}
              </Badge>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 pt-2 border-t">
              {supplier.contact_person && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">
                    {supplier.contact_person}
                  </span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a
                    href={`tel:${supplier.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {supplier.email}
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Link
                href={`/dashboard/inventory/suppliers/${supplier.id}/edit`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleDelete(supplier.id, supplier.name)}
                disabled={deletingId === supplier.id}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deletingId === supplier.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
