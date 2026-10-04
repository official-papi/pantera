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

        {/* ── Split Asymmetric Hero Section (Institutional Pantera Canvas) ── */}
        <section className="pt-16 pb-20 sm:pt-20 sm:pb-28 border-b border-[#232742] bg-[#15182B] relative overflow-hidden text-white">

          {/* Hero Background Image with Seamless Contrast Overlays */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <Image
              src="/images/hero-bg.jpg"
              alt="Institutional Wealth & AI Telemetry Architecture"
              fill
              priority
              className="object-cover object-right lg:object-center opacity-40 filter contrast-125"
            />
            {/* Smooth gradient ensures 100% crystal-clear readability for typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#15182B] via-[#15182B]/95 sm:via-[#15182B]/85 to-[#15182B]/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#15182B]/80 via-transparent to-[#15182B]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

              {/* LEFT COLUMN: Narrative, Quick Anchors & Conversion Actions (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Protocol Badge in IBM Plex Mono */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E101D]/80 border border-[#E9B737]/40 text-white text-xs font-semibold tracking-wide shadow-md backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#E9B737] animate-pulse" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#E9B737]">EST. 2013 // BLOCKCHAIN ASSET PROTOCOL</span>
                  <span className="text-white/20">|</span>
                  <span className="text-slate-300 text-[11px] font-mono">V2.6 LIVE ENGINE</span>
                </div>

                {/* Monumental Hero Title in Space Grotesk / Display Typography */}
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black font-display text-white tracking-tight leading-[1.06] max-w-2xl uppercase">
                  First Institutional Asset Manager Focused On <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0B3] to-[#E9B737]">Automated Blockchain Yield</span>.
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-300 font-sans font-normal leading-relaxed max-w-xl">
                  {cms.hero_subtitle}
                </p>

                {/* Pantera Quick Anchors Strip */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                  <a href="#at-a-glance" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#E9B737] hover:text-[#E9B737] text-slate-300 transition-colors">
                    01 // AT A GLANCE
                  </a>
                  <a href="#funds" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#E9B737] hover:text-[#E9B737] text-slate-300 transition-colors">
                    02 // ACTIVE FUNDS
                  </a>
                  <a href="#history" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#E9B737] hover:text-[#E9B737] text-slate-300 transition-colors">
                    03 // TRACK RECORD
                  </a>
                  <a href="#calculator" className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#E9B737] hover:text-[#E9B737] text-slate-300 transition-colors">
                    04 // YIELD CALCULATOR
                  </a>
                </div>

                {/* Key Institutional Proof Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 max-w-xl">
                  {[
                    "Daily automated compounding payouts",
                    "Double-entry cryptographic ledger audit",
                    "Instant withdrawals to USDT, BTC & ETH",
                    "Zero lockup capital redemption tier",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <div className="w-4 h-4 rounded-full bg-[#0E101D] border border-[#E9B737]/60 text-[#E9B737] flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    href="/register"
                    className="px-8 py-3.5 rounded-md text-sm font-bold flex items-center justify-center gap-2 bg-[#E9B737] hover:bg-[#D4A42C] text-[#15182B] transition-all shadow-lg shadow-[#E9B737]/20 cursor-pointer font-mono uppercase tracking-wider"
                  >
                    <span>{cms.hero_cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="#funds"
                    className="px-7 py-3.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-[#E9B737] transition-all backdrop-blur-md cursor-pointer font-mono uppercase tracking-wider"
                  >
                    <span>Explore Yield Funds</span>
                  </a>
                </div>

                {/* Social Proof & Investor Community Stack */}
                <div className="pt-4 border-t border-[#232742] flex flex-wrap items-center gap-4">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    {[
                      "/images/avatars/david.jpg",
                      "/images/avatars/sarah.jpg",
                      "/images/avatars/viktor.jpg",
                    ].map((src, idx) => (
                      <div key={idx} className="relative inline-block w-8 h-8 rounded-full ring-2 ring-[#15182B] overflow-hidden bg-zinc-800">
                        <Image src={src} alt="Verified Investor" fill className="object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="text-xs">
                    <div className="flex items-center gap-1 text-[#E9B737]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      <span className="font-bold text-white ml-1 font-mono">4.9/5</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                      Trusted by <span className="font-semibold text-white">124,500+ active investors</span> worldwide
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Interactive Terminal Window & Anchored Telemetry (5 Cols) */}
              <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                <div className="relative rounded-xl p-1 bg-gradient-to-b from-[#E9B737]/40 via-[#232742] to-[#0E101D] shadow-2xl">
                  <div className="relative rounded-[10px] overflow-hidden bg-[#0E101D] border border-[#232742]">
                    
                    {/* Terminal Title Bar */}
                    <div className="px-4 py-2.5 bg-[#15182B] border-b border-[#232742] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E9B737]/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="ml-2 font-mono text-[11px] text-slate-300">pantera-terminal.v2.6</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#E9B737] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
                        <span>LIVE EDGE</span>
                      </div>
                    </div>

                    {/* Terminal Canvas */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full">
                      <Image
                        src="/images/hero-preview.jpg"
                        alt="Pantera Platform Terminal Interface"
                        fill
                        priority
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Anchored Telemetry Bar */}
                    <div className="p-3 bg-[#0E101D]/95 border-t border-[#232742] grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2.5 bg-[#15182B] p-2.5 rounded-lg border border-[#232742]">
                        <div className="w-7 h-7 rounded-md bg-[#0E101D] text-[#E9B737] border border-[#E9B737]/30 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-bold truncate">Today's Payouts</div>
                          <div className="text-xs font-mono font-bold text-white truncate">+$12,450.00 <span className="text-[#E9B737] text-[10px]">(+4.85%)</span></div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 bg-[#15182B] p-2.5 rounded-lg border border-[#232742]">
                        <div className="w-7 h-7 rounded-md bg-[#0E101D] text-[#E9B737] border border-[#E9B737]/30 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-bold truncate">Ledger Audit</div>
                          <div className="text-xs font-mono font-bold text-white truncate">100% On-Chain</div>
                        </div>
                      </div>
                    </div>

                  </div>
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
