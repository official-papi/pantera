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
  onOpenDeposit,
  onOpenWithdraw,
  onOpenInvest,
}: OverviewCardsProps) {
  const fmt = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {/* ── Deposit Wallet ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#15182B] transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#15182B]" />
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Deposit Wallet</p>
              <p className="text-[26px] font-extrabold text-[#15182B] tracking-tight font-mono leading-none">
                ${fmt(depositBalance)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-md bg-[#15182B]/5 border border-[#15182B]/15 flex items-center justify-center flex-shrink-0 text-[#15182B] group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mb-4">Available liquid capital for investments</p>
        </div>
        <button
          onClick={onOpenDeposit}
          className="w-full py-2.5 rounded-md bg-[#15182B] hover:bg-[#0E101D] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer font-mono uppercase tracking-wider"
        >
          <ArrowDownRight className="w-3.5 h-3.5 text-[#E9B737]" />
          <span>Deposit Funds</span>
        </button>
      </div>

      {/* ── Interest Wallet ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#E9B737] transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E9B737]" />
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Interest Earnings</p>
              <p className="text-[26px] font-extrabold text-[#15182B] tracking-tight font-mono leading-none">
                ${fmt(interestBalance)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-md bg-[#E9B737]/15 border border-[#E9B737]/30 flex items-center justify-center flex-shrink-0 text-[#15182B] group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-[#15182B]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mb-4">Realized yield ready for payout or transfer</p>
        </div>
        <button
          onClick={onOpenWithdraw}
          className="w-full py-2.5 rounded-md bg-[#E9B737] hover:bg-[#D4A42C] text-[#15182B] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs font-mono uppercase tracking-wider"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-[#15182B]" />
          <span>Request Payout</span>
        </button>
      </div>

      {/* ── Total Invested ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#15182B] transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#15182B]" />
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Active Capital</p>
              <p className="text-[26px] font-extrabold text-[#15182B] tracking-tight font-mono leading-none">
                ${fmt(totalInvested)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-800 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-[#15182B]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mb-4">Capital locked in automated compounding</p>
        </div>
        <button
          onClick={onOpenInvest}
          className="w-full py-2.5 rounded-md bg-white hover:bg-slate-50 text-[#15182B] border border-[#E2E4EC] hover:border-[#15182B] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs font-mono uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 text-[#15182B]" />
          <span>Invest In Plan</span>
        </button>
      </div>

      {/* ── Total Payouts ── */}
      <div className="bg-white border border-[#E2E4EC] rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#E9B737] transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E9B737]" />
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Total Payouts</p>
              <p className="text-[26px] font-extrabold text-[#15182B] tracking-tight font-mono leading-none">
                ${fmt(totalWithdrawn)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-800 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-5 h-5 text-[#E9B737]" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mb-4">Total principal and profit settled</p>
        </div>
        <div className="w-full py-2.5 rounded-md bg-[#15182B] text-[#E9B737] border border-[#232742] text-[11px] font-bold flex items-center justify-center gap-2 tracking-wide font-mono shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#E9B737] inline-block animate-pulse" />
          <span>AUDITED LEDGER · VERIFIED</span>
        </div>
      </div>

    </div>
  );
}
