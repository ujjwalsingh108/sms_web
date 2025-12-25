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
import { Loader2 } from "lucide-react";
import {
  createSection,
  ClassWithSections,
} from "@/app/dashboard/academic/actions";
import { toast } from "sonner";

interface CreateSectionFormProps {
  classes: ClassWithSections[];
}

export function CreateSectionForm({ classes }: CreateSectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    class_id: "",
    name: "",
    room_number: "",
    capacity: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createSection({
        class_id: formData.class_id,
        name: formData.name,
        room_number: formData.room_number || undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      });

      if (result.success) {
        toast.success("Section created successfully!");
        router.push("/dashboard/academic");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create section");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="class_id" className="text-sm font-medium">
            Class <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.class_id}
            onValueChange={(value) =>
              setFormData({ ...formData, class_id: value })
            }
            required
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Section Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., A, B, C, Alpha, Beta"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="room_number" className="text-sm font-medium">
              Room Number
            </Label>
            <Input
              id="room_number"
              placeholder="e.g., Room 101"
              value={formData.room_number}
              onChange={(e) =>
                setFormData({ ...formData, room_number: e.target.value })
              }
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity" className="text-sm font-medium">
              Capacity
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 40"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="h-11"
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Section"
          )}
        </Button>
      </div>
    </form>
  );
}
