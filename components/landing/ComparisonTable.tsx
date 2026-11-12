"use client";

import Link from "next/link";
import { Check, X, ShieldCheck, ArrowRight } from "lucide-react";

interface ComparisonRow {
  feature: string;
  youHolder: string;
  traditionalBanks: string;
  genericPlatforms: string;
  highlight?: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "Average Annual Yield",
    youHolder: "Up to 15.5% Weekly (Compounded)",
    traditionalBanks: "0.5% – 2.0% Annual (Below Inflation)",
    genericPlatforms: "Variable / High volatility",
    highlight: true,
  },
  {
    feature: "Disbursement Frequency",
    youHolder: "Automated Weekly Direct-to-Wallet",
    traditionalBanks: "Monthly or Annual Statements",
    genericPlatforms: "Irregular or Delayed",
  },
  {
    feature: "Withdrawal Flexibility",
    youHolder: "Instant 24/7 (Zero lockup penalties)",
    traditionalBanks: "3–5 Business Days + Wire Fees",
    genericPlatforms: "High withdrawal fees / Manual approval",
    highlight: true,
  },
  {
    feature: "Supported Assets",
    youHolder: "USDT (TRC20/ERC20), BTC, ETH, Wire",
    traditionalBanks: "Fiat Currency Only (USD/EUR)",
    genericPlatforms: "Limited stablecoin support",
  },
  {
    feature: "Accounting Transparency",
    youHolder: "100% Cryptographic Double-Entry",
    traditionalBanks: "Opaque monthly bank statements",
    genericPlatforms: "No verifiable public ledger",
    highlight: true,
  },
  {
    feature: "Entry Minimum",
    youHolder: "From $500 to begin earning",
    traditionalBanks: "$10,000+ for private wealth desks",
    genericPlatforms: "Varies / Often complex requirements",
  },
];

export default function ComparisonTable() {
  return (
    <section className="py-24 sm:py-32 bg-[#08090C] text-white border-b border-white/[0.06] relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Capital Benchmark</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white">
            Why You-Holder outperforms traditional finance
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            A direct feature-by-feature comparison demonstrating how automated Web3 yield engineering leaves legacy banking behind.
          </p>
        </div>

        {/* ── Table Container ── */}
        <div className="rounded-3xl bg-[#0D0F16] border border-white/[0.08] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.07] text-slate-400 text-xs font-medium uppercase tracking-wider">
                  <th className="py-5 px-6 font-semibold">Key Dimension</th>
                  <th className="py-5 px-6 font-bold text-white bg-blue-600/[0.08] border-x border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>You-Holder</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 font-medium">Traditional Banks</th>
                  <th className="py-5 px-6 font-medium">Generic Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4.5 px-6 font-medium text-white">
                      {row.feature}
                    </td>

                    {/* You-Holder Column */}
                    <td className="py-4.5 px-6 font-semibold text-white bg-blue-600/[0.08] border-x border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={row.highlight ? "text-emerald-400 font-mono font-medium" : "text-white"}>
                          {row.youHolder}
                        </span>
                      </div>
                    </td>

                    {/* Traditional Banks */}
                    <td className="py-4.5 px-6 text-slate-400 font-normal">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 stroke-[2]" />
                        </div>
                        <span>{row.traditionalBanks}</span>
                      </div>
                    </td>

                    {/* Generic Platforms */}
                    <td className="py-4.5 px-6 text-slate-400 font-normal">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 stroke-[2]" />
                        </div>
                        <span>{row.genericPlatforms}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Action Banner */}
          <div className="p-6 sm:p-8 bg-[#090B10] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Upgrade your capital efficiency</div>
                <div className="text-xs text-slate-400">Join over 124,500 active investors worldwide.</div>
              </div>
            </div>

            <Link
              href="/register"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_2px_10px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center gap-2 flex-shrink-0 cursor-pointer active:scale-[0.98]"
            >
              <span>Create Account in 60s</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
