"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  GraduationCap,
} from "lucide-react";
import type { StudentWithDetails } from "@/lib/types/modules";

interface StudentDetailViewProps {
  student: StudentWithDetails;
}

export function StudentDetailView({ student }: StudentDetailViewProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      graduated: "bg-purple-100 text-purple-800",
      transferred: "bg-blue-100 text-blue-800",
    };

    return (
      <Badge
        variant="outline"
        className={variants[status] || "bg-gray-100 text-gray-800"}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  {student.first_name} {student.last_name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Admission No: {student.admission_no}
                </p>
                <div className="mt-2">{getStatusBadge(student.status)}</div>
              </div>
            </div>
            <Link href={`/dashboard/students/${student.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Student
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  First Name
                </p>
                <p className="text-base">{student.first_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Name
                </p>
                <p className="text-base">{student.last_name}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base">
                    {formatDate(student.date_of_birth)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Gender
                </p>
                <p className="text-base capitalize">{student.gender || "-"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Blood Group
              </p>
              <p className="text-base">{student.blood_group || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              {student.email ? (
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${student.email}`}
                    className="text-base text-blue-600 hover:underline"
                  >
                    {student.email}
                  </a>
                </div>
              ) : (
                <p className="text-base">-</p>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              {student.phone ? (
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${student.phone}`}
                    className="text-base text-blue-600 hover:underline"
                  >
                    {student.phone}
                  </a>
                </div>
              ) : (
                <p className="text-base">-</p>
              )}
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              {student.address ? (
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <p className="text-base">{student.address}</p>
                </div>
              ) : (
                <p className="text-base">-</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Class
                </p>
                <p className="text-base">{student.class?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Section
                </p>
                <p className="text-base">{student.section?.name || "-"}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Admission Date
                </p>
                <p className="text-base">
                  {formatDate(student.admission_date)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div className="mt-1">{getStatusBadge(student.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guardians Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guardians
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.guardians && student.guardians.length > 0 ? (
              <div className="space-y-4">
                {student.guardians
                  .filter((g) => !g.is_deleted)
                  .map((guardian, index) => (
                    <div
                      key={guardian.id}
                      className={index > 0 ? "pt-4 border-t" : ""}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{guardian.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {guardian.relationship || "Guardian"}
                            {guardian.is_primary && " (Primary)"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        {guardian.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={`tel:${guardian.phone}`}
                              className="text-blue-600 hover:underline"
                            >
                              {guardian.phone}
                            </a>
                          </div>
                        )}
                        {guardian.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <a
                              href={`mailto:${guardian.email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {guardian.email}
                            </a>
                          </div>
                        )}
                        {guardian.occupation && (
                          <p className="text-sm text-muted-foreground">
                            {guardian.occupation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No guardian information available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
