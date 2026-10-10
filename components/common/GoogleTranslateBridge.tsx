"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslateBridge() {
  const { language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    // Define the initialization function for Google Translate
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
            },
            "google_translate_element"
          );
        }
      } catch (err) {
        console.error("Google translate init error:", err);
      }
    };

    if (window.google?.translate?.TranslateElement && !document.querySelector(".goog-te-combo")) {
      window.googleTranslateElementInit();
    }
  }, []);

  // Multi-pass trigger when language OR route (pathname) changes
  useEffect(() => {
    try {
      const targetLang = language === "en" ? "/en/en" : `/en/${language}`;
      document.cookie = `googtrans=${targetLang}; path=/;`;
      document.cookie = `googtrans=${targetLang}; path=/; domain=${window.location.hostname};`;

      if (window.location.hostname !== "localhost" && !window.location.hostname.includes("127.0.0.1")) {
        const parts = window.location.hostname.split(".");
        if (parts.length >= 2) {
          const rootDomain = parts.slice(-2).join(".");
          if (!rootDomain.endsWith("vercel.app")) {
            document.cookie = `googtrans=${targetLang}; path=/; domain=.${rootDomain};`;
          }
        }
      }

      const applyTranslation = () => {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
        if (select) {
          select.value = language;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };

      // Fire immediately and with staggered delays to catch async React hydration on page transitions
      applyTranslation();
      const t1 = setTimeout(applyTranslation, 150);
      const t2 = setTimeout(applyTranslation, 450);
      const t3 = setTimeout(applyTranslation, 900);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } catch (e) {
      console.error("Error setting translation cookie or event", e);
    }
  }, [language, pathname]);

  return (
    <>
      <div
        id="google_translate_element"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-10000px",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
