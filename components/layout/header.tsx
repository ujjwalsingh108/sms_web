"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LogOut,
  Settings,
  User,
  Menu,
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
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

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

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  // For now, show all items. In production, filter by user role
  const userRole = "superadmin";

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-gradient-to-b from-slate-50 to-white"
            >
              <SheetHeader className="border-b border-gray-200 p-6 shadow-sm bg-white/50 backdrop-blur-sm">
                <SheetTitle className="text-left">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                    Smart School ERP
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Management System
                  </p>
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-100px)]">
                <nav className="flex flex-col p-3 space-y-1">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out",
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5 shrink-0 transition-transform duration-200",
                            isActive
                              ? "text-white"
                              : "text-gray-500 group-hover:text-blue-600 group-hover:scale-110"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Logo for mobile */}
          <h1 className="text-lg md:hidden font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Smart School ERP
          </h1>
        </div>

        <div className="flex-1">{/* Search or breadcrumbs can go here */}</div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
