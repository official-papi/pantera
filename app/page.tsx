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

        {/* ── Pantera Executive Research Banner ── */}
        <section className="bg-[#0E101D] border-b border-[#232742] py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono">
            <span className="text-[#E9B737] font-bold">[ EXECUTIVE RESEARCH ]</span>
            <span className="text-slate-200 uppercase tracking-wider">The State of Tokenization & Blockchain Yield :: Q4 2026</span>
            <a href="#funds" className="text-[#E9B737] hover:underline font-bold inline-flex items-center gap-1 transition-colors">
              EXPLORE ACTIVE FUNDS →
            </a>
          </div>
        </section>

        {/* ── Monumental Hero Section (Pantera Capital Institutional Architecture) ── */}
        <section className="pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-[#232742] bg-[#15182B] relative overflow-hidden text-white">

          {/* Pantera Generative Coordinate Grid & Ambient Topological Texture (No Legacy Stock Images) */}
          <div className="absolute inset-0 pointer-events-none select-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="pantera-hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#E2E4EC" strokeWidth="0.5" strokeOpacity="0.3" />
                  <circle cx="48" cy="0" r="1" fill="#E9B737" fillOpacity="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pantera-hero-grid)" />
            </svg>
          </div>

          {/* Subtle Ambient Light Gradients */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-gradient-to-b from-[#E9B737]/10 via-[#15182B]/0 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-40 bg-gradient-to-t from-[#0E101D] to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

              {/* LEFT COLUMN: Narrative & Institutional Action (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                {/* Protocol Badge in IBM Plex Mono */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E101D] border border-[#E9B737]/40 text-white text-xs font-semibold tracking-wide shadow-md">
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

              {/* RIGHT COLUMN: Interactive Pantera Institutional Terminal & Multi-Asset Monitor */}
              <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                <div className="relative rounded-2xl p-1 bg-gradient-to-b from-[#E9B737]/40 via-[#232742] to-[#0E101D] shadow-2xl">
                  <div className="relative rounded-[14px] overflow-hidden bg-[#0E101D] border border-[#232742]">
                    
                    {/* Terminal Title Bar */}
                    <div className="px-4 py-3 bg-[#15182B] border-b border-[#232742] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E9B737]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <span className="ml-2 font-mono text-[11px] text-slate-300">pantera-yield-engine.v2.6</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#E9B737] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
                        <span>BLOCK #21,894,102</span>
                      </div>
                    </div>

                    {/* Interactive Multi-Asset Yield Canvas */}
                    <div className="p-5 space-y-4">
                      
                      {/* Fund Selector Tabs */}
                      <div className="grid grid-cols-3 gap-1 bg-[#15182B] p-1 rounded-xl border border-[#232742] text-[10px] font-mono font-bold uppercase text-center">
                        <span className="py-1.5 rounded-lg bg-[#E9B737] text-[#15182B]">Liquid Tokens</span>
                        <span className="py-1.5 rounded-lg text-slate-400 hover:text-white">Early Stage</span>
                        <span className="py-1.5 rounded-lg text-slate-400 hover:text-white">Venture Yield</span>
                      </div>

                      {/* Yield Metrics Box */}
                      <div className="bg-[#15182B] border border-[#232742] rounded-xl p-4 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-mono uppercase text-slate-400">Target Annualized APY</span>
                          <span className="text-2xl font-black font-mono text-[#E9B737]">+18.4%</span>
                        </div>
                        <div className="w-full bg-[#0E101D] h-2 rounded-full overflow-hidden border border-[#232742]">
                          <div className="bg-gradient-to-r from-[#E9B737] to-amber-200 h-full w-[84%] rounded-full" />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Payout: Weekly Automated</span>
                          <span>Solvency: 100% On-Chain</span>
                        </div>
                      </div>

                      {/* Live Cryptographic Hash Ledger Feed */}
                      <div className="bg-[#15182B] border border-[#232742] rounded-xl p-3 space-y-2 text-xs font-mono">
                        <div className="text-[10px] uppercase text-slate-400 font-bold flex items-center justify-between">
                          <span>Latest Settlement Blocks</span>
                          <span className="text-[#E9B737]">Audit Verified</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] bg-[#0E101D] p-2 rounded-lg border border-[#232742]">
                            <span className="text-slate-300">0x7f4e...89a2</span>
                            <span className="text-emerald-400 font-bold">+$4,250.00 USDT</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] bg-[#0E101D] p-2 rounded-lg border border-[#232742]">
                            <span className="text-slate-300">0x3b1c...914d</span>
                            <span className="text-emerald-400 font-bold">+0.145 BTC</span>
                          </div>
                        </div>
                      </div>

                      {/* Terminal Action Pill */}
                      <Link
                        href="/register"
                        className="w-full py-2.5 rounded-xl bg-[#E9B737] hover:bg-[#D4A42C] text-[#15182B] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <span>Open Institutional Console</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                    </div>

                    {/* Anchored Telemetry Bar */}
                    <div className="p-3 bg-[#15182B] border-t border-[#232742] grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2.5 bg-[#0E101D] p-2.5 rounded-lg border border-[#232742]">
                        <div className="w-7 h-7 rounded-md bg-[#15182B] text-[#E9B737] border border-[#E9B737]/30 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-bold truncate">24H Inflow</div>
                          <div className="text-xs font-mono font-bold text-white truncate">+$184,200.00</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 bg-[#0E101D] p-2.5 rounded-lg border border-[#232742]">
                        <div className="w-7 h-7 rounded-md bg-[#15182B] text-[#E9B737] border border-[#E9B737]/30 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-400 uppercase font-bold truncate">Double-Entry</div>
                          <div className="text-xs font-mono font-bold text-white truncate">100% Solvency</div>
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
