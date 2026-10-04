"use client";

import Link from "next/link";
import { ChevronRight, Sparkles, LucideIcon, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

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
}: PageHeroProps) {
  return (
    <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 bg-[#0A0C16] text-white border-b border-[#232742] overflow-hidden">
      
      {/* Layer 1: Rich Multi-stop Radial Ambient Gradient */}
      <div className="absolute inset-0 pointer-events-none select-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(233,183,55,0.16),rgba(21,24,43,0.95)_45%,#0A0C16_100%)]" />

      {/* Layer 2: Deep Sapphire Ambient Depth Bloom */}
      <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-gradient-to-bl from-[#1E2342]/60 via-[#15182B]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-[#E9B737]/10 via-[#15182B]/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Layer 3: Topographic Elevation Contour Wave Curves */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-25 overflow-hidden">
        <svg className="w-full h-full min-w-[1200px]" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100,120 C300,60 600,180 1000,90 C1300,30 1500,140 1600,100" stroke="#E2E4EC" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
          <path d="M-100,190 C320,110 580,250 980,160 C1280,80 1480,210 1600,170" stroke="#E9B737" strokeWidth="1" strokeOpacity="0.35" />
          <path d="M-100,260 C340,160 560,320 960,230 C1260,130 1460,280 1600,240" stroke="#E2E4EC" strokeWidth="0.8" strokeOpacity="0.25" />
          <path d="M-100,330 C360,210 540,390 940,300 C1240,180 1440,350 1600,310" stroke="#E9B737" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M-100,400 C380,260 520,460 920,370 C1220,230 1420,420 1600,380" stroke="#E2E4EC" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Layer 4: Architectural Matrix with Crosshair Grid */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="page-geo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#E2E4EC" strokeWidth="0.5" strokeOpacity="0.3" />
              <path d="M 0 5 L 0 -5 M -5 0 L 5 0" stroke="#E9B737" strokeWidth="0.8" strokeOpacity="0.5" />
              <circle cx="60" cy="60" r="1" fill="#E9B737" fillOpacity="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#page-geo-grid)" />
        </svg>
      </div>

      {/* Layer 5: Fine Atmospheric Grain Texture Filter */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="page-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#page-grain)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Institutional Breadcrumb & Coordinates */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#232742]">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-white transition-colors">Pantera</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-400">Protocol</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#E9B737] font-semibold">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-400">
              <span className="text-slate-500">COORD:</span>
              <span className="text-slate-300">37°46&apos;N // 122°25&apos;W</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0E101D] border border-[#232742] text-slate-300 font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
              <span>LIVE SYSTEM V2.6</span>
            </span>
          </div>
        </div>

        {/* Narrative Block with generous whitespace */}
        <div className="max-w-3xl mb-12">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0E101D] border border-[#E9B737]/30 text-[#E9B737] font-mono text-xs font-semibold uppercase tracking-wider mb-6">
            <Icon className="w-3.5 h-3.5 text-[#E9B737]" />
            <span>[ 01 // {badge} ]</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] font-display mb-6">
            {title}{" "}
            {titleHighlight && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0B3] to-[#E9B737]">
                {titleHighlight}
              </span>
            )}
            <span className="text-[#E9B737]">.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans font-light leading-relaxed mb-8">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={ctaHref}
              className="px-8 py-3.5 rounded-md text-xs font-bold bg-[#E9B737] hover:bg-[#d8a427] text-[#15182B] font-mono uppercase tracking-wider shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#15182B]" />
            </Link>
            <Link
              href="/plans"
              className="px-7 py-3.5 rounded-md text-xs font-semibold bg-transparent hover:bg-white/5 text-white border border-[#E2E4EC]/30 hover:border-[#E9B737] transition-all font-mono uppercase tracking-wider cursor-pointer"
            >
              Explore Active Funds
            </Link>
          </div>

        </div>

        {/* Clean Horizontal Data Horizon */}
        {stats && stats.length > 0 && (
          <div className="pt-8 border-t border-[#232742] grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, idx) => (
              <div key={idx} className="border-l-2 border-[#E9B737]/50 pl-4">
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
