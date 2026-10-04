"use client";

import { TrendingUp, ShieldCheck, Zap, Globe, Layers, Award } from "lucide-react";

interface GlanceMetric {
  value: string;
  suffix?: string;
  title: string;
  description: string;
  icon: any;
  tag: string;
}

const GLANCE_METRICS: GlanceMetric[] = [
  {
    value: "$3.5",
    suffix: "bn+",
    title: "Capital Deployed & Managed",
    description: "Cumulative volume deployed into quantitative yield and institutional blockchain strategies.",
    icon: TrendingUp,
    tag: "AUM METRIC",
  },
  {
    value: "4",
    title: "Core Investment Strategies",
    description: "Liquid Token Yield, Early-Stage Protocols, Macro Bitcoin Growth, and Algorithmic Arbitrage.",
    icon: Layers,
    tag: "DIVERSIFICATION",
  },
  {
    value: "75%",
    title: "Institutional & Qualified Liquidity",
    description: "Over three-quarters of platform liquidity backed by structured long-term liquidity partners.",
    icon: ShieldCheck,
    tag: "CAPITAL BASE",
  },
  {
    value: "100+",
    title: "Audited Liquidity Pools",
    description: "Decentralized liquidity farming across verified smart contracts with continuous security monitoring.",
    icon: Globe,
    tag: "INFRASTRUCTURE",
  },
  {
    value: "100%",
    title: "Double-Entry Ledger Audit",
    description: "Cryptographically verified settlement ledgers ensuring zero discrepancy on every balance update.",
    icon: Award,
    tag: "INTEGRITY",
  },
  {
    value: "13+",
    suffix: "yrs",
    title: "Institutional Track Record",
    description: "Over a decade of continuous operational excellence, automated disbursements, and platform stability.",
    icon: Zap,
    tag: "STABILITY",
  },
];

export default function PanteraAtAGlance() {
  return (
    <section id="at-a-glance" className="py-20 sm:py-28 bg-[#fafafa] border-b border-zinc-200/80 relative overflow-hidden">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Pantera Capital Style: Section numbering + Big Typography) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-[#15182B] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
              <span>[ 01 // OVERVIEW ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-zinc-950 uppercase">
              Pantera at a Glance
            </h2>
          </div>
          <p className="max-w-md text-sm text-zinc-600 font-sans leading-relaxed">
            Institutional scale, mathematical rigor, and automated execution. A decade-long track record of defining blockchain capital management.
          </p>
        </div>

        {/* 6-Grid Institutional Metric Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 shadow-sm rounded-2xl overflow-hidden">
          {GLANCE_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 sm:p-10 flex flex-col justify-between hover:bg-zinc-50/80 transition-all duration-300 group"
              >
                <div>
                  {/* Top Bar: Tag & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#15182B] uppercase bg-[#15182B]/5 border border-[#15182B]/15 px-2.5 py-1 rounded">
                      {metric.tag}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-[#15182B] text-zinc-600 group-hover:text-[#E9B737] flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Monumental Number in IBM Plex Mono / Space Grotesk */}
                  <div className="flex items-baseline gap-1 font-mono font-bold text-5xl sm:text-6xl text-zinc-950 tracking-tight leading-none group-hover:text-[#15182B] transition-colors">
                    <span>{metric.value}</span>
                    {metric.suffix && (
                      <span className="text-3xl sm:text-4xl text-[#E9B737] font-sans font-bold">
                        {metric.suffix}
                      </span>
                    )}
                  </div>

                  {/* Metric Title */}
                  <h3 className="mt-5 text-base sm:text-lg font-bold font-display tracking-tight text-zinc-900">
                    {metric.title}
                  </h3>
                </div>

                {/* Metric Description */}
                <p className="mt-4 text-xs sm:text-[13px] text-zinc-500 font-sans leading-relaxed pt-4 border-t border-zinc-100">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Institutional Seal Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold text-zinc-700">
              SETTLEMENT PROTOCOL: <strong className="text-zinc-900 font-bold">ACTIVE & AUTOMATED</strong>
            </span>
          </div>
          <div className="font-mono text-[11px] text-zinc-400">
            AUDITED BY CRYPTOGRAPHIC LEDGER ENGINE · ZERO SLIPPAGE
          </div>
        </div>

      </div>
    </section>
  );
}
