"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, ShieldCheck, CheckCircle2, ArrowUpRight, Activity, Zap
} from "lucide-react";
import gsap from "gsap";

interface CryptoAsset {
  symbol: string;
  name: string;
  rate: number; // percentage
  period: string;
  defaultAmount: number;
  badge: string;
}

const ASSETS: CryptoAsset[] = [
  {
    symbol: "USDT",
    name: "Tether USD",
    rate: 15.0,
    period: "weekly",
    defaultAmount: 10000,
    badge: "TRC20 / ERC20",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    rate: 8.5,
    period: "weekly",
    defaultAmount: 25000,
    badge: "Native SegWit",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    rate: 9.2,
    period: "weekly",
    defaultAmount: 15000,
    badge: "PoS Staking",
  },
];

export default function YouHodlerHero() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(ASSETS[0]);
  const [calcAmount, setCalcAmount] = useState<number>(10000);

  // Animated numeric state via GSAP
  const [displayedWeekly, setDisplayedWeekly] = useState<number>(1500);
  const [displayedMonthly, setDisplayedMonthly] = useState<number>(6000);

  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance Choreography
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        pillRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          formRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          terminalRef.current,
          { opacity: 0, y: 28, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power2.out" },
          "-=0.7"
        )
        .fromTo(
          statsRef.current?.children ? Array.from(statsRef.current.children) : [],
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP Smooth Tween for Yield Numbers
  useEffect(() => {
    const targetWeekly = (calcAmount * selectedAsset.rate) / 100;
    const targetMonthly = targetWeekly * 4;

    const counterObj = {
      weekly: displayedWeekly,
      monthly: displayedMonthly,
    };

    const tween = gsap.to(counterObj, {
      weekly: targetWeekly,
      monthly: targetMonthly,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayedWeekly(Math.round(counterObj.weekly));
        setDisplayedMonthly(Math.round(counterObj.monthly));
      },
    });

    return () => {
      tween.kill();
    };
  }, [calcAmount, selectedAsset]);

  const handleStartEarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/register?email=${encodeURIComponent(email.trim())}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-24 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 bg-[#08090C] text-white border-b border-white/[0.06] overflow-hidden"
    >
      {/* ── Architectural Ambient Glow (Subtle, calibrated, not muddy) ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[520px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Hairline geometric background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_65%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Grid: Left Column Hero Copy / Right Column Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Elegant Status Pill */}
            <div ref={pillRef} className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-xs text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">YouHodler Protocol</span>
              <span className="text-white/20">•</span>
              <span className="text-emerald-400 font-mono">v2.6 Live Yield Desk</span>
            </div>

            {/* Monumental, Natural Sentence-Case Headline */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-6xl lg:text-[62px] font-bold tracking-[-0.035em] leading-[1.08] text-white"
            >
              Navigating the{" "}
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Future of Finance
              </span>
            </h1>

            {/* Human-written, crystal-clear explanation */}
            <p
              ref={descRef}
              className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              YouHodler is a fintech company bridging the gap between traditional finance and crypto. We are dedicated to providing secure and innovative financial solutions to customers from over 100 countries.
            </p>

            {/* Clean Fast Signup Form with refined micro-bevel */}
            <form
              ref={formRef}
              onSubmit={handleStartEarning}
              className="max-w-xl mx-auto lg:mx-0"
            >
              <div className="p-1.5 sm:p-2 bg-[#0E1118]/90 border border-white/[0.1] rounded-2xl backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to start"
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_2px_8px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <span>Start Earning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-3.5 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No setup fees
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Weekly disbursements
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant liquidity
                </span>
              </div>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <a
                href="#plans"
                className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-xs font-medium text-slate-300 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Staking Tiers</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="#comparison"
                className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] text-xs font-medium text-slate-300 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Compare vs Banking</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>

          </div>

          {/* Right Column: Live Yield Terminal Card */}
          <div className="lg:col-span-5">
            <div ref={terminalRef} className="relative">
              
              {/* Subtle Ambient Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-emerald-500/20 rounded-3xl blur-xl opacity-60 pointer-events-none" />

              {/* Terminal Surface */}
              <div className="relative rounded-3xl bg-[#0D1017]/95 border border-white/[0.1] backdrop-blur-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] space-y-6">
                
                {/* Header Strip */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white tracking-tight">Live Yield Simulator</div>
                      <div className="text-xs text-slate-400">Quantitative Strategy Desk</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live 24/7
                  </span>
                </div>

                {/* Asset Tabs */}
                <div className="grid grid-cols-3 gap-2 bg-[#08090C] p-1.5 rounded-2xl border border-white/[0.06]">
                  {ASSETS.map((asset) => {
                    const isSelected = selectedAsset.symbol === asset.symbol;
                    return (
                      <button
                        key={asset.symbol}
                        type="button"
                        onClick={() => {
                          setSelectedAsset(asset);
                          setCalcAmount(asset.defaultAmount);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          isSelected
                            ? "bg-white/[0.08] text-white border border-white/[0.12] shadow-xs"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <span className="font-semibold">{asset.symbol}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">
                          {asset.rate.toFixed(1)}% /wk
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Capital Input Control */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Simulated Deposit Amount</span>
                    <span className="font-medium text-slate-200">{selectedAsset.name}</span>
                  </div>

                  <div className="flex items-center justify-between bg-[#08090C] px-4 py-3 rounded-xl border border-white/[0.08] focus-within:border-blue-500/60 transition-colors">
                    <span className="text-sm text-slate-400 font-mono">$</span>
                    <input
                      type="number"
                      min={300}
                      max={1000000}
                      step={100}
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                      className="w-full bg-transparent text-right font-mono font-bold text-xl text-white focus:outline-none"
                    />
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={300}
                    max={100000}
                    step={100}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />

                  {/* GSAP-Animated Results */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[11px] text-slate-400 block">
                        Weekly Return
                      </span>
                      <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                        +${displayedWeekly.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Automated credit</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[11px] text-slate-400 block">
                        Monthly Projected
                      </span>
                      <span className="text-lg font-bold font-mono text-white mt-1 block">
                        +${displayedMonthly.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">4-week compounding</span>
                    </div>
                  </div>
                </div>

                {/* Instant Deposit CTA */}
                <Link
                  href={`/register?asset=${selectedAsset.symbol.toLowerCase()}`}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_2px_10px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Lock In {selectedAsset.rate.toFixed(1)}% Weekly Return</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Footer Stamp */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    Ledger Vault Custody
                  </span>
                  <span>Instant 24/7 Liquidity</span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ── Metric Strip (Clean, developer-grade numbers) ── */}
        <div
          ref={statsRef}
          className="mt-16 pt-10 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-6 text-center lg:text-left"
        >
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              $3.5B<span className="text-blue-400">+</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-normal">
              Total Volume Settled
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              124,500<span className="text-emerald-400">+</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-normal">
              Active Global Investors
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              100%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-normal">
              Double-Entry Ledger Verified
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight flex items-center justify-center lg:justify-start gap-1.5">
              Instant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xs text-slate-400 mt-1 font-normal">
              On-Chain Capital Liquidity
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
