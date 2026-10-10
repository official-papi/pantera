"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, SUPPORTED_LANGUAGES, translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)["en"];
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
  dir: "ltr",
});

const NATIVE_LANGS = ["en", "es", "fr", "de", "pt", "ar"];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("alpha_language") as Language | null;
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
      } else {
        const browserLang = navigator.language?.slice(0, 2) as Language;
        if (browserLang && SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
          setLanguageState(browserLang);
        }
      }
    } catch (e) {
      console.error("Failed to read language from localStorage", e);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    const isRtl = ["ar", "fa", "ur", "he"].includes(lang);
    setLanguageState(lang);
    try {
      localStorage.setItem("alpha_language", lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = isRtl ? "rtl" : "ltr";

      const target = lang === "en" ? "/en/en" : `/en/${lang}`;
      document.cookie = `googtrans=${target}; path=/;`;
      document.cookie = `googtrans=${target}; path=/; domain=${window.location.hostname};`;

      if (window.location.hostname !== "localhost" && !window.location.hostname.includes("127.0.0.1")) {
        const parts = window.location.hostname.split(".");
        if (parts.length >= 2) {
          const rootDomain = parts.slice(-2).join(".");
          if (!rootDomain.endsWith("vercel.app")) {
            document.cookie = `googtrans=${target}; path=/; domain=.${rootDomain};`;
          }
        }
      }

      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
      } else if (!NATIVE_LANGS.includes(lang)) {
        // If selecting a non-native dictionary language and Google Translate isn't ready, reload with cookie
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    } catch (e) {
      console.error("Failed to save language to localStorage", e);
    }
  };

  const isRtl = ["ar", "fa", "ur", "he"].includes(language);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
      document.documentElement.dir = isRtl ? "rtl" : "ltr";
    }
  }, [language, mounted, isRtl]);

  const activeTranslations = (translations as Record<string, any>)[language] || translations.en;
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: activeTranslations,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
