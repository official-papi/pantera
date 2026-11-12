"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function YouHodlerCta() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      router.push(`/register?email=${encodeURIComponent(email.trim())}`);
    } else {
      router.push("/register");
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#08090C] text-white relative overflow-hidden">
      
      {/* Background glow halos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="rounded-3xl bg-[#0D0F16] border border-white/[0.08] p-10 sm:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.06)] relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Start Compounding Today</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.035em] text-white max-w-3xl mx-auto leading-tight">
            Ready to put your digital assets to work?
          </h2>

          <p className="mt-5 text-sm sm:text-base text-slate-400 font-normal max-w-xl mx-auto leading-relaxed">
            Join over 124,000 investors earning automated weekly returns up to 15.5%. Zero setup friction, cold storage custody, and instant liquidity.
          </p>

          {/* Email input fast start */}
          <form onSubmit={handleSubmit} className="mt-10 max-w-lg mx-auto">
            <div className="p-2 bg-[#08090C] border border-white/[0.1] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to start"
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_2px_10px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] cursor-pointer flex items-center justify-center gap-2 flex-shrink-0 active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No setup fees
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Weekly disbursements
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant withdrawals
              </span>
            </div>
          </form>

        </div>

      </div>
    </section>
  );
}
