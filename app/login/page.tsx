"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart2, Lock, Mail, ArrowRight, AlertCircle, Loader2,
  Eye, EyeOff, TrendingUp, ShieldCheck, Zap
} from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await createClient().auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex w-[42%] bg-[#0E101D] flex-col justify-between p-12 relative overflow-hidden border-r border-[#232742]">
        
        {/* Ambient fintech geometric artwork */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <Image
            src="/images/auth-bg.jpg"
            alt="Fintech telemetry background"
            fill
            priority
            className="object-cover object-center opacity-30 filter contrast-125 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E101D] via-[#0E101D]/80 to-[#15182B]/60" />
        </div>

        {/* Subtle dot matrix texture */}
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

        {/* Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold text-[#E9B737] tracking-[0.2em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
              <span>[ INSTITUTIONAL ACCESS ]</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight font-display uppercase">
              Invest Smarter.<br />Earn Daily.<br />Withdraw Freely.
            </h2>
            <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-sans">
              Join 124,500+ investors earning automated weekly returns through Pantera&apos;s institutional digital asset yield infrastructure.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: TrendingUp,  label: "Up to 15.0% weekly ROI on managed portfolios" },
              { icon: ShieldCheck, label: "256-bit SSL encrypted institutional custody" },
              { icon: Zap,         label: "Real-time automated on-chain settlements" },
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

        {/* Bottom trust */}
        <div className="relative z-10 pt-6 border-t border-[#232742]">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E9B737]" />
            <span>Audited reserves · Real-time ledger · Cold storage custody</span>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-[#fafafa]">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#15182B] flex items-center justify-center text-[#E9B737]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-zinc-950 font-display">
              PANTERA<span className="text-[#E9B737]">.</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">Welcome back</h1>
            <p className="text-zinc-500 text-xs mt-1.5 font-normal">Sign in to your investor portal</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2.5 text-red-600 text-xs font-normal">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  id="email" type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="hm-input hm-input-with-icon-left"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs text-zinc-600 hover:text-zinc-950 font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  id="password" type={showPw ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="hm-input hm-input-with-icon-left hm-input-with-icon-right"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="hm-btn hm-btn-primary w-full py-3 text-xs mt-2 cursor-pointer font-medium">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
              ) : (
                <><span>Sign In to Account</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-200 text-center">
            <p className="text-xs text-zinc-500 font-normal">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-zinc-950 hover:underline transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
