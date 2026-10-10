"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldOff,
  ShieldCheck,
  FileText,
  Printer,
  Mail,
  Send,
  Eye,
  Sparkles,
  User,
  QrCode,
  Phone,
  Calendar,
  Hash,
  ExternalLink,
  ShieldAlert,
  Award,
  Copy,
  Check,
  DollarSign,
  Zap,
  Share2,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Bio Data & Profile Inspector states
  const [bioUser, setBioUser] = useState<any | null>(null);
  const [loadingBio, setLoadingBio] = useState(false);
  const [bioDetails, setBioDetails] = useState<any | null>(null);
  const [bioTab, setBioTab] = useState<"bio" | "finance" | "payout" | "referral" | "kyc">("bio");
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Balance modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetWallet, setTargetWallet] = useState<"deposit_wallet" | "interest_wallet">("deposit_wallet");
  const [action, setAction] = useState<"add" | "subtract">("add");
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Financial Statement Modal states
  const [statementUser, setStatementUser] = useState<any | null>(null);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [loadingStatement, setLoadingStatement] = useState(false);

  // Direct User Email Modal states
  const [emailUser, setEmailUser] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailCtaText, setEmailCtaText] = useState("");
  const [emailCtaUrl, setEmailCtaUrl] = useState("https://pantera.cfd/dashboard");
  const [emailSendInApp, setEmailSendInApp] = useState(true);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [emailTab, setEmailTab] = useState<"compose" | "preview">("compose");

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenBioModal = async (user: any) => {
    setBioUser(user);
    setLoadingBio(true);
    setBioTab("bio");
    setBioDetails(null);

    try {
      const supabase = createClient();
      const [kycRes, referrerRes, refCountRes, depositsRes, withdrawRes, investRes] = await Promise.all([
        supabase.from("kyc_requests").select("*").eq("user_id", user.id).maybeSingle(),
        user.referred_by
          ? supabase.from("profiles").select("id, full_name, username, email").eq("id", user.referred_by).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("referred_by", user.id),
        supabase.from("deposits").select("amount").eq("user_id", user.id).eq("status", "approved"),
        supabase.from("withdrawals").select("amount").eq("user_id", user.id).eq("status", "approved"),
        supabase.from("user_investments").select("invest_amount, status, payout_per_period, total_profit_earned").eq("user_id", user.id),
      ]);

      const depositsTotal = (depositsRes.data || []).reduce((acc: number, d: any) => acc + Number(d.amount || 0), 0);
      const withdrawalsTotal = (withdrawRes.data || []).reduce((acc: number, w: any) => acc + Number(w.amount || 0), 0);
      const activeInvestments = (investRes.data || []).filter((i: any) => i.status === "active");
      const activeInvestmentsTotal = activeInvestments.reduce((acc: number, i: any) => acc + Number(i.invest_amount || 0), 0);
      const totalProfitEarned = (investRes.data || []).reduce((acc: number, i: any) => acc + Number(i.total_profit_earned || 0), 0);

      setBioDetails({
        kyc: kycRes.data,
        referrer: referrerRes.data,
        referralsCount: refCountRes.count || 0,
        depositsTotal,
        depositsCount: depositsRes.data?.length || 0,
        withdrawalsTotal,
        withdrawalsCount: withdrawRes.data?.length || 0,
        investmentsTotal: activeInvestmentsTotal,
        investmentsCount: activeInvestments.length,
        totalProfitEarned,
      });
    } catch (err) {
      console.error("Error loading user bio details:", err);
    } finally {
      setLoadingBio(false);
    }
  };

  const fetchUsers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setUsers(data);
  };

  const handleOpenBalanceModal = (user: any) => {
    setSelectedUser(user);
    setAmount("");
    setRemark("");
    setMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEmailModal = (user: any) => {
    setEmailUser(user);
    setEmailSubject(`Pantera Capital: Regarding Your Account (${user.email})`);
    setEmailMessage(
      `Hello ${user.full_name || user.username || "Investor"},\n\nWe are contacting you regarding your account on Pantera Capital.\n\nPlease let us know if you have any questions or require assistance with your portfolio.\n\nWarm regards,\nPantera Capital Investor Relations`
    );
    setEmailCtaText("ACCESS MY PORTFOLIO");
    setEmailCtaUrl("https://pantera.cfd/dashboard");
    setEmailSendInApp(true);
    setEmailMsg(null);
    setEmailTab("compose");
  };

  const handleApplyEmailPreset = (presetType: "general" | "deposit" | "kyc" | "vip") => {
    const name = emailUser?.full_name || emailUser?.username || "Investor";
    if (presetType === "general") {
      setEmailSubject("Pantera Capital: Important Account Update");
      setEmailMessage(
        `Hello ${name},\n\nWe wanted to share an important update regarding your investment account.\n\nIf you have any questions or need account support, our VIP desk is available 24/7.\n\nBest regards,\nPantera Capital Management`
      );
      setEmailCtaText("VIEW DASHBOARD");
      setEmailCtaUrl("https://pantera.cfd/dashboard");
    } else if (presetType === "deposit") {
      setEmailSubject("Pantera Capital: Funding & Deposit Assistance");
      setEmailMessage(
        `Hello ${name},\n\nWe noticed you are exploring funding options for your Pantera portfolio.\n\nOur institutional gateways support crypto deposits with fast confirmation. If you need any manual payment assistance or custom routing, please reply to this email.\n\nSincerely,\nTreasury & Payments Desk`
      );
      setEmailCtaText("DEPOSIT FUNDS NOW");
      setEmailCtaUrl("https://pantera.cfd/dashboard/deposit");
    } else if (presetType === "kyc") {
      setEmailSubject("Pantera Capital: Identity Verification (KYC) Notice");
      setEmailMessage(
        `Hello ${name},\n\nTo ensure regulatory compliance and secure high-volume withdrawals on your account, please complete your identity verification.\n\nYou can submit your valid passport or national ID directly in your investor portal.\n\nThank you,\nCompliance Team`
      );
      setEmailCtaText("COMPLETE KYC VERIFICATION");
      setEmailCtaUrl("https://pantera.cfd/dashboard/kyc");
    } else if (presetType === "vip") {
      setEmailSubject("Pantera Capital: Invitation to Private Staking Tier");
      setEmailMessage(
        `Hello ${name},\n\nCongratulations! Based on your account standing, you are eligible for our high-yield Private Tier investment allocations.\n\nEnjoy preferential settlement intervals and priority capital routing.\n\nCordially,\nVIP Asset Management`
      );
      setEmailCtaText("EXPLORE INVESTMENT TIERS");
      setEmailCtaUrl("https://pantera.cfd/dashboard/investments");
    }
  };

  const handleSendUserEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailUser?.email || !emailSubject.trim() || !emailMessage.trim()) {
      setEmailMsg({ text: "Please enter both a subject line and email body.", type: "error" });
      return;
    }

    setEmailSubmitting(true);
    setEmailMsg(null);

    try {
      const res = await fetch("/api/admin/email/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAudience: "single_user",
          singleEmail: emailUser.email.trim(),
          subject: emailSubject.trim(),
          message: emailMessage.trim(),
          ctaText: emailCtaText.trim() || undefined,
          ctaUrl: emailCtaText.trim() ? emailCtaUrl.trim() : undefined,
          sendInAppNotification: emailSendInApp,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch email");
      }

      setEmailMsg({
        text: `Email successfully delivered to ${emailUser.email}!`,
        type: "success",
      });

      setTimeout(() => {
        setEmailUser(null);
      }, 1500);
    } catch (err: any) {
      setEmailMsg({ text: err.message || "Failed to dispatch email.", type: "error" });
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleToggleFreezeUser = async (userId: string, currentBanned: boolean) => {
    const supabase = createClient();
    await supabase.from("profiles").update({ is_banned: !currentBanned }).eq("id", userId);
    fetchUsers();
  };

  const handleOpenStatement = async (user: any) => {
    setStatementUser(user);
    setLoadingStatement(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setUserTransactions(data || []);
    setLoadingStatement(false);
  };

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount || Number(amount) <= 0) return;

    setSubmitting(true);
    setMsg(null);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("admin_adjust_balance_rpc", {
      p_user_id: selectedUser.id,
      p_target_wallet: targetWallet,
      p_action: action,
      p_amount: Number(amount),
      p_remark: remark || `Admin balance adjustment (${action})`,
    });

    if (error) {
      setMsg({ text: error.message, type: "error" });
    } else if (data && !data.success) {
      setMsg({ text: data.message, type: "error" });
    } else {
      setMsg({ text: "User balance updated successfully!", type: "success" });
      setTimeout(() => {
        setIsModalOpen(false);
        fetchUsers();
      }, 1200);
    }

    setSubmitting(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage investor accounts, send individual emails, freeze/unfreeze wallets, and inspect statements.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search user, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="minimal-card p-6 border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="pb-3">User Details</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Deposit Wallet</th>
                <th className="pb-3">Interest Wallet</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs font-medium">
                    No users matching search query found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3">
                      <div
                        onClick={() => handleOpenBioModal(user)}
                        className="font-extrabold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Click to inspect full bio data & profile"
                      >
                        {user.full_name || user.username || "User"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          user.role === "admin"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          user.is_banned
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {user.is_banned ? "FROZEN" : "ACTIVE"}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-900">
                      ${Number(user.deposit_wallet || 0).toFixed(2)}
                    </td>
                    <td className="py-3 font-mono font-bold text-indigo-600">
                      ${Number(user.interest_wallet || 0).toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5 min-w-[360px]">
                        {/* Full Bio Data Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenBioModal(user)}
                          className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-xs"
                          title="View all bio data, personal details, KYC and portfolio"
                        >
                          <User className="w-3 h-3" />
                          <span>Bio Data</span>
                        </button>

                        {/* Direct Email Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEmailModal(user)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-xs"
                          title={`Send branded email to ${user.email}`}
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenStatement(user)}
                          className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap"
                          title="View Financial Audit Statement"
                        >
                          Statement
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFreezeUser(user.id, user.is_banned)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                            user.is_banned
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                          }`}
                        >
                          {user.is_banned ? "Unfreeze" : "Freeze"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem("impersonate_user_id", user.id);
                            sessionStorage.setItem("impersonate_user_email", user.email || "");
                            window.location.href = "/dashboard";
                          }}
                          className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap"
                          title="Impersonate & view dashboard as this user"
                        >
                          Login as User
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenBalanceModal(user)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-[11px] font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bio Data & Profile Inspector Modal */}
      {bioUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-2xl relative text-slate-800 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                  {(bioUser.full_name || bioUser.username || bioUser.email || "U").charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {bioUser.full_name || bioUser.username || "Investor Profile"}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      bioUser.role === "admin"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {bioUser.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      bioUser.is_banned
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {bioUser.is_banned ? "FROZEN" : "ACTIVE"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{bioUser.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBioUser(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => setBioTab("bio")}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bioTab === "bio" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                👤 Bio & Contact
              </button>
              <button
                type="button"
                onClick={() => setBioTab("finance")}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bioTab === "finance" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                💰 Financial Portfolio
              </button>
              <button
                type="button"
                onClick={() => setBioTab("payout")}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bioTab === "payout" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                💳 Payout & Crypto
              </button>
              <button
                type="button"
                onClick={() => setBioTab("referral")}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bioTab === "referral" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🤝 Referrals
              </button>
              <button
                type="button"
                onClick={() => setBioTab("kyc")}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  bioTab === "kyc" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🛡️ KYC Identity
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-4">
              {loadingBio ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  Loading investor bio details and intelligence...
                </div>
              ) : (
                <>
                  {/* TAB 1: Bio & Contact */}
                  {bioTab === "bio" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Full Legal Name</span>
                          <span className="font-extrabold text-slate-900 text-sm">{bioUser.full_name || "(Not provided)"}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Username</span>
                          <span className="font-bold text-slate-900 font-mono">@{bioUser.username || "(Not set)"}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Primary Email</span>
                          <span className="font-bold text-slate-900 font-mono">{bioUser.email}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Phone Number</span>
                          <span className="font-bold text-slate-900 font-mono">{bioUser.phone || "(Not provided)"}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:col-span-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Account User ID (UUID)</span>
                          <span className="font-mono text-slate-700 text-[11px] select-all">{bioUser.id}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Registration Timestamp</span>
                          <span className="text-slate-700 font-mono text-[11px]">
                            {bioUser.created_at ? new Date(bioUser.created_at).toLocaleString() : "-"}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Last Record Update</span>
                          <span className="text-slate-700 font-mono text-[11px]">
                            {bioUser.updated_at ? new Date(bioUser.updated_at).toLocaleString() : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Financial Portfolio */}
                  {bioTab === "finance" && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Deposit Wallet</span>
                          <span className="text-lg font-black text-slate-900 font-mono">
                            ${Number(bioUser.deposit_wallet || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Available for investment</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Interest Wallet</span>
                          <span className="text-lg font-black text-indigo-600 font-mono">
                            ${Number(bioUser.interest_wallet || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Withdrawable profit</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 border border-slate-200 rounded-xl bg-white">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved Deposits</span>
                          <span className="text-sm font-black text-emerald-600 font-mono">
                            ${Number(bioDetails?.depositsTotal || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">({bioDetails?.depositsCount || 0} deposits)</span>
                        </div>
                        <div className="p-3 border border-slate-200 rounded-xl bg-white">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved Withdrawals</span>
                          <span className="text-sm font-black text-slate-800 font-mono">
                            ${Number(bioDetails?.withdrawalsTotal || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">({bioDetails?.withdrawalsCount || 0} payouts)</span>
                        </div>
                        <div className="p-3 border border-slate-200 rounded-xl bg-white">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Staking Capital</span>
                          <span className="text-sm font-black text-indigo-600 font-mono">
                            ${Number(bioDetails?.investmentsTotal || 0).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">({bioDetails?.investmentsCount || 0} active packages)</span>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Lifetime Staking Profits Earned</span>
                          <span className="text-sm font-black text-emerald-700 font-mono">
                            +${Number(bioDetails?.totalProfitEarned || 0).toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const u = bioUser;
                            setBioUser(null);
                            handleOpenStatement(u);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                        >
                          View Full Statement &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Payout & Crypto */}
                  {bioTab === "payout" && (
                    <div className="space-y-4 text-xs">
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Preferred Withdrawal Method</span>
                        <div className="text-sm font-extrabold text-slate-900">
                          {bioUser.payout_method || "USDT (TRC-20)"}
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Payout Destination Wallet Address</span>
                          {bioUser.payout_address && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(bioUser.payout_address);
                                setCopiedAddress(true);
                                setTimeout(() => setCopiedAddress(false), 2000);
                              }}
                              className="text-indigo-600 hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedAddress ? "Copied!" : "Copy"}</span>
                            </button>
                          )}
                        </div>
                        <div className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 break-all select-all">
                          {bioUser.payout_address || "(No payout destination address configured yet)"}
                        </div>
                      </div>

                      {bioUser.payout_qr_code_url ? (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Uploaded Payout QR Code</span>
                          <div className="bg-white p-2 rounded-xl border border-slate-200 inline-block shadow-sm">
                            <img
                              src={bioUser.payout_qr_code_url}
                              alt="Payout QR Code"
                              className="w-44 h-44 object-contain rounded-lg"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                          No payout QR code uploaded by this user.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: Referrals */}
                  {bioTab === "referral" && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Personal Referral Code</span>
                          <span className="text-base font-extrabold text-indigo-600 font-mono tracking-wider">
                            {bioUser.referral_code || bioUser.username || "-"}
                          </span>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total Invited Downline</span>
                          <span className="text-base font-extrabold text-slate-900 font-mono">
                            {bioDetails?.referralsCount || 0} Users
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Referred By (Sponsor)</span>
                        {bioDetails?.referrer ? (
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {bioDetails.referrer.full_name || bioDetails.referrer.username}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px]">({bioDetails.referrer.email})</span>
                          </div>
                        ) : (
                          <div className="text-slate-500 italic">Direct Organic Registration (No Sponsor)</div>
                        )}
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Referral Signup URL</span>
                        <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200 select-all">
                          https://pantera.cfd/register?ref={bioUser.username || bioUser.referral_code}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: KYC Identity */}
                  {bioTab === "kyc" && (
                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">KYC Verification Status</span>
                          <span className="font-extrabold text-slate-900 text-sm capitalize">
                            {bioDetails?.kyc?.status || "Unverified / Not Submitted"}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            bioDetails?.kyc?.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : bioDetails?.kyc?.status === "pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {bioDetails?.kyc?.status || "UNVERIFIED"}
                        </span>
                      </div>

                      {bioDetails?.kyc ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Document Type</span>
                              <span className="font-bold text-slate-900 capitalize">{bioDetails.kyc.document_type || "-"}</span>
                            </div>
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Document Number</span>
                              <span className="font-bold text-slate-900 font-mono">{bioDetails.kyc.document_number || "-"}</span>
                            </div>
                          </div>

                          {bioDetails.kyc.admin_feedback && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                              <span className="text-[10px] font-bold uppercase block">Admin Verification Note:</span>
                              <span className="text-xs">{bioDetails.kyc.admin_feedback}</span>
                            </div>
                          )}

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Submitted Identity Proofs</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {bioDetails.kyc.document_front_url && (
                                <div className="border border-slate-200 rounded-xl p-2 bg-white space-y-1">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Document Front</span>
                                  <a href={bioDetails.kyc.document_front_url} target="_blank" rel="noreferrer" className="block">
                                    <img
                                      src={bioDetails.kyc.document_front_url}
                                      alt="Front ID"
                                      className="w-full h-36 object-cover rounded-lg border border-slate-100"
                                    />
                                  </a>
                                </div>
                              )}
                              {bioDetails.kyc.document_back_url && (
                                <div className="border border-slate-200 rounded-xl p-2 bg-white space-y-1">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Document Back</span>
                                  <a href={bioDetails.kyc.document_back_url} target="_blank" rel="noreferrer" className="block">
                                    <img
                                      src={bioDetails.kyc.document_back_url}
                                      alt="Back ID"
                                      className="w-full h-36 object-cover rounded-lg border border-slate-100"
                                    />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                          This investor has not submitted KYC identification documents yet.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer Quick Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const u = bioUser;
                    setBioUser(null);
                    handleOpenEmailModal(u);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const u = bioUser;
                    setBioUser(null);
                    handleOpenBalanceModal(u);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Adjust Balance</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleFreezeUser(bioUser.id, bioUser.is_banned)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                    bioUser.is_banned
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                  }`}
                >
                  {bioUser.is_banned ? "Unfreeze Account" : "Freeze Account"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setBioUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct User Email Modal */}
      {emailUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-2xl relative text-slate-800 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Send Direct Email to Investor
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Delivered from verified sender{" "}
                    <span className="font-mono text-emerald-600 font-bold">
                      support@pantera.cfd
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Tabs */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setEmailTab("compose")}
                    className={`px-2.5 py-1 font-bold rounded-md transition-all ${
                      emailTab === "compose"
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Compose
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailTab("preview")}
                    className={`px-2.5 py-1 font-bold rounded-md transition-all flex items-center gap-1 ${
                      emailTab === "preview"
                        ? "bg-white text-indigo-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailUser(null)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Recipient Details Bar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap justify-between items-center text-xs gap-2 flex-shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Recipient
                </span>
                <span className="font-extrabold text-slate-900 mr-2">
                  {emailUser.full_name || emailUser.username || "Investor"}
                </span>
                <span className="font-mono text-slate-500 text-[11px]">({emailUser.email})</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Deposit:</span>
                  <span className="font-bold text-slate-800">
                    ${Number(emailUser.deposit_wallet || 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Interest:</span>
                  <span className="font-bold text-indigo-600">
                    ${Number(emailUser.interest_wallet || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Feedback */}
            {emailMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 font-semibold flex-shrink-0 ${
                  emailMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                {emailMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{emailMsg.text}</span>
              </div>
            )}

            {/* Content Area */}
            <div className="overflow-y-auto flex-1 pr-1">
              {emailTab === "compose" ? (
                <form onSubmit={handleSendUserEmail} className="space-y-4">
                  {/* Quick Preset Buttons */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Quick Message Presets
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleApplyEmailPreset("general")}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                      >
                        Account Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyEmailPreset("deposit")}
                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-700 border border-emerald-200 cursor-pointer"
                      >
                        Deposit Assistance
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyEmailPreset("kyc")}
                        className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[10px] font-bold text-amber-700 border border-amber-200 cursor-pointer"
                      >
                        KYC Notice
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyEmailPreset("vip")}
                        className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[10px] font-bold text-indigo-700 border border-indigo-200 cursor-pointer"
                      >
                        VIP Invitation
                      </button>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      required
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g. Pantera Capital: Important Account Update"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  {/* Action Button (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Call-To-Action Button Label (Optional)
                      </label>
                      <input
                        type="text"
                        value={emailCtaText}
                        onChange={(e) => setEmailCtaText(e.target.value)}
                        placeholder="e.g. VIEW DASHBOARD"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Button Destination Link
                      </label>
                      <input
                        type="url"
                        value={emailCtaUrl}
                        onChange={(e) => setEmailCtaUrl(e.target.value)}
                        placeholder="https://pantera.cfd/dashboard"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Body Content
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Type your message to this investor here..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Also create in-app notification */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={emailSendInApp}
                      onChange={(e) => setEmailSendInApp(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Also place a notification record in this investor's dashboard inbox
                    </span>
                  </label>

                  {/* Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEmailUser(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={emailSubmitting}
                      className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{emailSubmitting ? "Delivering Email..." : "Send Email Now"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Live Preview Mode */
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-[#232742] bg-[#0E101D] shadow-xl p-5 text-slate-100 font-sans">
                    <div className="border-b border-[#232742] pb-3 mb-4">
                      <div className="text-lg font-black tracking-tight text-white">
                        PANTERA <span className="text-[#E9B737]">CAPITAL</span>
                      </div>
                      <div className="text-[8px] font-mono tracking-widest text-[#E9B737] uppercase">
                        INSTITUTIONAL DIGITAL ASSET INFRASTRUCTURE
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-white tracking-tight">
                        {emailSubject || "Account Notice"}
                      </h4>
                      {!(
                        emailMessage.trim().toLowerCase().startsWith("hello") ||
                        emailMessage.trim().toLowerCase().startsWith("dear") ||
                        emailMessage.trim().toLowerCase().startsWith("hi ") ||
                        emailMessage.trim().toLowerCase().startsWith("good") ||
                        emailMessage.trim().toLowerCase().startsWith("greetings")
                      ) && (
                        <p className="text-xs text-slate-300">
                          Hello {emailUser.full_name || emailUser.username || "Investor"},
                        </p>
                      )}
                      <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {emailMessage || "Your message body content will appear here..."}
                      </div>

                      {emailCtaText && (
                        <div className="text-center py-3">
                          <span className="inline-block bg-[#E9B737] text-[#0E101D] font-extrabold text-xs px-5 py-2 rounded-lg shadow-md uppercase tracking-wider">
                            {emailCtaText} &rarr;
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#232742] pt-3 mt-4 text-[9px] text-slate-500 leading-relaxed">
                      This official communication was transmitted by Pantera Capital to{" "}
                      <span className="font-mono text-slate-400">{emailUser.email}</span>.
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setEmailTab("compose")}
                      className="text-xs text-indigo-600 hover:underline font-bold"
                    >
                      &larr; Return to Compose
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl relative text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Adjust User Balance</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Target User: <strong className="text-slate-900">{selectedUser.email}</strong>
            </div>

            {msg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center space-x-2 font-semibold ${
                  msg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-rose-50 border border-rose-200 text-rose-700"
                }`}
              >
                {msg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleAdjustBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Target Wallet
                </label>
                <select
                  value={targetWallet}
                  onChange={(e: any) => setTargetWallet(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  <option value="deposit_wallet">
                    Deposit Wallet (${Number(selectedUser.deposit_wallet || 0).toFixed(2)})
                  </option>
                  <option value="interest_wallet">
                    Interest Wallet (${Number(selectedUser.interest_wallet || 0).toFixed(2)})
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Action Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAction("add")}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer border transition-all ${
                      action === "add"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Funds</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAction("subtract")}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer border transition-all ${
                      action === "subtract"
                        ? "bg-rose-50 text-rose-700 border-rose-300 font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <MinusCircle className="w-3.5 h-3.5" />
                    <span>Subtract Funds</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Admin Remark / Note
                </label>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Reason for adjustment..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full minimal-btn-primary py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-indigo-600/15"
              >
                {submitting ? "Processing..." : "Confirm Adjustment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Financial Statement Modal */}
      {statementUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-2xl relative text-slate-800 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Financial Audit Statement</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setStatementUser(null)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center text-xs flex-shrink-0">
              <div>
                <div className="font-extrabold text-slate-900">
                  {statementUser.full_name || "Investor"}
                </div>
                <div className="text-slate-500 font-mono">{statementUser.email}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Balances</div>
                <div className="font-mono font-extrabold text-indigo-600 text-sm">
                  $
                  {(
                    Number(statementUser.deposit_wallet || 0) +
                    Number(statementUser.interest_wallet || 0)
                  ).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 pr-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Wallet</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingStatement ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        Loading ledger data...
                      </td>
                    </tr>
                  ) : userTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No transaction logs recorded for this investor.
                      </td>
                    </tr>
                  ) : (
                    userTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-2.5 font-bold uppercase text-[10px] text-indigo-600">
                          {tx.type}
                        </td>
                        <td className="py-2.5 font-mono text-slate-500 text-[11px]">
                          {tx.wallet_type || "deposit"}
                        </td>
                        <td
                          className={`py-2.5 font-mono font-bold ${
                            Number(tx.amount) >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {Number(tx.amount) >= 0 ? "+" : ""}${Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-2.5 text-slate-600 text-[11px] truncate max-w-xs">
                          {tx.description || "-"}
                        </td>
                        <td className="py-2.5 text-right text-slate-500 text-[10px]">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
