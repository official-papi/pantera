"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Check, ArrowRight, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_PLANS = [
  {
    id: "1", name: "Regular Package", rate: "2.5%", cycle: "Weekly for 8 Weeks",
    min: "$500", max: "$2,000", featured: false, badge: "Starter Tier",
    features: ["2.5% Weekly Return", "Principal Returned at End", "Instant Crypto Withdrawals", "Standard Support"],
  },
  {
    id: "2", name: "Silver Package", rate: "4.0%", cycle: "Weekly for 12 Weeks",
    min: "$3,000", max: "$5,000", featured: false, badge: "Growth Tier",
    features: ["4.0% Weekly Return", "Principal Returned at End", "Zero Withdrawal Fees", "Multi-Tier Referral Commission"],
  },
  {
    id: "3", name: "Gold Package", rate: "6.0%", cycle: "Weekly for 16 Weeks",
    min: "$10,000", max: "$20,000", featured: true, badge: "Most Popular",
    features: ["6.0% Weekly Return", "Principal Returned at End", "Priority Withdrawals", "Dedicated Account Manager"],
  },
  {
    id: "4", name: "VIP Package", rate: "10.0%", cycle: "Weekly for 24 Weeks",
    min: "$50,000", max: "$200,000", featured: false, badge: "High Yield",
    features: ["10.0% Weekly Return", "Principal Returned at End", "Custom Vault Storage", "VIP 24/7 Concierge Support"],
  },
  {
    id: "5", name: "Ultimate Package", rate: "12.0%", cycle: "Weekly for 36 Weeks",
    min: "$500,000", max: "$3,000,000", featured: false, badge: "Executive",
    features: ["12.0% Weekly Return", "Principal Returned at End", "Institutional Cold Custody", "Private Wealth Advisory"],
  },
  {
    id: "6", name: "Elites Package", rate: "15.5%", cycle: "Weekly for 52 Weeks",
    min: "$5,000,000", max: "$20,000,000", featured: true, badge: "Exclusive",
    features: [
      "15.5% Weekly Return",
      "🏠 Company House Loan Eligibility (Pay in Installments)",
      "Principal Returned at End",
      "Direct Private Banker & VIP Vault Access",
    ],
  },
];

