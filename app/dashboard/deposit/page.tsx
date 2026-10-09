"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DepositModal from "@/components/dashboard/DepositModal";
import { ArrowDownRight, Wallet, History, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getActiveUser } from "@/lib/auth/activeUser";

export default function DepositPage() {
  const [userEmail, setUserEmail] = useState("");
  const [depositWallet, setDepositWallet] = useState(0);
  const [depositLogs, setDepositLogs] = useState<any[]>([]);
  const [gateways, setGateways] = useState<any[]>([]);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const fetchDepositData = async () => {
    const supabase = createClient();
    const activeUser = await getActiveUser(supabase);
    if (activeUser) {
      setUserEmail(activeUser.email);
      const [profileRes, logsRes, gatewaysRes] = await Promise.all([
        supabase.from("profiles").select("deposit_wallet").eq("id", activeUser.id).single(),
        supabase.from("deposits").select("*").eq("user_id", activeUser.id).order("created_at", { ascending: false }),
        supabase.from("gateways").select("*").eq("status", true),
      ]);
      if (profileRes.data) setDepositWallet(Number(profileRes.data.deposit_wallet || 0));
      if (logsRes.data) setDepositLogs(logsRes.data);
      if (gatewaysRes.data && gatewaysRes.data.length > 0) setGateways(gatewaysRes.data);
    }
  };

  useEffect(() => {
    fetchDepositData();
  }, []);

  return (
    <DashboardLayout userEmail={userEmail}>
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-[#15182B] tracking-[0.2em] uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737]" />
              <span>[ CAPITAL INFLOW CONSOLE ]</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[#0E101D] uppercase">Deposit Funds</h1>
            <p className="text-xs text-slate-500 mt-1">Fund your Deposit Wallet via USDT TRC20, Bitcoin, or Bank Wire.</p>
          </div>

          <button
            type="button"
            onClick={() => setIsDepositOpen(true)}
            className="pantera-btn-navy py-2.5 px-4 text-xs font-mono font-bold flex items-center space-x-2 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#E9B737]" />
            <span>MAKE NEW DEPOSIT</span>
          </button>
        </div>

        {/* Balance Stat Card */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-6 max-w-sm shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#15182B]" />
          <div className="text-[11px] text-slate-400 font-mono font-bold uppercase tracking-wider">Available Deposit Balance</div>
          <div className="text-3xl font-extrabold font-mono text-[#0E101D] mt-1">${depositWallet.toFixed(2)}</div>
        </div>

        {/* Deposit Logs Table */}
        <div className="bg-white border border-[#E2E4EC] rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#0E101D] mb-4 flex items-center space-x-2 font-display uppercase tracking-wide">
            <History className="w-4 h-4 text-[#15182B]" />
            <span>Deposit History Ledger</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E4EC] text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                  <th className="pb-3">Gateway</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">TX Hash / Ref</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {depositLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-medium">
                      No deposit records found. Click &quot;Make New Deposit&quot; to start.
                    </td>
                  </tr>
                ) : (
                  depositLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-bold text-[#0E101D] uppercase font-mono">{log.gateway_name || log.gateway || "Deposit Gateway"}</td>
                      <td className="py-3 font-mono font-extrabold text-[#15182B]">${Number(log.amount).toFixed(2)}</td>
                      <td className="py-3 font-mono text-slate-500 text-[11px] truncate max-w-[150px]">{log.trx_id || log.transaction_id || "-"}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          log.status === "approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          log.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                          "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 text-[11px]">{new Date(log.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DepositModal
          isOpen={isDepositOpen}
          gateways={gateways}
          onClose={() => setIsDepositOpen(false)}
          onSuccess={fetchDepositData}
        />

      </div>
    </DashboardLayout>
  );
}
