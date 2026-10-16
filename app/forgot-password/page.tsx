"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart2,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send reset link. Please try again.");
      } else {
        setSuccess(
          data.message ||
            "A secure password reset link has been dispatched to your email address."
        );
        setCooldown(60); // 60s cooldown before allowing resend
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex w-[42%] bg-[#0E101D] flex-col justify-between p-12 relative overflow-hidden border-r border-[#232742]">
        {/* Pantera Grid Texture */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="auth-grid-forgot"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#E2E4EC"
                  strokeWidth="0.5"
                  strokeOpacity="0.25"
                />
                <circle cx="40" cy="0" r="1" fill="#E9B737" fillOpacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid-forgot)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-b from-[#E9B737]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#232742_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#15182B] border border-[#E9B737]/30 flex items-center justify-center text-[#E9B737]">
            <BarChart2 className="w-4.5 h-4.5" />
          </div>
          <span className="text-[19px] font-bold text-white tracking-tight font-display">
            PANTERA<span className="text-[#E9B737]">.</span>
          </span>
        </div>

        {/* Brand Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-[#E9B737] tracking-[0.2em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
              <span>[ SECURITY & RECOVERY ]</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight font-display uppercase">
              Secure Account<br />Recovery Desk.
            </h2>
            <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-sans">
              Enter your registered email address to receive an encrypted authorization link and restore full access to your digital asset portfolios.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: ShieldCheck, label: "Encrypted one-time authorization tokens" },
              { icon: TrendingUp, label: "Immediate portfolio access restoration" },
              { icon: Zap, label: "Instant email delivery powered by Resend" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#15182B] border border-[#232742] flex items-center justify-center flex-shrink-0 text-[#E9B737]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-zinc-300 text-xs font-mono">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust */}
        <div className="relative z-10 pt-6 border-t border-[#232742]">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E9B737]" />
            <span>256-bit TLS · Real-time fraud detection · Cold storage security</span>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-[#fafafa]">
        <div className="w-full max-w-[390px]">
          {/* Mobile Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#15182B] flex items-center justify-center text-[#E9B737]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-zinc-950 font-display">
              PANTERA<span className="text-[#E9B737]">.</span>
            </span>
          </Link>

          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 font-medium transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
            <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
              Reset your password
            </h1>
            <p className="text-zinc-500 text-xs mt-1.5 font-normal">
              Enter your email and we&apos;ll dispatch a secure recovery link.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5 text-red-600 text-xs font-normal">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                <div className="space-y-1">
                  <p className="font-semibold text-emerald-900">Email Dispatched</p>
                  <p className="text-emerald-700 leading-relaxed">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider"
              >
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="hm-input hm-input-with-icon-left"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="hm-btn hm-btn-primary w-full py-3 text-xs mt-2 cursor-pointer font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting link…</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Resend link in {cooldown}s</span>
                </>
              ) : (
                <>
                  <span>{success ? "Resend Reset Link" : "Send Password Reset Link"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {success && (
            <div className="mt-4 text-center">
              <p className="text-xs text-zinc-400">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || cooldown > 0}
                  className="text-zinc-950 font-semibold underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  click to resend {cooldown > 0 ? `(${cooldown}s)` : ""}
                </button>
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-200 text-center">
            <p className="text-xs text-zinc-500 font-normal">
              Remembered your credentials?{" "}
              <Link
                href="/login"
                className="font-semibold text-zinc-950 hover:underline transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
