"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TradingViewTicker from "@/components/landing/TradingViewTicker";
import TopInvestors from "@/components/landing/TopInvestors";
import PlanCards from "@/components/landing/PlanCards";
import RoiCalculator from "@/components/landing/RoiCalculator";
import HowItWorks from "@/components/landing/HowItWorks";
import ReferralSection from "@/components/landing/ReferralSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PanteraAtAGlance from "@/components/landing/PanteraAtAGlance";
import PanteraHistory from "@/components/landing/PanteraHistory";
import Link from "next/link";
import { ArrowRight, ShieldCheck, TrendingUp, Zap, Lock, Sparkles, MessageSquare, Check, Star } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [cms, setCms] = useState({
    hero_badge: "Institutional Digital Asset Management",
    hero_title: "First Institutional Asset Manager Focused On Automated Blockchain Yield",
    hero_subtitle: "Since 2013, Pantera has invested in digital assets and quantitative yield architectures, providing investors with structured exposure to high-yield compounding packages, instant liquidity, and cryptographic settlement integrity.",
    hero_cta: "Deploy Capital Now",
    about_metric1: "$3.5B+",
    about_metric2: "$734M+",
  });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("system_settings").select("*").single();
      if (data?.meta) {
        setCms((prev) => ({
          ...prev,
          ...data.meta,
        }));
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-600 flex flex-col font-sans relative overflow-hidden">
      
      {/* Subtle Minimalist Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

      {/* Floating Support Desk Launcher */}
      <Link
        href="/contact"
        className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-zinc-200 text-zinc-900 shadow-md flex items-center space-x-2.5 text-xs font-medium hover:border-zinc-300 transition-all group cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center">
          <MessageSquare className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline text-zinc-900 font-semibold font-mono text-[11px]">24/7 SUPPORT DESK</span>
      </Link>

      <Navbar />

      <main className="flex-1 relative z-10">

        {/* ── Pantera Institutional Editorial Hero ── */}
        <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-36 lg:pb-32 bg-[#0A0C16] text-white border-b border-[#232742] overflow-hidden">
          
          {/* Layer 1: Rich Multi-stop Radial & Conic Ambient Gradient */}
          <div className="absolute inset-0 pointer-events-none select-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(233,183,55,0.18),rgba(21,24,43,0.95)_45%,#0A0C16_100%)]" />

          {/* Layer 2: Deep Sapphire Ambient Depth Bloom */}
          <div className="absolute top-1/4 -right-20 w-[650px] h-[650px] bg-gradient-to-bl from-[#1E2342]/60 via-[#15182B]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#E9B737]/10 via-[#15182B]/40 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Layer 3: Topographic Contour Waves & Quantitative Elevation Texture */}
          <div className="absolute inset-0 pointer-events-none select-none opacity-30 overflow-hidden">
            <svg className="w-full h-full min-w-[1200px]" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M-100,200 C300,120 600,280 1000,160 C1300,80 1500,220 1600,180" stroke="#E2E4EC" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 3" />
              <path d="M-100,280 C320,180 580,360 980,240 C1280,140 1480,300 1600,260" stroke="#E9B737" strokeWidth="1" strokeOpacity="0.4" />
              <path d="M-100,360 C340,240 560,440 960,320 C1260,200 1460,380 1600,340" stroke="#E2E4EC" strokeWidth="0.8" strokeOpacity="0.25" />
              <path d="M-100,440 C360,300 540,520 940,400 C1240,260 1440,460 1600,420" stroke="#E9B737" strokeWidth="1.2" strokeOpacity="0.3" />
              <path d="M-100,520 C380,360 520,600 920,480 C1220,320 1420,540 1600,500" stroke="#E2E4EC" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 4" />
              <path d="M-100,600 C400,420 500,680 900,560 C1200,380 1400,620 1600,580" stroke="#E9B737" strokeWidth="0.8" strokeOpacity="0.25" />
            </svg>
          </div>

          {/* Layer 4: Architectural Matrix with Crosshair Grid */}
          <div className="absolute inset-0 pointer-events-none select-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pantera-geo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#E2E4EC" strokeWidth="0.5" strokeOpacity="0.3" />
                  {/* Subtle crosshairs at grid intersections */}
                  <path d="M 0 5 L 0 -5 M -5 0 L 5 0" stroke="#E9B737" strokeWidth="0.8" strokeOpacity="0.5" />
                  <circle cx="60" cy="60" r="1" fill="#E9B737" fillOpacity="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pantera-geo-grid)" />
            </svg>
          </div>

          {/* Layer 5: Fine Atmospheric Grain Texture Filter */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="hero-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#hero-grain)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              
              {/* Subtle Monospace Pre-heading Tag */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#E9B737]" />
                <span className="font-mono text-xs text-slate-300 uppercase tracking-[0.25em]">
                  EST. 2013 · INSTITUTIONAL DIGITAL ASSET MANAGEMENT
                </span>
              </div>

              {/* Monumental Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] font-display mb-8">
                First institutional asset manager focused on automated blockchain yield<span className="text-[#E9B737]">.</span>
              </h1>

              {/* Authoritative Thesis Description */}
              <p className="text-lg sm:text-xl text-slate-300 font-sans font-light leading-relaxed max-w-2xl mb-10">
                Since 2013, Pantera has invested in digital assets and decentralized protocols, providing investors with structured exposure, audited compounding yield, and automated weekly liquidity.
              </p>

              {/* Clean, Refined Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-16">
                <a
                  href="#funds"
                  className="px-8 py-4 rounded-md text-xs font-bold bg-[#E9B737] hover:bg-[#d8a427] text-[#15182B] font-mono uppercase tracking-wider transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  <span>View The Funds</span>
                  <ArrowRight className="w-4 h-4 text-[#15182B]" />
                </a>
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-md text-xs font-semibold bg-transparent hover:bg-white/5 text-white border border-[#E2E4EC]/30 hover:border-[#E9B737] transition-all font-mono uppercase tracking-wider cursor-pointer"
                >
                  Institutional Console
                </Link>
                <a
                  href="#ledger"
                  className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Real-Time Audit</span>
                  <span className="text-[#E9B737]">→</span>
                </a>
              </div>

            </div>

            {/* Institutional 4-Metric Data Horizon at base of hero */}
            <div className="pt-10 border-t border-[#232742] grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight tabular-nums">
                  $5.2B<span className="text-[#E9B737]">+</span>
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  Assets Under Management
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight tabular-nums">
                  100<span className="text-[#E9B737]">+</span>
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  Portfolio Investments
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight tabular-nums">
                  12<span className="text-[#E9B737]">+ YRS</span>
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  Operating Track Record
                </div>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight tabular-nums flex items-center gap-1.5">
                  100%
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">
                  On-Chain Reserve Solvency
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Realtime Market Ticker Tape */}
        <TradingViewTicker />

        {/* ── [01 // OVERVIEW] Pantera at a Glance 6-Metric Institutional Grid ── */}
        <PanteraAtAGlance />

        {/* ── Unified Institutional Performance & Settlement Ledger Console ────── */}
        <section className="py-12 bg-white border-b border-[#E2E4EC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-[#15182B] border border-[#232742] rounded-xl shadow-xl overflow-hidden">
              
              {/* Terminal HUD Header */}
              <div className="px-6 py-3.5 bg-[#0E101D] border-b border-[#232742] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#E9B737] animate-pulse" />
                  <span className="font-bold text-white font-mono uppercase tracking-wide">Institutional Proof of Reserves & Settlement Ledger</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-300">
                  <span>AUDIT STATUS: <strong className="text-[#E9B737] font-bold">100% ON-CHAIN VERIFIED</strong></span>
                  <span className="hidden sm:inline text-white/20">|</span>
                  <span className="hidden sm:inline">CYCLE: REALTIME DETERMINISTIC</span>
                </div>
              </div>

              {/* 4 Quantitative Metrics Columns with Dividers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#232742]">
                {[
                  { label: "Total Assets Deposited", value: "$256,400,000+", sub: "Verified Capital", icon: TrendingUp },
                  { label: "Total Yield Disbursed",  value: "$734,180,000+", sub: "Automated Payouts", icon: Zap },
                  { label: "Active Investors",       value: "124,500+",       sub: "Global Accounts", icon: Sparkles },
                  { label: "Double-Entry Ledger",    value: "100.0%",         sub: "Zero Discrepancy", icon: ShieldCheck },
                ].map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div key={i} className="bg-[#15182B] p-6 text-center lg:text-left flex flex-col justify-between hover:bg-[#1C2038] transition-colors">
                      <div className="flex items-center justify-center lg:justify-between mb-3">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">{m.label}</span>
                        <div className="hidden lg:flex w-7 h-7 rounded-md bg-[#0E101D] text-[#E9B737] border border-[#E9B737]/30 items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white tabular-nums">
                        {m.value}
                      </div>
                      <div className="mt-2 flex items-center justify-center lg:justify-start">
                        <span className="text-[10px] font-semibold text-[#E9B737] bg-[#0E101D] px-2.5 py-0.5 rounded border border-[#E9B737]/30 inline-flex items-center gap-1 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737]" />
                          {m.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Integrated Security & Custody Footer */}
              <div className="px-6 py-4 bg-[#0E101D] border-t border-[#232742] grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, title: "256-Bit SSL Transport", desc: "Bank-grade encrypted communication protocol" },
                  { icon: Lock,        title: "Cold Storage Segregated Vaults", desc: "Multi-signature cryptographic custody keys" },
                  { icon: Zap,         title: "Automated Instant Liquidity", desc: "Deterministic double-entry ledger settlement" },
                ].map((b, i) => {
                  const BIcon = b.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[#15182B] border border-[#232742] text-[#E9B737] flex items-center justify-center flex-shrink-0">
                        <BIcon className="w-4 h-4 text-[#E9B737]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono uppercase">{b.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal leading-tight">{b.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* ── [02 // ACTIVE FUNDS] Plan Cards ── */}
        <PlanCards />

        {/* ── [03 // TRACK RECORD] A History of Firsts Timeline ── */}
        <PanteraHistory />

        {/* ── [04 // SIMULATOR] Yield Calculator ── */}
        <RoiCalculator />

        {/* ── Ecosystem, Community & Proof Sections ── */}
        <TopInvestors />
        <HowItWorks />
        <ReferralSection />
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
}
