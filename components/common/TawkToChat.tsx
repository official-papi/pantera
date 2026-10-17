"use client";

import Script from "next/script";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}

export default function TawkToChat() {
  useEffect(() => {
    // Sync authenticated user info to Tawk.to if available
    const syncUser = async () => {
      try {
        const supabase = createClient();
        const res = await supabase.auth.getUser();
        const user = res.data?.user;
        if (!user) return;

        const identifyUser = () => {
          if (window.Tawk_API && typeof window.Tawk_API.setAttributes === "function") {
            window.Tawk_API.setAttributes(
              {
                name:
                  user.user_metadata?.full_name ||
                  user.email?.split("@")[0] ||
                  "Investor",
                email: user.email || "",
                id: user.id,
              },
              function () {}
            );
          }
        };

        if (window.Tawk_API) {
          const originalOnLoad = window.Tawk_API.onLoad;
          window.Tawk_API.onLoad = function () {
            if (typeof originalOnLoad === "function") originalOnLoad();
            identifyUser();
          };
          identifyUser();
        }
      } catch {
        // Non-critical background identification failure
      }
    };

    syncUser();
  }, []);

  return (
    <Script
      id="tawk-to-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          (function(){
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/6ad33e03f9130134c716a538/1k54ikg0t';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
}
