"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, LogOut, ArrowDownRight, ArrowUpRight, Plus, ShieldAlert, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "@/components/common/LanguageSelector";

interface DashboardHeaderProps {
  userEmail?: string;
  userName?: string;
  depositBalance?: number;
  interestBalance?: number;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenInvest: () => void;
}

export default function DashboardHeader({
  userEmail = "investor@example.com",
  userName = "Investor",
  depositBalance = 0,
  interestBalance = 0,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenInvest,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (
          profile?.role === "admin" ||
          user.user_metadata?.role === "admin" ||
          (user.email || "").includes("admin")
        ) {
          setIsAdmin(true);
        }
      }
    };

    checkAdminRole();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "IV";

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo & Status */}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-md bg-[#15182B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform text-[#E9B737] border border-[#232742]">
            <TrendingUp className="w-5 h-5 font-bold" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#15182B] flex items-center gap-1.5 font-display uppercase">
              Pantera<span className="text-[#E9B737]">.</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#E9B737] animate-pulse" />
            </span>
            <span className="block text-[10px] text-slate-400 font-bold tracking-widest uppercase font-mono">
              {t.dashboard.investorWorkspace}
            </span>
          </div>
        </Link>

        {/* Live Wallet Quick Ticker */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-lg border border-[#E2E4EC] text-xs font-mono">
          <div className="flex items-center space-x-2 pr-3 border-r border-[#E2E4EC]">
            <Wallet className="w-3.5 h-3.5 text-[#15182B]" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">{t.dashboard.depositWallet}</span>
              <span className="font-mono font-bold text-slate-900">${depositBalance.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#E9B737]" />
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">{t.dashboard.interestWallet}</span>
              <span className="font-mono font-bold text-[#15182B]">${interestBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Admin Switcher Button */}
        <div className="flex items-center gap-3">

          {/* Language Selector */}
          <LanguageSelector variant="default" />

          {/* Prominent Admin Switcher Button for Admins */}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-md bg-[#15182B] text-white font-bold text-xs flex items-center space-x-1.5 hover:bg-[#0E101D] transition-all shadow-xs cursor-pointer font-mono uppercase"
            >
              <ShieldAlert className="w-4 h-4 text-[#E9B737]" />
              <span className="hidden sm:inline">{t.dashboard.adminPortal}</span>
            </Link>
          )}

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenInvest}
              className="px-4 py-2 rounded-md text-xs font-bold text-[#15182B] bg-[#E9B737] hover:bg-[#D4A42C] transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs font-mono uppercase"
            >
              <Plus className="w-4 h-4 text-[#15182B]" />
              <span>{t.dashboard.investNow}</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="px-3.5 py-2 rounded-md border border-[#E2E4EC] bg-white text-[#15182B] font-bold text-xs flex items-center space-x-1 hover:border-[#15182B] transition-all cursor-pointer font-mono uppercase"
            >
              <ArrowDownRight className="w-4 h-4 text-[#E9B737]" />
              <span>{t.dashboard.deposit}</span>
            </button>

            <button
              onClick={onOpenWithdraw}
              className="px-3.5 py-2 rounded-md border border-[#E2E4EC] bg-white text-[#15182B] font-bold text-xs flex items-center space-x-1 hover:border-[#15182B] transition-all cursor-pointer font-mono uppercase"
            >
              <ArrowUpRight className="w-4 h-4 text-[#E9B737]" />
              <span>{t.dashboard.withdraw}</span>
            </button>
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-9 h-9 rounded-md bg-[#15182B] text-[#E9B737] flex items-center justify-center font-bold text-xs shadow-xs font-mono">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-none">{userName}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px] font-mono">{userEmail}</div>
            </div>
            <button
              onClick={handleLogout}
              title={t.dashboard.signOut}
              className="p-2 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
