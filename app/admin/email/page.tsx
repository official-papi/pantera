"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  Sparkles,
  UserCheck,
  SendHorizontal,
  ExternalLink,
} from "lucide-react";

export default function AdminEmailPage() {
  const [targetAudience, setTargetAudience] = useState("all");
  const [singleEmail, setSingleEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("https://pantera.cfd/dashboard");
  const [sendInApp, setSendInApp] = useState(true);

  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "preview">("compose");

  // Dispatch real broadcast or single email
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setStatusMsg({ text: "Please enter both subject and message body.", type: "error" });
      return;
    }
    if (targetAudience === "single_user" && (!singleEmail.trim() || !singleEmail.includes("@"))) {
      setStatusMsg({ text: "Please enter a valid recipient email address.", type: "error" });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/email/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAudience,
          singleEmail: targetAudience === "single_user" ? singleEmail.trim() : undefined,
          subject: subject.trim(),
          message: message.trim(),
          ctaText: ctaText.trim() || undefined,
          ctaUrl: ctaText.trim() ? ctaUrl.trim() : undefined,
          sendInAppNotification: sendInApp,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to dispatch broadcast");
      }

      setStatusMsg({
        text: `Success! Delivered email to ${data.sentCount} recipient${
          data.sentCount === 1 ? "" : "s"
        }${data.failedCount > 0 ? ` (${data.failedCount} failed)` : ""}.`,
        type: "success",
      });

      // Clear if sent to single user
      if (targetAudience === "single_user") {
        setSingleEmail("");
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to dispatch email.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Quick test email dispatch
  const handleSendTest = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      setStatusMsg({ text: "Please enter a valid test recipient email address.", type: "error" });
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setStatusMsg({ text: "Please provide a subject and message before testing.", type: "error" });
      return;
    }

    setSendingTest(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/email/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAudience: "single_user",
          singleEmail: testEmail.trim(),
          subject: `[TEST] ${subject.trim()}`,
          message: message.trim(),
          ctaText: ctaText.trim() || undefined,
          ctaUrl: ctaText.trim() ? ctaUrl.trim() : undefined,
          sendInAppNotification: false,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send test email");
      }

      setStatusMsg({
        text: `Test email successfully dispatched to ${testEmail}! Check your inbox.`,
        type: "success",
      });
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to send test email.", type: "error" });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-600" />
            Email Broadcast & Dispatch Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Send real branded emails via verified domain{" "}
            <span className="font-mono text-indigo-600 font-bold">support@pantera.cfd</span> to all investors or specific individuals.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab("compose")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "compose"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Compose
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 font-semibold shadow-sm transition-all ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-rose-50 border border-rose-200 text-rose-700"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Quick Test Bar */}
      <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-800">Send Test Email First</p>
            <p className="text-[11px] text-slate-500">
              Verify how your email looks in your inbox before sending to all users.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your-email@gmail.com"
            className="w-full sm:w-64 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
          <button
            type="button"
            onClick={handleSendTest}
            disabled={sendingTest}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer disabled:opacity-50"
          >
            {sendingTest ? "Sending..." : "Test Send"}
          </button>
        </div>
      </div>

      {activeTab === "compose" ? (
        /* Main Compose Card */
        <div className="minimal-card p-6 border-slate-200 space-y-6">
          <form onSubmit={handleSendBroadcast} className="space-y-5">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Target Recipient Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-bold"
              >
                <option value="all">📢 All Registered Investors (Broadcast to All)</option>
                <option value="active_investors">💎 Active Depositors & Investors Only</option>
                <option value="kyc_approved">🛡️ KYC Verified Accounts Only</option>
                <option value="single_user">👤 Single Specific User (Direct Email)</option>
              </select>
            </div>

            {/* Conditional Single Recipient Field */}
            {targetAudience === "single_user" && (
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Specific Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={singleEmail}
                  onChange={(e) => setSingleEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="w-full bg-white border border-indigo-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>
            )}

            {/* Subject Line */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Subject Line
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Pantera Capital: Important Platform Upgrade & Yield Announcement"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            {/* Call To Action Buttons (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Action Button Label (Optional)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="e.g. EXPLORE INVESTMENT TIERS"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Action Button Destination Link
                </label>
                <input
                  type="url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://pantera.cfd/dashboard"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Content Body
                </label>
                <span className="text-[11px] text-slate-400">
                  Separated by paragraphs or raw HTML
                </span>
              </div>
              <textarea
                rows={10}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dear Investor,&#10;&#10;We are thrilled to announce new institutional staking contracts with optimized payout intervals.&#10;&#10;Log in to your account today to configure your portfolio strategy."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 leading-relaxed font-sans"
              />
            </div>

            {/* Options Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendInApp}
                onChange={(e) => setSendInApp(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700">
                Also post as an In-App Notification in user dashboards
              </span>
            </label>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="minimal-btn-primary px-7 py-3 rounded-xl text-xs font-extrabold cursor-pointer shadow-lg shadow-indigo-600/20 flex items-center space-x-2 disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submitting
                    ? "Dispatching Emails..."
                    : targetAudience === "single_user"
                    ? "Send Direct Email"
                    : "Transmit Mass Broadcast"}
                </span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Live Preview Card */
        <div className="minimal-card p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Rendered Template Preview</h3>
              <p className="text-[11px] text-slate-500">
                Subject: <span className="font-semibold text-slate-800">{subject || "(No subject set)"}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("compose")}
              className="text-xs text-indigo-600 hover:underline font-bold"
            >
              Back to Editor &rarr;
            </button>
          </div>

          {/* Email mockup frame */}
          <div className="rounded-2xl overflow-hidden border border-[#232742] bg-[#0E101D] shadow-2xl max-w-xl mx-auto p-4 sm:p-6 text-slate-100 font-sans">
            {/* Header */}
            <div className="border-b border-[#232742] pb-5 mb-5">
              <div className="text-xl font-black tracking-tight text-white">
                PANTERA <span className="text-[#E9B737]">CAPITAL</span>
              </div>
              <div className="text-[9px] font-mono tracking-widest text-[#E9B737] uppercase mt-0.5">
                INSTITUTIONAL DIGITAL ASSET INFRASTRUCTURE
              </div>
            </div>

            {/* Body */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {subject || "Platform Announcement"}
              </h2>
              <p className="text-xs text-slate-300">
                Hello {targetAudience === "single_user" ? singleEmail || "Investor" : "Valued Investor"},
              </p>
              <div className="text-xs text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
                {message || "Your message body content will appear here..."}
              </div>

              {ctaText && (
                <div className="text-center py-4">
                  <span className="inline-block bg-[#E9B737] text-[#0E101D] font-extrabold text-xs px-6 py-2.5 rounded-lg shadow-md uppercase tracking-wider">
                    {ctaText} &rarr;
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#232742] pt-4 mt-6 text-[10px] text-slate-500 leading-relaxed">
              This official communication was transmitted by Pantera Capital Institutional Portal.
              Sent from <span className="text-slate-400 font-mono">support@pantera.cfd</span>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
