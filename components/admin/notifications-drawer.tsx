"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  School,
  Activity,
  Info,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  action_url: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export function NotificationsDrawer() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      const typedData = data as Notification[];
      setNotifications(typedData);
      setUnreadCount(typedData.filter((n) => !n.read).length);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ read: true } as never)
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true } as never)
      .eq("user_id", user.id)
      .eq("read", false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } else {
      toast.error("Failed to mark all as read");
    }

    setIsLoading(false);
  };

  const deleteNotification = async (notificationId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notification deleted");
    } else {
      toast.error("Failed to delete notification");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "school_created":
      case "school_updated":
      case "school_deleted":
        return <School className="h-5 w-5 text-blue-600" />;
      case "activity":
        return <Activity className="h-5 w-5 text-green-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "school_created":
        return "bg-blue-50 border-blue-200";
      case "school_updated":
        return "bg-yellow-50 border-yellow-200";
      case "school_deleted":
        return "bg-red-50 border-red-200";
      case "activity":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={isLoading}
                className="h-8 text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "You're all caught up!"}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">
                You&apos;ll see notifications here when activity happens
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative border rounded-lg p-4 transition-all ${
                    notification.read
                      ? "bg-white border-gray-200 opacity-70"
                      : getNotificationColor(notification.type)
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1 -mr-2"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(
                            new Date(notification.created_at),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.action_url && (
                            <Link href={notification.action_url}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setOpen(false)}
                              >
                                View
                              </Button>
                            </Link>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="absolute top-4 right-4 h-2 w-2 bg-blue-600 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
