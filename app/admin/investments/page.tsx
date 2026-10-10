"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  User,
  Mail,
  Zap,
  Filter,
  RefreshCw,
  ExternalLink,
  Layers,
  ChevronRight,
  Eye,
  Calendar,
  Percent,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);

  // Email modal states
  const [emailModalUser, setEmailModalUser] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_investments")
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          username,
          email,
          phone,
          deposit_wallet,
          interest_wallet
        ),
        investment_plans:plan_id (
          id,
          name,
          badge,
          roi_percentage,
          payout_interval_hours,
          total_payout_periods,
          capital_back
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching investments:", error);
    } else {
      setInvestments(data || []);
    }
    setLoading(false);
  };

  const handleOpenEmail = (inv: any) => {
    const user = inv.profiles;
    if (!user) return;
    setEmailModalUser(user);
    setEmailSubject(`Pantera Capital: Regarding Your ${inv.investment_plans?.name || "Active"} Staking Package`);
    setEmailMessage(
      `We are following up regarding your investment of $${Number(inv.invest_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} in the ${
        inv.investment_plans?.name || "Staking Tier"
      }.\n\nYour portfolio is active and yielding returns as scheduled.\n\nWarm regards,\nPantera Capital Asset Desk`
    );
    setEmailStatus(null);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalUser?.email || !emailSubject.trim() || !emailMessage.trim()) return;

    setEmailSending(true);
    setEmailStatus(null);

    try {
      const res = await fetch("/api/admin/email/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAudience: "single_user",
          singleEmail: emailModalUser.email,
          subject: emailSubject.trim(),
          message: emailMessage.trim(),
          ctaText: "VIEW PORTFOLIO",
          ctaUrl: "https://pantera.cfd/dashboard/investments",
          sendInAppNotification: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email");
      }

      setEmailStatus({
        text: `Email successfully sent to ${emailModalUser.email}!`,
        type: "success",
      });

      setTimeout(() => {
        setEmailModalUser(null);
      }, 1500);
    } catch (err: any) {
      setEmailStatus({ text: err.message || "Failed to send email.", type: "error" });
    } finally {
      setEmailSending(false);
    }
  };

  const fmt = (n: number) =>
    Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Compute live summary statistics
  const totalActiveCapital = investments
    .filter((i) => i.status === "active")
    .reduce((sum, i) => sum + Number(i.invest_amount || 0), 0);

  const totalYieldDistributed = investments.reduce(
    (sum, i) => sum + Number(i.total_profit_earned || 0),
    0
  );

  const activeCount = investments.filter((i) => i.status === "active").length;
  const completedCount = investments.filter((i) => i.status === "completed").length;

  const filteredInvestments = investments.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const userName = (inv.profiles?.full_name || "").toLowerCase();
      const userEmail = (inv.profiles?.email || "").toLowerCase();
      const userUsername = (inv.profiles?.username || "").toLowerCase();
      const planName = (inv.investment_plans?.name || "").toLowerCase();
      return (
        userName.includes(q) ||
        userEmail.includes(q) ||
        userUsername.includes(q) ||
        planName.includes(q)
      );
    }

    return true;
  });

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "IN";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E4EC] rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#15182B] text-[#E9B737]">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Active User Investments & Staking Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Platform monitoring of live capital deployments, yield generation, and contract cycles.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/admin/plans"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-[#E9B737]" />
            <span>Manage Plans</span>
          </Link>
          <button
            type="button"
            onClick={fetchInvestments}
            className="px-3.5 py-2 rounded-xl bg-[#15182B] hover:bg-[#0E101D] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E9B737] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#15182B]" />
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">
              Active Capital
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums notranslate" translate="no">
            ${fmt(totalActiveCapital)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Generating live yields</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E9B737]" />
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">
              Active Contracts
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#15182B] font-mono tabular-nums notranslate" translate="no">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Running investor packages</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">
              Total Yield Paid
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono tabular-nums notranslate" translate="no">
            +${fmt(totalYieldDistributed)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Cumulative interest paid</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400" />
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-slate-500">
              Completed Contracts
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-700 font-mono tabular-nums notranslate" translate="no">
            {completedCount}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Fully matured contracts</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E4EC] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-[#15182B] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({investments.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "active"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "completed"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("cancelled")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "cancelled"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
            }`}
          >
            Cancelled ({investments.filter((i) => i.status === "cancelled").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search investor, email, plan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#E9B737] transition-all"
          />
        </div>
      </div>

      {/* ── DESKTOP & TABLET VIEW: High-Structure Data Table ── */}
      <div className="hidden md:block bg-white border border-[#E2E4EC] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-[#E2E4EC] text-slate-500 uppercase text-[10px] font-bold font-mono tracking-wider">
                <th className="py-3.5 px-5">Investor</th>
                <th className="py-3.5 px-4">Staking Package</th>
                <th className="py-3.5 px-4 text-right">Capital Invested</th>
                <th className="py-3.5 px-4 text-right">Yield / Period</th>
                <th className="py-3.5 px-5">Cycle Progress</th>
                <th className="py-3.5 px-4 text-right">Profit Accrued</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-xs font-medium">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#E9B737]" />
                    Loading running user investments...
                  </td>
                </tr>
              ) : filteredInvestments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-xs font-medium">
                    No investments matching filter or query found.
                  </td>
                </tr>
              ) : (
                filteredInvestments.map((inv) => {
                  const user = inv.profiles;
                  const plan = inv.investment_plans;
                  const paid = Number(inv.paid_periods || 0);
                  const total = Number(inv.total_payout_periods || 1);
                  const progressPct = Math.min(100, Math.round((paid / total) * 100));
                  const isActive = inv.status === "active";
                  const initials = getInitials(user?.full_name, user?.email);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Investor */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#15182B] text-[#E9B737] font-black text-xs flex items-center justify-center shrink-0 border border-[#E9B737]/30 shadow-xs">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">
                              {user?.full_name || user?.username || "Investor"}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {user?.email || "No email"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Staking Package */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{plan?.name || "Staking Package"}</span>
                          {plan?.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {plan?.payout_interval_hours || 24}h intervals · {total} cycles
                        </div>
                      </td>

                      {/* Capital Invested */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-extrabold text-slate-900 text-sm notranslate" translate="no">
                          ${fmt(inv.invest_amount)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Principal</div>
                      </td>

                      {/* Yield / Period */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-bold text-indigo-600 text-sm notranslate" translate="no">
                          +${fmt(inv.payout_per_period)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {plan?.roi_percentage}% per cycle
                        </div>
                      </td>

                      {/* Cycle Progress */}
                      <td className="py-4 px-5 min-w-[160px]">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 mb-1.5">
                          <span className="font-bold text-slate-900">
                            {paid} <span className="text-slate-400 font-normal">/ {total} cycles</span>
                          </span>
                          <span className="font-extrabold text-slate-700 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                            {progressPct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isActive ? "bg-[#15182B]" : "bg-emerald-500"
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </td>

                      {/* Profit Accrued */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-extrabold text-emerald-600 text-sm notranslate" translate="no">
                          +${fmt(inv.total_profit_earned)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Paid to date</div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1.5 ${
                            inv.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : inv.status === "completed"
                              ? "bg-slate-100 text-slate-700 border border-slate-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              inv.status === "active"
                                ? "bg-emerald-600 animate-pulse"
                                : inv.status === "completed"
                                ? "bg-slate-500"
                                : "bg-rose-500"
                            }`}
                          />
                          <span>{inv.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedInvestment(inv)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-200/60"
                            title="View full specification"
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                            <span>Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEmail(inv)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                            title="Send direct email to investor"
                          >
                            <Mail className="w-3 h-3 text-emerald-600" />
                            <span>Email</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MOBILE VIEW: Responsive Staking Cards ── */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="bg-white border border-[#E2E4EC] rounded-2xl p-8 text-center text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#E9B737]" />
            Loading investments...
          </div>
        ) : filteredInvestments.length === 0 ? (
          <div className="bg-white border border-[#E2E4EC] rounded-2xl p-8 text-center text-slate-400 text-xs">
            No investments found.
          </div>
        ) : (
          filteredInvestments.map((inv) => {
            const user = inv.profiles;
            const plan = inv.investment_plans;
            const paid = Number(inv.paid_periods || 0);
            const total = Number(inv.total_payout_periods || 1);
            const progressPct = Math.min(100, Math.round((paid / total) * 100));
            const initials = getInitials(user?.full_name, user?.email);

            return (
              <div
                key={inv.id}
                className="bg-white border border-[#E2E4EC] rounded-2xl p-4 shadow-xs space-y-3"
              >
                {/* Header: Investor + Status */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#15182B] text-[#E9B737] font-black text-xs flex items-center justify-center shrink-0 border border-[#E9B737]/30">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 text-xs truncate">
                        {user?.full_name || user?.username || "Investor"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {user?.email || "No email"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                      inv.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : inv.status === "completed"
                        ? "bg-slate-100 text-slate-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {/* Plan Name & Badge */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{plan?.name || "Staking Package"}</span>
                    {plan?.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {plan?.payout_interval_hours || 24}h intervals
                  </span>
                </div>

                {/* 2x2 Grid of Financials */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Capital Invested</span>
                    <span className="font-extrabold text-slate-900 text-sm notranslate" translate="no">
                      ${fmt(inv.invest_amount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-sans">Yield / Period</span>
                    <span className="font-bold text-indigo-600 text-sm notranslate" translate="no">
                      +${fmt(inv.payout_per_period)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/50">
                    <span className="text-[10px] text-slate-400 block font-sans">Cycles Paid</span>
                    <span className="font-bold text-slate-800">
                      {paid} / {total}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/50 text-right">
                    <span className="text-[10px] text-slate-400 block font-sans">Profit Accrued</span>
                    <span className="font-extrabold text-emerald-600 text-sm notranslate" translate="no">
                      +${fmt(inv.total_profit_earned)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span>Progress</span>
                    <span className="font-bold">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        inv.status === "active" ? "bg-[#15182B]" : "bg-emerald-500"
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedInvestment(inv)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEmail(inv)}
                    className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Investment Details Modal ── */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-xl space-y-5 shadow-2xl relative text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#15182B] text-[#E9B737]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Staking Contract Specification
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedInvestment.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvestment(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Investor Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Investor</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedInvestment.profiles?.full_name || selectedInvestment.profiles?.username || "Investor"}
                </span>
                <span className="font-mono text-slate-500 block text-[11px]">
                  {selectedInvestment.profiles?.email}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Status</span>
                <span className="font-bold text-emerald-600 uppercase text-xs">
                  {selectedInvestment.status}
                </span>
              </div>
            </div>

            {/* Contract breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Capital Allocated</span>
                <span className="text-base font-black text-slate-900 font-mono notranslate" translate="no">
                  ${fmt(selectedInvestment.invest_amount)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Total Profit Earned</span>
                <span className="text-base font-black text-emerald-600 font-mono notranslate" translate="no">
                  +${fmt(selectedInvestment.total_profit_earned)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Yield Per Period</span>
                <span className="text-base font-black text-indigo-600 font-mono notranslate" translate="no">
                  +${fmt(selectedInvestment.payout_per_period)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({selectedInvestment.investment_plans?.roi_percentage}% ROI)
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Settlement Progress</span>
                <span className="text-base font-black text-slate-800 font-mono">
                  {selectedInvestment.paid_periods} / {selectedInvestment.total_payout_periods}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({Math.round(((selectedInvestment.paid_periods || 0) / (selectedInvestment.total_payout_periods || 1)) * 100)}% complete)
                </span>
              </div>
            </div>

            {/* Next Payout Info */}
            <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-slate-700">Next Scheduled Settlement:</span>
              </div>
              <span className="font-mono font-bold text-indigo-900">
                {selectedInvestment.next_payout_at
                  ? new Date(selectedInvestment.next_payout_at).toLocaleString()
                  : "Matured"}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInvestment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const inv = selectedInvestment;
                  setSelectedInvestment(null);
                  handleOpenEmail(inv);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Investor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Direct Email Modal ── */}
      {emailModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Message Investor Regarding Staking</h3>
                  <p className="text-[11px] text-slate-400">Direct transmission to user&apos;s registered inbox</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalUser(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Recipient: <strong className="text-slate-900">{emailModalUser.full_name || emailModalUser.email}</strong> ({emailModalUser.email})
            </div>

            {emailStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 font-semibold ${
                  emailStatus.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                {emailStatus.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{emailStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#E9B737]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Message Content</label>
                <textarea
                  rows={6}
                  required
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#E9B737] font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEmailModalUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{emailSending ? "Sending..." : "Send Email"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
