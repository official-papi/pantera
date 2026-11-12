"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, ArrowRight, Menu, X, LayoutDashboard, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import LanguageSelector from "@/components/common/LanguageSelector";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get current session on mount
    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      setUser(data?.session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: "Yield Vaults", href: "#plans" },
    { label: "Services", href: "#services" },
    { label: "Why YouHodler", href: "#comparison" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#08090C]/90 backdrop-blur-xl border-b border-white/[0.06]">
      
      {/* ── Subdued Institutional Announcement Ribbon ── */}
      <div className="bg-[#050608] text-slate-400 px-4 py-1.5 text-center text-xs border-b border-white/[0.04] flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Protocol Status: Normal
        </span>
        <span className="hidden sm:inline text-white/10">•</span>
        <span className="hidden sm:inline text-slate-400">All liquidity vaults active with automated weekly distribution</span>
        <span className="hidden sm:inline text-white/10">•</span>
        <Link href="#plans" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          View Current Tiers →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_2px_10px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white" stroke="currentColor">
              <rect x="5" y="7" width="5" height="12" rx="2.5" fill="currentColor" stroke="none" />
              <rect x="14" y="3" width="5" height="16" rx="2.5" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            YouHodler<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs & Language Selector */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector variant="default" />

          {authLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          ) : user ? (
            /* ── Logged In ── */
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.nav.myDashboard}</span>
            </Link>
          ) : (
            /* ── Guest ── */
            <>
              <Link
                href="/login"
                className="text-[13px] font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
            className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white focus:outline-none"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-[#08090C] border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/[0.04]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-center text-xs font-semibold"
              >
                {t.nav.myDashboard}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-white/[0.05] text-white text-center text-xs font-medium"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-center text-xs font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
