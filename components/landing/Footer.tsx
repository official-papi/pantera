"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart2, ShieldCheck, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/common/LanguageSelector";

export default function Footer() {
  const { t } = useLanguage();
  const [cms, setCms] = useState({
    support_email: "support@you-holder.com",
    support_phone: "+1 (800) 555-0100",
    support_address: "75 Wall Street, Financial District, New York, NY 10005",
    telegram_handle: "@youholder_official",
  });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("system_settings").select("*").single();
      if (data?.meta) setCms((prev) => ({ ...prev, ...data.meta }));
    })();
  }, []);

  return (
    <footer className="bg-[#050608] border-t border-white/[0.06] py-16 text-[13px] text-slate-400 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-[0_2px_10px_rgba(37,99,235,0.35)]">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                You-Holder<span className="text-blue-500">.</span>
              </span>
            </Link>
            
            <p className="text-slate-400 leading-relaxed text-xs">
              {t.footer?.description || "Institutional-grade Web3 yield generation, automated compounding, and multi-asset liquidity pools."}
            </p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Double-Entry Reconciled</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Yield Vaults", href: "#plans" },
                { label: "Services", href: "#services" },
                { label: "Why You-Holder", href: "#comparison" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Frequently Asked Questions", href: "/faq" },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group text-xs font-normal"
                  >
                    <ArrowRight className="w-3 h-3 text-blue-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Institutional Desk
            </h4>
            <ul className="space-y-3 text-slate-400 text-xs">
              <li className="flex items-center gap-2 font-normal hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{cms.support_email}</span>
              </li>
              <li className="flex items-center gap-2 font-normal hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{cms.support_phone}</span>
              </li>
              <li className="flex items-start gap-2 leading-snug">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{cms.support_address}</span>
              </li>
            </ul>
          </div>

          {/* Regional Settings */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Regional Preference
            </h4>
            <LanguageSelector variant="footer" dropDirection="up" />
            <p className="text-slate-500 leading-relaxed text-[11px] pt-1">
              Digital asset staking carries market volatility considerations. Yields are generated via institutional quantitative arbitrage and algorithmic liquidity provision.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} You-Holder Inc. All rights reserved.</span>
          <div className="flex gap-6 font-normal">
            <Link href="/faq" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/faq" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Support Desk</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
