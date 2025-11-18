"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Bus,
  DollarSign,
  BookOpen,
  ClipboardList,
  Calendar,
  Package,
  Calculator,
  Heart,
  Shield,
  Building,
  UtensilsCrossed,
  UserCog,
  FileText,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "superadmin",
      "admin",
      "teacher",
      "accountant",
      "librarian",
      "parent",
      "student",
      "driver",
    ],
  },
  {
    name: "Admission",
    href: "/dashboard/admission",
    icon: GraduationCap,
    roles: ["superadmin", "admin"],
  },
  {
    name: "Students",
    href: "/dashboard/students",
    icon: Users,
    roles: ["superadmin", "admin", "teacher"],
  },
  {
    name: "Staff",
    href: "/dashboard/staff",
    icon: UserCog,
    roles: ["superadmin", "admin"],
  },
  {
    name: "Transport",
    href: "/dashboard/transport",
    icon: Bus,
    roles: ["superadmin", "admin", "driver"],
  },
  {
    name: "Fee Management",
    href: "/dashboard/fees",
    icon: DollarSign,
    roles: ["superadmin", "admin", "accountant"],
  },
  {
    name: "Library",
    href: "/dashboard/library",
    icon: BookOpen,
    roles: ["superadmin", "admin", "librarian", "teacher", "student"],
  },
  {
    name: "Examinations",
    href: "/dashboard/exams",
    icon: FileText,
    roles: ["superadmin", "admin", "teacher"],
  },
  {
    name: "Attendance",
    href: "/dashboard/attendance",
    icon: ClipboardList,
    roles: ["superadmin", "admin", "teacher"],
  },
  {
    name: "Timetable",
    href: "/dashboard/timetable",
    icon: Calendar,
    roles: ["superadmin", "admin", "teacher", "student"],
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
    roles: ["superadmin", "admin", "accountant"],
  },
  {
    name: "Accounts",
    href: "/dashboard/accounts",
    icon: Calculator,
    roles: ["superadmin", "admin", "accountant"],
  },
  {
    name: "Infirmary",
    href: "/dashboard/infirmary",
    icon: Heart,
    roles: ["superadmin", "admin"],
  },
  {
    name: "Security",
    href: "/dashboard/security",
    icon: Shield,
    roles: ["superadmin", "admin"],
  },
  {
    name: "Hostel",
    href: "/dashboard/hostel",
    icon: Building,
    roles: ["superadmin", "admin"],
  },
  {
    name: "Mess",
    href: "/dashboard/mess",
    icon: UtensilsCrossed,
    roles: ["superadmin", "admin"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  // For now, show all items. In production, filter by user role
  const userRole = "superadmin"; // This should come from user context

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col grow bg-white border-r border-gray-200 pt-5 overflow-y-auto">
        <div className="flex items-center shrink-0 px-4">
          <h1 className="text-2xl font-bold text-blue-600">School ERP</h1>
        </div>
        <ScrollArea className="grow mt-5">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 shrink-0",
                      isActive
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
