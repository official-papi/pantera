"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Users, Copy, Check, Share2, Award } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getActiveUser } from "@/lib/auth/activeUser";

export default function ReferralPage() {
  const [userEmail, setUserEmail] = useState("");
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralTree, setReferralTree] = useState<any[]>([]);

  const fetchReferralData = async () => {
    const supabase = createClient();
    const activeUser = await getActiveUser(supabase);
    if (activeUser) {
      setUserEmail(activeUser.email);
      const { data: profile } = await supabase.from("profiles").select("referral_code, username").eq("id", activeUser.id).single();
      if (profile) setRefCode(profile.username || profile.referral_code || "");

      // Query level 1 referrals
      const { data: refs } = await supabase.from("profiles").select("id, full_name, created_at").eq("referred_by", activeUser.id);
      if (refs) setReferralTree(refs);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const referralUrl = typeof window !== "undefined" ? `${window.location.origin}/register?ref=${refCode}` : `?ref=${refCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout userEmail={userEmail}>
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-[#15182B] tracking-[0.2em] uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737]" />
              <span>[ PARTNER NETWORK CONSOLE ]</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[#0E101D] uppercase">Multi-Tier Referral Network</h1>
            <p className="text-xs text-slate-500 mt-1">Earn 5% Level 1, 3% Level 2, and 1% Level 3 downline commissions automatically.</p>
          </div>
        </div>

        {/* Copy Referral Link Box */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-6 max-w-3xl shadow-xs">
          <label className="block text-xs font-mono font-bold text-slate-600 uppercase tracking-wider mb-2">
            Your Unique Referral Partner Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="bg-slate-50 border border-[#E2E4EC] rounded-xl flex-1 px-4 py-2.5 text-xs font-mono font-extrabold text-[#15182B] select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="pantera-btn-navy py-2.5 px-5 text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-[#E9B737]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "COPIED!" : "COPY URL"}</span>
            </button>
          </div>
        </div>

        {/* Commission Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          <div className="bg-white border border-[#E2E4EC] rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#15182B]" />
            <div className="text-[11px] font-mono font-bold text-[#15182B] uppercase">Level 1 Commission</div>
            <div className="text-2xl font-extrabold font-mono text-[#0E101D] mt-1">5.0%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Direct Introduced Investors</div>
          </div>
          <div className="bg-white border border-[#E2E4EC] rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E9B737]" />
            <div className="text-[11px] font-mono font-bold text-[#15182B] uppercase">Level 2 Commission</div>
            <div className="text-2xl font-extrabold font-mono text-[#0E101D] mt-1">3.0%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Secondary Downline</div>
          </div>
          <div className="bg-white border border-[#E2E4EC] rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0E101D]" />
            <div className="text-[11px] font-mono font-bold text-[#15182B] uppercase">Level 3 Commission</div>
            <div className="text-2xl font-extrabold font-mono text-[#0E101D] mt-1">1.0%</div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Tertiary Downline</div>
          </div>
        </div>

        {/* Downline Tree Table */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-6 max-w-3xl shadow-xs">
          <h3 className="text-sm font-bold text-[#0E101D] mb-4 flex items-center space-x-2 font-display uppercase tracking-wide">
            <Users className="w-4 h-4 text-[#15182B]" />
            <span>Direct Downline Partners ({referralTree.length})</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E4EC] text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                  <th className="pb-3">Investor Name</th>
                  <th className="pb-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referralTree.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-slate-400 text-xs font-medium">
                      No referred investors found yet. Share your partner link to start building your network.
                    </td>
                  </tr>
                ) : (
                  referralTree.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-bold text-[#0E101D] font-mono">{ref.full_name || "Investor Partner"}</td>
                      <td className="py-3 text-slate-500 text-[11px] font-mono">{new Date(ref.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
