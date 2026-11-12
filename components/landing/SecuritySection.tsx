"use client";

import { ShieldCheck, Lock, KeyRound, Database, CheckCircle2 } from "lucide-react";

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: "Ledger Vault Cold Storage",
      desc: "Over 95% of client digital assets are air-gapped and held in institutional cold storage vaults, isolated from web vectors.",
    },
    {
      icon: Lock,
      title: "Multi-Signature Quorum",
      desc: "All transactions and vault movements require geographically separated multi-party approvals, preventing any single point of failure.",
    },
    {
      icon: Database,
      title: "Double-Entry Ledger",
      desc: "Real-time cryptographically reconciled balance books guarantee absolute transaction traceability and zero balance discrepancies.",
    },
    {
      icon: KeyRound,
      title: "Immediate Capital Liquidity",
      desc: "Dedicated operational buffers ensure your withdrawal requests are processed and broadcast immediately with zero delay.",
    },
  ];

  return (
    <section id="security" className="py-24 sm:py-32 bg-[#08090C] text-white border-b border-white/[0.06] relative overflow-hidden">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Custody & Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white">
            Bank-grade security for your digital assets
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Engineered with multi-signature cold-custody architectures so your capital compounds with total institutional peace of mind.
          </p>
        </div>

        {/* 4 Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-[#0D0F16] border border-white/[0.07] hover:border-white/[0.18] rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] group"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-blue-400 flex items-center justify-center mb-6 group-hover:border-blue-500/40 transition-colors">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.05] flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audited Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
