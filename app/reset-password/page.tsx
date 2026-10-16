"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart2,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // 1. Inspect URL hash for direct tokens or errors
    if (typeof window !== "undefined" && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get("error_description");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (hashError) {
        if (isMounted) {
          setError(decodeURIComponent(hashError.replace(/\+/g, " ")));
          setVerifyingSession(false);
        }
        return;
      }

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          .then(({ data, error: setSessionError }: any) => {
            if (!isMounted) return;
            if (data?.session?.user) {
              setHasValidSession(true);
              setUserEmail(data.session.user.email || null);
              setUserName(
                data.session.user.user_metadata?.full_name ||
                  data.session.user.user_metadata?.username ||
                  null
              );
              setVerifyingSession(false);
            } else if (setSessionError) {
              console.warn("[ResetPassword] setSession error:", setSessionError.message);
            }
          });
      }
    }

    // 2. Check existing active session
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (session?.user) {
        setHasValidSession(true);
        setUserEmail(session.user.email || null);
        setUserName(
          session.user.user_metadata?.full_name ||
            session.user.user_metadata?.username ||
            null
        );
        setVerifyingSession(false);
      } else {
        // If there is an access_token in hash, give onAuthStateChange 2s before timing out
        const hasHashToken =
          typeof window !== "undefined" &&
          window.location.hash.includes("access_token");

        if (!hasHashToken) {
          setVerifyingSession(false);
        } else {
          setTimeout(() => {
            if (isMounted) setVerifyingSession(false);
          }, 2000);
        }
      }
    };

    checkSession();

    // 3. Listen to PASSWORD_RECOVERY & auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        if (!isMounted) return;
        if (event === "PASSWORD_RECOVERY" || session?.user) {
          setHasValidSession(true);
          setUserEmail(session?.user?.email || null);
          setUserName(
            session?.user?.user_metadata?.full_name ||
              session?.user?.user_metadata?.username ||
              null
          );
          setVerifyingSession(false);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify and re-enter.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      // Dispatch security notification email via Resend
      const emailToSend = userEmail || data?.user?.email;
      if (emailToSend) {
        fetch("/api/email/notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "password_changed",
            to: emailToSend,
            name: userName || "Investor",
          }),
        }).catch((err) =>
          console.warn("Failed to dispatch password changed security alert:", err)
        );
      }

      setSuccess(true);
      setLoading(false);

      // Redirect to login after 2 seconds
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push("/login?message=password_updated");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to update password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0E101D] relative overflow-hidden">
      {/* Background Gradients & Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#232742_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E9B737]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#15182B] border border-[#E9B737]/30 flex items-center justify-center text-[#E9B737]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-display">
              PANTERA<span className="text-[#E9B737]">.</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#E9B737] tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737]" />
            <span>[ CREDENTIAL MANAGEMENT ]</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-2">Set New Password</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Choose a robust master password to protect your institutional investments.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#15182B] border border-[#232742] rounded-2xl p-6 sm:p-8 shadow-2xl">
          {verifyingSession ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#E9B737] mx-auto" />
              <p className="text-xs text-zinc-400 font-mono">
                Verifying authorization token…
              </p>
            </div>
          ) : !hasValidSession && !success ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">
                  Recovery Session Expired or Missing
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The password reset authorization token is invalid, expired, or was already used. Please request a fresh reset link.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/forgot-password"
                  className="hm-btn hm-btn-primary inline-flex items-center gap-2 py-2.5 px-6 text-xs"
                >
                  <span>Request New Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white">Password Updated!</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your master password has been securely updated. A confirmation email has been dispatched via Resend. Redirecting to login…
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-[#E9B737] hover:underline"
                >
                  Click here if not redirected automatically &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {userEmail && (
                <div className="bg-[#0E101D] border border-[#232742] rounded-lg p-3 text-xs flex items-center justify-between">
                  <span className="text-zinc-400 font-mono text-[11px]">UPDATING ACCOUNT:</span>
                  <span className="text-white font-mono font-medium">{userEmail}</span>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider font-mono">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0E101D] border border-[#232742] rounded-xl px-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E9B737] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider font-mono">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0E101D] border border-[#232742] rounded-xl px-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E9B737] transition-colors"
                  />
                </div>
              </div>

              <div className="text-[11px] text-zinc-500 space-y-1 font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? "bg-emerald-400" : "bg-zinc-600"}`} />
                  <span>At least 6 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${password && password === confirmPassword ? "bg-emerald-400" : "bg-zinc-600"}`} />
                  <span>Passwords match</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E9B737] hover:bg-[#d6a52b] text-[#0E101D] font-bold py-3 text-xs rounded-xl flex items-center justify-center gap-2 mt-4 cursor-pointer transition-colors disabled:opacity-60 font-mono tracking-wider uppercase"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Credentials…</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#232742] flex items-center justify-center gap-2 text-zinc-500 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E9B737]" />
            <span>Encrypted Credential Transmission</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            &larr; Back to Pantera Login
          </Link>
        </div>
      </div>
    </div>
  );
}
