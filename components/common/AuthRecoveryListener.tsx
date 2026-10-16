"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Global listener that detects password reset recovery tokens in the URL hash
 * or Supabase PASSWORD_RECOVERY auth state changes, and immediately routes
 * the user to the dedicated /reset-password page.
 */
export default function AuthRecoveryListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;

    // 1. Direct hash inspection (catches instant redirect when user lands on home page with #access_token=...&type=recovery)
    if (hash && (hash.includes("type=recovery") || (hash.includes("access_token=") && hash.includes("type=recovery")))) {
      if (pathname !== "/reset-password") {
        window.location.replace(`/reset-password${hash}`);
        return;
      }
    }

    // 2. Supabase auth event listener (catches client session detection)
    try {
      const supabase = createClient();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event: string) => {
        if (event === "PASSWORD_RECOVERY") {
          if (window.location.pathname !== "/reset-password") {
            const currentHash = window.location.hash;
            window.location.replace(`/reset-password${currentHash || ""}`);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.warn("[AuthRecoveryListener] Listener initialization warning:", e);
    }
  }, [pathname]);

  return null;
}
