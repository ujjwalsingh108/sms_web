"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

interface AttendanceFiltersProps {
  classes: { id: string; name: string }[];
}

export default function AttendanceFilters({ classes }: AttendanceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);

  const [filters, setFilters] = useState({
    date: searchParams.get("date") || new Date().toISOString().split("T")[0],
    class_id: searchParams.get("class_id") || "",
    section_id: searchParams.get("section_id") || "",
    status: searchParams.get("status") || "",
  });

  useEffect(() => {
    if (filters.class_id) {
      loadSections(filters.class_id);
    } else {
      setSections([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.class_id]);

  const loadSections = async (classId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("sections")
      .select("id, name")
      .eq("class_id", classId)
      .order("name");

    setSections(data || []);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "class_id" && { section_id: "" }), // Reset section when class changes
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`/dashboard/attendance?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      date: new Date().toISOString().split("T")[0],
      class_id: "",
      section_id: "",
      status: "",
    });
    router.push("/dashboard/attendance");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Date</label>
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Class</label>
          <Select
            value={filters.class_id || "all"}
            onValueChange={(value) =>
              handleFilterChange("class_id", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Section</label>
          <Select
            value={filters.section_id || "all"}
            onValueChange={(value) =>
              handleFilterChange("section_id", value === "all" ? "" : value)
            }
            disabled={!filters.class_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              handleFilterChange("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="half_day">Half Day</SelectItem>
              <SelectItem value="late">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={applyFilters} className="flex-1">
            Apply
          </Button>
          <Button onClick={clearFilters} variant="outline">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
