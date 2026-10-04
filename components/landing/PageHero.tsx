"use client";

import Link from "next/link";
import { ChevronRight, Sparkles, LucideIcon, ArrowRight, ShieldCheck, TrendingUp, CheckCircle2, Lock } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
}

interface PageHeroProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  icon?: LucideIcon;
  breadcrumb: string;
  stats?: StatItem[];
  ctaText?: string;
  ctaHref?: string;
  hudContent?: React.ReactNode;
}

export default function PageHero({
  badge = "Institutional Vehicle",
  title,
  titleHighlight,
  subtitle,
  icon: Icon = Sparkles,
  breadcrumb,
  stats = [
    { label: "Capital Deployed", value: "$5.2B+" },
    { label: "Payout Cadence", value: "Daily 100%" },
    { label: "Audit Standard", value: "On-Chain Solvency" },
  ],
  ctaText = "Deploy Capital Now",
  ctaHref = "/register",
  hudContent,
}: PageHeroProps) {
  return (
    <section className="relative py-16 sm:py-20 bg-[#15182B] text-white border-b border-[#232742] overflow-hidden">
      
      {/* Pantera Generative Coordinate Grid & Ambient Topological Texture */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pantera-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#E2E4EC" strokeWidth="0.5" strokeOpacity="0.3" />
              <circle cx="48" cy="0" r="1" fill="#E9B737" fillOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pantera-grid)" />
        </svg>
      </div>

      {/* Ambient Gradient Radiance */}
      <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#E9B737]/10 via-[#15182B]/0 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-32 bg-gradient-to-t from-[#0E101D] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Institutional Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#232742]">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">Pantera</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-400">Protocol</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#E9B737] font-bold">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-500">COORD:</span>
              <span className="text-slate-300">37°46&apos;N // 122°25&apos;W</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0E101D] border border-[#232742] text-slate-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
              <span>LIVE SYSTEM V2.6</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* LEFT COLUMN: Narrative & Institutional Action (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Category Identity Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0E101D] border border-[#E9B737]/30 text-[#E9B737] font-mono text-xs font-semibold uppercase tracking-wider shadow-xs">
              <Icon className="w-3.5 h-3.5 text-[#E9B737]" />
              <span>[ 01 // {badge} ]</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black font-display uppercase tracking-tight text-white leading-[1.08]">
              {title}{" "}
              {titleHighlight && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0B3] to-[#E9B737]">
                  {titleHighlight}
                </span>
              )}
              <span className="text-[#E9B737]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-sans font-normal leading-relaxed max-w-xl">
              {subtitle}
            </p>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={ctaHref}
                className="px-7 py-3.5 rounded-md text-xs font-bold flex items-center space-x-2 bg-[#E9B737] hover:bg-[#D4A42C] text-[#15182B] font-mono uppercase tracking-wider shadow-md shadow-[#E9B737]/20 transition-all cursor-pointer"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#15182B]" />
              </Link>
              <Link
                href="/plans"
                className="px-6 py-3.5 rounded-md text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-[#E9B737] transition-all font-mono uppercase tracking-wider"
              >
                Explore Active Funds
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Institutional Telemetry Console (5 Cols) */}
          <div className="lg:col-span-5 relative">
            {hudContent ? (
              hudContent
            ) : (
              <div className="relative rounded-2xl bg-[#0E101D] border border-[#232742] p-6 shadow-2xl space-y-5">
                
                {/* Console Top Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#232742]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E9B737]" />
                    <span className="font-mono text-xs text-white font-bold uppercase tracking-wider">
                      PANTERA AUDIT CONSOLE
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#E9B737] bg-[#15182B] px-2 py-0.5 rounded border border-[#E9B737]/30 uppercase font-semibold">
                    REALTIME
                  </span>
                </div>

                {/* Key Stat Blocks */}
                <div className="space-y-2.5">
                  {stats.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#15182B] border border-[#232742] flex items-center justify-between transition-colors hover:border-[#E9B737]/40"
                    >
                      <span className="text-xs text-slate-400 font-sans">{s.label}</span>
                      <span className="font-mono font-bold text-white text-sm tracking-tight">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Verification Stamp */}
                <div className="pt-2 border-t border-[#232742] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cryptographic Ledger Verified</span>
                  </div>
                  <span className="text-slate-500">EST. 2013</span>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
