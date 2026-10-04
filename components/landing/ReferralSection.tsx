"use client";

import { ArrowRight, Share2, Users, DollarSign, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ReferralTier {
  level: string;
  tag: string;
  rate: string;
  sharePct: number;
  title: string;
  subtitle: string;
  bonus: string;
  example: string;
}

const LEVELS: ReferralTier[] = [
  {
    level: "1",
    tag: "Level 1",
    rate: "5%",
    sharePct: 55,
    title: "Direct Invited Investors",
    subtitle: "Immediate 1st-degree referrals registering via your link",
    bonus: "+$50.00 per $1,000",
    example: "Earn $500 on $10,000 volume",
  },
  {
    level: "2",
    tag: "Level 2",
    rate: "3%",
    sharePct: 33,
    title: "Secondary Network Referrals",
    subtitle: "2nd-degree investors invited by your direct referrals",
    bonus: "+$30.00 per $1,000",
    example: "Earn $300 on $10,000 volume",
  },
  {
    level: "3",
    tag: "Level 3",
    rate: "1%",
    sharePct: 12,
    title: "Tertiary Network Referrals",
    subtitle: "3rd-degree extended downline network volume",
    bonus: "+$10.00 per $1,000",
    example: "Earn $100 on $10,000 volume",
  },
];

export default function ReferralSection() {
  return (
    <section id="referral" className="py-24 border-b border-[#E2E4EC] relative bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#E2E4EC] bg-white text-[#15182B] shadow-xs font-mono uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5 text-[#E9B737]" />
              <span>[ 06 // AFFILIATE SYNDICATION ]</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15182B] leading-tight tracking-tight font-display uppercase">
              Earn Lifetime Multi-Tier Referral Commissions
            </h2>
            
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              Invite friends, institutional partners, and network members to Pantera using your private referral URL. Earn recursive instant cash commissions whenever your downline deploys capital into investment packages.
            </p>

            {/* Value Propositions */}
            <div className="space-y-3 pt-1">
              {[
                {
                  title: "Instant Interest Wallet Credit",
                  desc: "Commissions are automatically credited to your Interest Wallet upon package deposit approval with zero waiting period.",
                },
                {
                  title: "No Active Capital Requirement",
                  desc: "Earn referral commissions immediately after registration without being required to maintain an active deposit.",
                },
                {
                  title: "Cumulative 9.0% Downline Yield",
                  desc: "Capture multi-tier affiliate rewards across 3 concentric network depths on unlimited volume.",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E2E4EC] shadow-xs hover:border-[#15182B] transition-colors"
                >
                  <div className="w-5 h-5 rounded bg-[#15182B] text-[#E9B737] flex items-center justify-center flex-shrink-0 text-[11px] font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#15182B] font-mono uppercase">{b.title}</h4>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-snug">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Downline Yield Simulation Pill */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E4EC] flex items-center justify-between text-xs shadow-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-mono tracking-wider font-semibold">Example Volume</span>
                <span className="font-bold text-[#15182B] font-mono text-sm">$10,000 Downline</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block uppercase font-mono tracking-wider font-semibold">Total Commission</span>
                <span className="font-extrabold text-[#15182B] font-mono text-sm">
                  +$900.00 Instant <span className="text-[#E9B737]">✓</span>
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#15182B] hover:bg-[#0E101D] text-white px-7 py-3.5 rounded-md text-xs font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer font-mono uppercase tracking-wider"
              >
                <span>Get Your Referral Link</span>
                <ArrowRight className="w-4 h-4 text-[#E9B737]" />
              </Link>
            </div>
          </div>

          {/* Right Column — Network Graphic & Elevated Tier Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Visual Network Header Banner */}
            <div className="relative rounded-xl overflow-hidden border border-[#232742] shadow-sm bg-[#15182B] aspect-[21/9] sm:aspect-[24/9] group">
              <Image
                src="/images/network-art.jpg"
                alt="Global Referral Liquidity Mesh"
                fill
                className="object-cover object-center opacity-75 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15182B]/95 via-[#15182B]/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5 font-mono uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#E9B737]" />
                    Multi-Tier Liquidity Mesh
                  </div>
                  <div className="text-[11px] text-slate-300 font-normal">
                    Automated capital routing across 3 downline generation depths
                  </div>
                </div>
                <span className="font-mono text-[#E9B737] font-bold text-[11px] bg-[#0E101D] border border-[#E9B737]/40 px-2.5 py-1 rounded shadow-xs">
                  9.0% Max Yield
                </span>
              </div>
            </div>

            {/* Elevated Referral Tier Cards */}
            <div className="space-y-3">
              {LEVELS.map((lvl) => (
                <div
                  key={lvl.level}
                  className="bg-white border border-[#E2E4EC] rounded-xl p-5 shadow-xs hover:border-[#15182B] hover:shadow-md transition-all duration-150 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    
                    {/* Left: Level Pill + Info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      
                      {/* Prominent Level Pill Badge (Never wraps!) */}
                      <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#15182B] text-white shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E9B737] animate-pulse" />
                        <span className="font-mono font-bold text-xs whitespace-nowrap tracking-wide text-white">
                          {lvl.tag}
                        </span>
                      </div>

                      {/* Text Details */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#15182B] truncate font-mono uppercase">
                          {lvl.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                          {lvl.subtitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-[#15182B] font-bold font-mono bg-[#FAFAFA] border border-[#E2E4EC] px-2 py-0.5 rounded">
                            {lvl.bonus}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                            • {lvl.example}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Big Percentage & Instant Payout Tag */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#15182B]">
                        {lvl.rate}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E9B737] font-bold block mt-0.5">
                        Instant Credit
                      </span>
                    </div>

                  </div>

                  {/* Visual Allocation Share Bar */}
                  <div className="mt-3.5 pt-3 border-t border-[#E2E4EC] flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-[#E2E4EC]">
                      <div
                        style={{ width: `${lvl.sharePct}%` }}
                        className="h-full bg-gradient-to-r from-[#15182B] to-[#E9B737] rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap font-medium">
                      Network Weight: {lvl.sharePct}%
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
