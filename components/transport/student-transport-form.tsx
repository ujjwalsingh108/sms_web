"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createStudentTransport } from "@/app/dashboard/transport/actions";
import { Loader2, Bus, User, MapPin, Save } from "lucide-react";

type StudentTransportFormProps = {
  mode: "create";
};

export function StudentTransportForm({ mode }: StudentTransportFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  useEffect(() => {
    // Fetch students
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching students:", err);
        setStudents([]);
      });

    // Fetch routes
    fetch("/api/transport/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching routes:", err);
        setRoutes([]);
      });

    // Fetch academic years
    fetch("/api/academic-years")
      .then((res) => res.json())
      .then((data) => setAcademicYears(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching academic years:", err);
        setAcademicYears([]);
      });
  }, []);

  useEffect(() => {
    // Fetch stops for selected route
    if (selectedRoute) {
      fetch(`/api/transport/routes/${selectedRoute}/stops`)
        .then((res) => res.json())
        .then((data) => setStops(Array.isArray(data) ? data : []))
        .catch((err) => {
          console.error("Error fetching stops:", err);
          setStops([]);
        });
    } else {
      setStops([]);
    }
  }, [selectedRoute]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createStudentTransport(formData);
      router.push("/dashboard/transport/students");
    } catch (error) {
      console.error("Failed to create assignment:", error);
      alert("Failed to create assignment. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Selection */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="h-5 w-5 text-blue-500" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">Student *</Label>
            <Select name="student_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} (
                    {student.admission_no})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic_year_id">Academic Year *</Label>
            <Select name="academic_year_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name}
                    {year.is_current && (
                      <span className="ml-2 text-xs text-green-600">
                        (Current)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Route & Stop Selection */}
      <Card className="glass-effect border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Bus className="h-5 w-5 text-green-500" />
            Route Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="route_id">Route *</Label>
            <Select name="route_id" required onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.route_name} ({route.route_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stop_id">Stop *</Label>
            <Select name="stop_id" required disabled={!selectedRoute}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    selectedRoute ? "Select stop" : "Select a route first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {stops.map((stop) => (
                  <SelectItem key={stop.id} value={stop.id}>
                    {stop.stop_name} (Stop {stop.stop_order})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue="active">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Assign Student
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
