"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Milestone {
  year: string;
  tag: string;
  title: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2013",
    tag: "ORIGIN PROTOCOL",
    title: "First Institutional Digital Asset Fund",
    description: "Pantera launches the world's first regulated institutional digital currency investment vehicle, setting the benchmark for cryptocurrency asset custody.",
  },
  {
    year: "2018",
    tag: "ALGORITHMIC EXPANSION",
    title: "Liquid Token & Yield Arbitrage Engine",
    description: "Deployment of high-frequency cross-venue quantitative arbitrage algorithms, generating consistent market-neutral returns for capital partners.",
  },
  {
    year: "2021",
    tag: "LIQUIDITY PROTOCOL",
    title: "Decentralized Liquidity & Multi-Tier Staking",
    description: "Integration with primary DeFi liquidity protocols and implementation of multi-tier downline reward structures for institutional networks.",
  },
  {
    year: "2024",
    tag: "SETTLEMENT REVOLUTION",
    title: "Real-Time Automated Wallet Disbursement Engine",
    description: "Launch of zero-delay automated daily yield distribution pipelines directly to verified investor wallets across USDT TRC20, BTC, and Bank SWIFT.",
  },
  {
    year: "2026",
    tag: "CURRENT ERA",
    title: "Next-Gen Institutional Wealth & Compounding Terminal",
    description: "Full release of Pantera's unified investor portal, featuring cryptographic double-entry accounting ledgers, instant withdrawals, and flexible capital returns.",
  },
];

export default function PanteraHistory() {
  return (
    <section id="history" className="py-20 sm:py-28 bg-[#001011] text-white border-b border-[#093A3E] relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#093A3E_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3AAFB9]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#093A3E]">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-[#3AAFB9] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3AAFB9] animate-pulse" />
              <span>[ 02 // TRACK RECORD ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
              A History of Firsts
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#86cbd1] font-sans leading-relaxed">
            Over a decade of industry leadership, pioneering structured investment vehicles, and setting global standards in blockchain asset management.
          </p>
        </div>

        {/* Milestone Timeline Stack */}
        <div className="space-y-6">
          {MILESTONES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-[#041819] border border-[#093A3E] hover:border-[#3AAFB9] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:bg-[#072427]"
            >
              {/* Left Column: Year & Tag */}
              <div className="flex items-center gap-5 md:w-64 flex-shrink-0">
                <span className="font-mono font-black text-3xl sm:text-4xl text-white group-hover:text-[#3AAFB9] transition-colors">
                  {item.year}
                </span>
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#3AAFB9] bg-[#093A3E]/60 border border-[#3AAFB9]/30 px-2.5 py-1 rounded uppercase">
                  {item.tag}
                </span>
              </div>

              {/* Middle Column: Title & Narrative */}
              <div className="flex-1 md:px-6 md:border-l md:border-[#093A3E]">
                <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-[#d9eef0] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-[13px] text-[#86cbd1] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Right Column: Verified Badge */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#3AAFB9] flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#3AAFB9]" />
                <span className="hidden sm:inline">VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-[#093A3E]/80 via-[#041819] to-[#093A3E]/80 border border-[#3AAFB9]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white font-display">
              Ready to deploy capital with an institutional leader?
            </h4>
            <p className="text-xs text-[#86cbd1] mt-1 font-sans">
              Open an investor account in under 60 seconds and start receiving automated daily compounding returns.
            </p>
          </div>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-[#3AAFB9] hover:bg-[#5cb4be] text-[#001011] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#3AAFB9]/20 flex-shrink-0 cursor-pointer"
          >
            <span>Open Investor Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
