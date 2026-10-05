"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { SUPPORTED_LANGUAGES, LanguageOption } from "@/lib/i18n/translations";
import { Globe, ChevronDown, Check, Search, X } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "default" | "compact" | "minimal" | "footer";
  className?: string;
  dropDirection?: "up" | "down";
}

export default function LanguageSelector({
  variant = "default",
  className = "",
  dropDirection = "down",
}: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: LanguageOption) => {
    setLanguage(lang.code);
    setIsOpen(false);
    setSearch("");
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      {variant === "compact" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Select Language"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all border border-slate-200 cursor-pointer shadow-xs"
        >
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <span className="uppercase text-[11px] font-bold">{currentLang.code.split("-")[0]}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "minimal" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Select Language"
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all cursor-pointer"
        >
          <span className="text-base leading-none">{currentLang.flag}</span>
        </button>
      )}

      {variant === "footer" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Select Language"
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#15182B] hover:bg-[#1C2038] border border-[#232742] text-slate-300 font-medium text-xs transition-all cursor-pointer shadow-xs font-mono"
        >
          <Globe className="w-3.5 h-3.5 text-[#E9B737]" />
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <span>{currentLang.nativeName}</span>
          <ChevronDown className={`w-3 h-3 text-[#E9B737] ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {variant === "default" && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Select Language"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-[#E2E4EC] text-slate-700 font-semibold text-xs transition-all shadow-xs cursor-pointer group font-mono"
        >
          <span className="text-sm leading-none">{currentLang.flag}</span>
          <span className="text-[12px] text-slate-800">{currentLang.nativeName}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 w-60 rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/10 border border-slate-200 transition-all animate-in fade-in-50 zoom-in-95 ${
            dropDirection === "up" ? "bottom-full mb-2 left-0" : "top-full mt-2 right-0 md:right-0 left-auto"
          }`}
        >
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1.5 font-mono">
            <span>Translate / Idiomas</span>
            <span className="text-[#E9B737] font-semibold">{SUPPORTED_LANGUAGES.length} Languages</span>
          </div>

          {/* Quick Search */}
          <div className="relative mb-1.5 px-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language…"
              className="w-full pl-7 pr-7 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#15182B] focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
            {filteredLanguages.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 font-mono">
                No matching language
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#15182B]/6 text-[#15182B] font-bold font-mono"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div>
                        <span className="block text-[13px] leading-tight font-medium">
                          {lang.nativeName}
                        </span>
                        <span className="block text-[10px] text-slate-400">{lang.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E9B737] font-bold flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
