"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getPlanIntervalInfo } from "@/lib/plans/intervals";
import gsap from "gsap";

interface PlanItem {
  id: string;
  name: string;
  rate: string;
  cycle: string;
  interval?: string;
  min: string;
  max: string;
  featured: boolean;
  badge: string;
  features: string[];
}

const DEFAULT_PLANS: PlanItem[] = [
  {
    id: "1",
    name: "Starter Vault",
    rate: "2.5%",
    cycle: "Weekly for 8 Weeks",
    interval: "week",
    min: "$500",
    max: "$2,000",
    featured: false,
    badge: "Starter",
    features: [
      "2.5% weekly automated return",
      "Principal returned at end of term",
      "Instant on-chain withdrawals",
      "Standard 24/7 client support",
    ],
  },
  {
    id: "2",
    name: "Growth Tier",
    rate: "4.0%",
    cycle: "Weekly for 12 Weeks",
    interval: "week",
    min: "$3,000",
    max: "$5,000",
    featured: false,
    badge: "Growth",
    features: [
      "4.0% weekly automated return",
      "Principal returned at end of term",
      "Zero withdrawal fees",
      "Tiered referral commission",
    ],
  },
  {
    id: "3",
    name: "Executive Tier",
    rate: "6.0%",
    cycle: "Weekly for 16 Weeks",
    interval: "week",
    min: "$10,000",
    max: "$20,000",
    featured: true,
    badge: "Most Popular",
    features: [
      "6.0% weekly automated return",
      "Principal returned at end of term",
      "Priority automated disbursements",
      "Dedicated account relationship manager",
    ],
  },
  {
    id: "4",
    name: "VIP High Yield",
    rate: "10.0%",
    cycle: "Weekly for 24 Weeks",
    interval: "week",
    min: "$50,000",
    max: "$200,000",
    featured: false,
    badge: "High Yield",
    features: [
      "10.0% weekly automated return",
      "Principal returned at end of term",
      "Dedicated cold storage vault",
      "24/7 concierge wealth desk",
    ],
  },
  {
    id: "5",
    name: "Institutional Vault",
    rate: "12.0%",
    cycle: "Weekly for 36 Weeks",
    interval: "week",
    min: "$500,000",
    max: "$3,000,000",
    featured: false,
    badge: "Institutional",
    features: [
      "12.0% weekly automated return",
      "Principal returned at end of term",
      "Segregated multi-sig custody",
      "Private wealth advisory allocation",
    ],
  },
  {
    id: "6",
    name: "Sovereign Elite",
    rate: "15.5%",
    cycle: "Weekly for 52 Weeks",
    interval: "week",
    min: "$5,000,000",
    max: "$20,000,000",
    featured: true,
    badge: "Sovereign",
    features: [
      "15.5% weekly automated return",
      "Installment loan financing facility",
      "Principal returned at end of term",
      "Direct private banker & custom OTC desk",
    ],
  },
];

export default function PlanCards() {
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleScroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 370;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("investment_plans")
        .select("*")
        .eq("is_active", true)
        .order("min_amount", { ascending: true });

      if (data && data.length > 0) {
        const formatted: PlanItem[] = data.map((p: any) => {
          const intervalInfo = getPlanIntervalInfo(p.payout_interval_hours, p.total_payout_periods);
          const intervalText = intervalInfo.label;
          const cycleText = intervalInfo.cycleText;
          const isElite = (p.name || "").toLowerCase().includes("elite");

          const customFeatures = [];
          customFeatures.push(`${p.roi_percentage}% ${intervalText} return`);
          if (isElite) {
            customFeatures.push("Installment loan financing facility");
          }
          customFeatures.push(p.capital_back ? "Principal returned at end of term" : "Compounded return payout");
          customFeatures.push("Instant on-chain disbursements");
          customFeatures.push(isElite || Number(p.min_amount) >= 50000 ? "Private wealth relationship manager" : "Multi-tier referral program");

          return {
            id: p.id,
            name: p.name,
            rate: `${p.roi_percentage}%`,
            cycle: cycleText,
            interval: intervalText.toLowerCase(),
            min: `$${Number(p.min_amount).toLocaleString()}`,
            max: `$${Number(p.max_amount).toLocaleString()}`,
            featured: p.badge === "Most Popular" || isElite || (p.name || "").includes("Gold"),
            badge: p.badge || (isElite ? "Sovereign" : "Standard"),
            features: customFeatures,
          };
        });
        setPlans(formatted);
      }
    })();
  }, []);

  // GSAP subtle stagger entrance
  useEffect(() => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll(".plan-card");
    if (!cards || cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power2.out" }
    );
  }, [plans]);

  return (
    <section
      ref={sectionRef}
      id="plans"
      className="py-24 sm:py-32 bg-[#08090C] text-white border-b border-white/[0.06] relative overflow-hidden"
    >
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Investment Vehicles</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white">
              Curated yield tiers
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl">
              Diversified, algorithmically balanced compounding vaults backed by cold liquidity reserves and guaranteed principal return.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Scroll to explore all vaults →
            </span>
            <div className="flex items-center space-x-1.5 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.08]">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll left"
                className="w-8 h-8 rounded-lg bg-[#0E1118] text-slate-300 flex items-center justify-center border border-white/[0.08] hover:border-white/[0.2] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll right"
                className="w-8 h-8 rounded-lg bg-[#0E1118] text-slate-300 flex items-center justify-center border border-white/[0.08] hover:border-white/[0.2] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {plans.map((plan, i) => (
            <div
              key={plan.id || i}
              className={`plan-card w-[310px] sm:w-[360px] flex-shrink-0 snap-start relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.featured
                  ? "bg-[#0E121C] border border-blue-500/40 shadow-[0_12px_40px_rgba(37,99,235,0.12),inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                  : "bg-[#0C0E14] border border-white/[0.07] hover:border-white/[0.16] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              }`}
            >
              {/* Badge */}
              {plan.featured ? (
                <div className="absolute -top-3 left-7 bg-blue-600 text-white font-medium text-[11px] px-3 py-0.5 rounded-full shadow-md">
                  {plan.badge}
                </div>
              ) : (
                <div className="absolute top-6 right-6">
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Body */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 pr-16 tracking-tight">
                  {plan.name}
                </h3>

                {/* Return Box */}
                <div className="rounded-2xl p-4 mb-6 bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold font-mono text-white tracking-tight">
                      {plan.rate}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / {plan.interval || "week"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {plan.cycle} • Capital returned
                  </div>
                </div>

                {/* Min/Max Limits */}
                <div className="space-y-2 mb-6 text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                    <span className="text-slate-400">Min. Deposit:</span>
                    <span className="font-semibold text-white font-mono">{plan.min}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                    <span className="text-slate-400">Max. Deposit:</span>
                    <span className="font-semibold text-white font-mono">{plan.max}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href="/register"
                className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] ${
                  plan.featured
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_2px_10px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08]"
                }`}
              >
                <span>Invest in Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
