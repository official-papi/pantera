"use client";

import React from "react";
import { Wallet, TrendingUp, Zap, RefreshCw, ArrowDownRight, ArrowUpRight, Plus, ShieldCheck } from "lucide-react";

interface OverviewCardsProps {
  depositBalance?: number;
  interestBalance?: number;
  totalInvested?: number;
  totalWithdrawn?: number;
  onOpenDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenInvest?: () => void;
}

export default function OverviewCards({
  depositBalance = 0,
  interestBalance = 0,
  totalInvested = 0,
  totalWithdrawn = 0,
}: OverviewCardsProps) {
  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

      {/* ── Deposit Wallet ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Deposit Balance</span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-[#15182B] font-mono tracking-tight">
          ${fmt(depositBalance)}
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-1">Available to invest</p>
      </div>

      {/* ── Interest / Profit ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Profit Earned</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono tracking-tight">
          ${fmt(interestBalance)}
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-1">Ready to withdraw</p>
      </div>

      {/* ── Active Capital ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Active Capital</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-[#15182B] font-mono tracking-tight">
          ${fmt(totalInvested)}
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-1">Generating yield</p>
      </div>

      {/* ── Total Paid Out ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Settled Payouts</span>
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-slate-700 font-mono tracking-tight">
          ${fmt(totalWithdrawn)}
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-1">Paid to external wallets</p>
      </div>

    </div>
  );
}
