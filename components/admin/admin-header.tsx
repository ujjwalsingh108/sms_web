"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsDrawer } from "@/components/admin/notifications-drawer";
import type { User } from "@supabase/supabase-js";

interface AdminHeaderProps {
  title: string;
  description?: string;
  user?: User | null;
}

export function AdminHeader({ title, description, user }: AdminHeaderProps) {
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0].toUpperCase() || "N";

  return (
    <header className="bg-white border-b sticky top-0 lg:top-0 z-30 mt-14 lg:mt-0">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Search - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
            </div>

            {/* Notifications */}
            <NotificationsDrawer />

            {/* User Avatar */}
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