export default function PlanCards() {
  const [plans, setPlans] = useState<any[]>(DEFAULT_PLANS);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 360;
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
        const formatted = data.map((p: any) => {
          const isWeekly = Number(p.payout_interval_hours) === 168 || (p.description || "").toLowerCase().includes("week");
          const intervalText = isWeekly ? "Weekly" : "Daily";
          const cycleText = isWeekly ? `Weekly for ${p.total_payout_periods} Weeks` : `${p.total_payout_periods} Days`;
          const isElite = (p.name || "").toLowerCase().includes("elite");

          const customFeatures = [];
          customFeatures.push(`${p.roi_percentage}% ${intervalText} Return`);
          if (isElite) {
            customFeatures.push("🏠 Company House Loan Eligibility (Pay in Installments)");
          }
          customFeatures.push(p.capital_back ? "Principal Returned at End" : "Compounded Returns");
          customFeatures.push("Instant Payout Withdrawals");
          customFeatures.push(isElite || Number(p.min_amount) >= 50000 ? "VIP Personal Wealth Advisor" : "Multi-Tier Referral Commission");

          return {
            id: p.id,
            name: p.name,
            rate: `${p.roi_percentage}%`,
            cycle: cycleText,
            interval: intervalText,
            min: `$${Number(p.min_amount).toLocaleString()}`,
            max: `$${Number(p.max_amount).toLocaleString()}`,
            featured: p.badge === "Most Popular" || isElite || (p.name || "").includes("Gold"),
            badge: p.badge || (isElite ? "Exclusive" : "Active Plan"),
            features: customFeatures,
          };
        });
        setPlans(formatted);
      }
    })();
  }, []);

  return (
    <section id="funds" className="py-24 border-b border-[#E2E4EC] relative bg-white scroll-mt-12">
      <div id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header (Pantera Capital Institutional Style) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-[#15182B] uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
              <span>[ 02 // ACTIVE FUNDS & STRATEGIES ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-zinc-950 uppercase">
              Investment Vehicles
            </h2>
            <p className="text-zinc-600 text-sm mt-2 font-sans max-w-xl">
              Diversified, high-performance compounding packages backed by audited liquidity pools, automated weekly payouts, and guaranteed principal return.
            </p>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Swipe or use controls to explore tiers →
            </span>
            <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-md border border-[#E2E4EC]">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll left"
                className="w-8 h-8 rounded bg-white text-[#15182B] flex items-center justify-center border border-[#E2E4EC] shadow-xs hover:border-[#15182B] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll right"
                className="w-8 h-8 rounded bg-white text-[#15182B] flex items-center justify-center border border-[#E2E4EC] shadow-xs hover:border-[#15182B] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-3 px-1 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`w-[300px] sm:w-[340px] flex-shrink-0 snap-start relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 ${
                plan.featured
                  ? "bg-[#15182B] text-white shadow-xl border-2 border-[#E9B737]"
                  : "bg-white border border-[#E2E4EC] shadow-xs hover:border-[#E9B737]"
              }`}
            >
              {/* Badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-6 bg-[#E9B737] text-[#15182B] font-mono font-bold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md border border-[#15182B]">
                  ★ {plan.badge}
                </div>
              )}
              {!plan.featured && (
                <div className="absolute top-5 right-5">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FDF9ED] text-[#15182B] border border-[#E9B737]/40">{plan.badge}</span>
                </div>
              )}

              {/* Plan Name & Rate */}
              <div>
                <h3 className={`text-[18px] font-bold font-display mb-3 ${plan.featured ? "text-white" : "text-[#15182B]"}`}>
                  {plan.name}
                </h3>

                <div className={`rounded-xl p-3.5 mb-5 ${plan.featured ? "bg-[#0E101D] border border-[#232742]" : "bg-[#F7F8FA] border border-[#E2E4EC]"}`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${plan.featured ? "text-[#E9B737]" : "text-[#15182B]"}`}>
                      {plan.rate}
                    </span>
                    <span className={`text-xs font-medium ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>
                      / {plan.interval?.toLowerCase() || "week"}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 font-normal ${plan.featured ? "text-slate-300" : "text-slate-500"}`}>
                    {plan.cycle} · Capital Returned ✓
                  </div>
                </div>

                {/* Min/Max */}
                <div className={`space-y-1 mb-5 text-xs font-mono tabular-nums ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>
                  <div className={`flex justify-between py-1 border-b ${plan.featured ? "border-[#232742]" : "border-[#E2E4EC]"}`}>
                    <span>Min. Deposit</span>
                    <span className={`font-bold ${plan.featured ? "text-white" : "text-[#15182B]"}`}>{plan.min}</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${plan.featured ? "border-[#232742]" : "border-[#E2E4EC]"}`}>
                    <span>Max. Deposit</span>
                    <span className={`font-bold ${plan.featured ? "text-white" : "text-[#15182B]"}`}>{plan.max}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.featured ? "bg-[#E9B737] text-[#15182B]" : "bg-[#FDF9ED] text-[#15182B] border border-[#E9B737]/40"
                      }`}>
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={`text-xs ${plan.featured ? "text-slate-200" : "text-slate-700"}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                href="/register"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  plan.featured
                    ? "bg-[#E9B737] hover:bg-[#d4a42c] text-[#15182B] shadow-md border border-[#15182B]"
                    : "bg-[#15182B] text-white hover:bg-[#E9B737] hover:text-[#15182B] border border-[#15182B]"
                }`}
              >
                <span>Invest Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
