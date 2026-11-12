"use client";

import Link from "next/link";
import {
  TrendingUp, ShieldCheck, Zap, ArrowRight,
  Database, Activity
} from "lucide-react";

export default function YouHodlerBento() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-[#08090C] text-white border-b border-white/[0.06] relative overflow-hidden">
      
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Infrastructure Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white">
            Engineered for maximum capital efficiency
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            A unified infrastructure bridging quantitative trading engines, automated compounding vaults, and multi-asset cold custody.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Automated Compounding Staking Vaults */}
          <div className="md:col-span-7 rounded-3xl bg-[#0D0F16] border border-white/[0.07] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden hover:border-white/[0.16] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Earn Vaults
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  Up to 15.5% Weekly
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Automated Compounding Vaults
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed font-normal">
                Deploy capital into algorithmically balanced liquidity protocols. Returns are credited on a deterministic schedule directly to your wallet with automated reinvestment options.
              </p>
            </div>

            {/* In-Card Data Row */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[11px] text-slate-400">Disbursements</div>
                <div className="text-sm font-semibold text-white mt-1">Weekly Auto</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[11px] text-slate-400">Lockup Period</div>
                <div className="text-sm font-semibold text-emerald-400 mt-1">Zero Friction</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[11px] text-slate-400">Assets</div>
                <div className="text-sm font-semibold text-white mt-1">USDT • BTC • ETH</div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>View all staking vaults</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 2: Quantitative High-Frequency Engine */}
          <div className="md:col-span-5 rounded-3xl bg-[#0D0F16] border border-white/[0.07] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden hover:border-white/[0.16] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Quant Engine
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                High-Frequency Arbitrage
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed font-normal">
                Proprietary execution bots continuously harvest cross-venue price spreads 24/7 in delta-neutral positions, generating steady yields independent of broader crypto market volatility.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Execution Latency:</span>
                <span className="text-white font-mono font-medium">&lt; 12ms</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Market Exposure:</span>
                <span className="text-emerald-400 font-medium">Delta-Neutral Hedged</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Instant Liquidity */}
          <div className="md:col-span-5 rounded-3xl bg-[#0D0F16] border border-white/[0.07] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden hover:border-white/[0.16] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Liquidity Desk
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                Instant Disbursements
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed font-normal">
                Liquid operational reserves ensure your withdrawal requests are signed and settled immediately with zero lockup penalty delays.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
              <span>Settlement Speed</span>
              <span className="font-semibold text-white">Real-Time On-Chain</span>
            </div>
          </div>

          {/* Bento Card 4: Audited Cryptographic Ledger */}
          <div className="md:col-span-7 rounded-3xl bg-[#0D0F16] border border-white/[0.07] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden hover:border-white/[0.16] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Accounting & Custody
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400">
                  <Database className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Cryptographic Double-Entry Ledger
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed font-normal">
                Every balance credit, yield accrual, and withdrawal is recorded in an immutable double-entry ledger database, guaranteeing mathematical integrity and zero discrepancies across the entire platform.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Continuous Reserve Reconciliation
              </span>
              <span className="font-mono text-emerald-400 font-medium">100% Reserve Backed</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
