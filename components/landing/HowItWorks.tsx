"use client";

import { useEffect, useState, useRef } from "react";
import { UserPlus, Wallet, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import gsap from "gsap";

const ICONS = [UserPlus, Wallet, TrendingUp];

export default function HowItWorks() {
  const [steps, setSteps] = useState([
    {
      step: 1,
      title: "Open Free Account",
      desc: "Complete registration in 60 seconds with your email. Instant dashboard access with zero setup fees or paperwork.",
    },
    {
      step: 2,
      title: "Fund & Choose Vault",
      desc: "Deposit using USDT (TRC20/ERC20), Bitcoin, Ethereum, or wire transfer. Activate your chosen yield tier in one click.",
    },
    {
      step: 3,
      title: "Receive Weekly Returns",
      desc: "Automated yield is credited weekly directly to your interest wallet. Reinvest to compound or withdraw anytime with zero lockup friction.",
    },
  ]);

  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from("system_settings").select("*").single();
      if (data?.meta?.how_it_works && Array.isArray(data.meta.how_it_works)) {
        setSteps(data.meta.how_it_works);
      }
    })();
  }, []);

  // GSAP subtle stagger on load
  useEffect(() => {
    if (!cardsContainerRef.current) return;
    const cards = cardsContainerRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out" }
    );
  }, [steps]);

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#08090C] border-b border-white/[0.06] relative overflow-hidden text-white">
      
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Process & Onboarding</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white">
            Start earning in three simple steps
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl mx-auto">
            Get started in under three minutes. Automated algorithmic compounding executed with complete mathematical transparency.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((stepItem: any, idx: number) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div
                key={idx}
                className="bg-[#0D0F16] border border-white/[0.07] hover:border-white/[0.18] rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-blue-400 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-3xl font-bold text-slate-600 font-mono select-none group-hover:text-blue-400 transition-colors">
                      0{stepItem.step || idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {stepItem.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {stepItem.desc}
                  </p>
                </div>

                <div className="pt-8 mt-6 border-t border-white/[0.05] flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Instant execution</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-[0_2px_12px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer active:scale-[0.98]"
          >
            <span>Open Your Investor Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
