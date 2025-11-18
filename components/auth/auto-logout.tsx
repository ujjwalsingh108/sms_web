"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const SESSION_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
const CHECK_INTERVAL = 60 * 1000; // Check every minute

export function AutoLogout() {
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    // Update last activity time on user interactions
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      warningShownRef.current = false;
    };

    // Events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check session timeout periodically
    const checkTimeout = async () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      const timeUntilTimeout = SESSION_TIMEOUT - timeSinceLastActivity;

      // Show warning 5 minutes before timeout
      if (
        timeUntilTimeout <= WARNING_TIME &&
        timeUntilTimeout > 0 &&
        !warningShownRef.current
      ) {
        warningShownRef.current = true;
        const minutesLeft = Math.ceil(timeUntilTimeout / 60000);
        toast.warning(
          `Your session will expire in ${minutesLeft} minute${
            minutesLeft !== 1 ? "s" : ""
          } due to inactivity.`,
          {
            duration: 10000,
          }
        );
      }

      // Logout if timeout reached
      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        await supabase.auth.signOut();
        toast.error("You have been logged out due to inactivity");
        router.push("/login");
      }
    };

    // Start checking timeout
    timeoutIdRef.current = setInterval(checkTimeout, CHECK_INTERVAL);

    // Initial activity timestamp
    updateActivity();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
      if (timeoutIdRef.current) {
        clearInterval(timeoutIdRef.current);
      }
    };
  }, [router]);

  return null;
}
