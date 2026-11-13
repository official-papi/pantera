"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import YouHodlerHero from "@/components/landing/YouHodlerHero";
import PlanCards from "@/components/landing/PlanCards";
import YouHodlerBento from "@/components/landing/YouHodlerBento";
import ComparisonTable from "@/components/landing/ComparisonTable";
import HowItWorks from "@/components/landing/HowItWorks";
import SecuritySection from "@/components/landing/SecuritySection";
import YouHodlerCta from "@/components/landing/YouHodlerCta";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08090C] text-slate-300 flex flex-col font-sans relative overflow-hidden">
      
      {/* ── 1. Top Glassmorphic Navigation Bar ── */}
      <Navbar />

      <main className="flex-1 relative z-10">
        
        {/* ── 2. The YouHodler Split Screen Hero with 1-Click Fast Signup & Live Yield Desk ── */}
        <YouHodlerHero />

        {/* ── 3. Active Investment & Staking Vehicles (Tier Packages) ── */}
        <div id="plans" className="scroll-mt-16">
          <PlanCards />
        </div>

        {/* ── 4. The YouHodler Bento Box (Earn Vaults, Quant Arbitrage, Instant Liquidity, Audited Ledger) ── */}
        <div id="services" className="scroll-mt-16">
          <YouHodlerBento />
        </div>

        {/* ── 5. YouHodler vs Traditional Banking Benchmark Matrix ── */}
        <div id="comparison" className="scroll-mt-16">
          <ComparisonTable />
        </div>

        {/* ── 6. How It Works (3-Step Execution Methodology) ── */}
        <div id="how-it-works" className="scroll-mt-16">
          <HowItWorks />
        </div>

        {/* ── 7. Institutional Security & Cold Custody ── */}
        <div id="security" className="scroll-mt-16">
          <SecuritySection />
        </div>

        {/* ── 8. Clean Bottom Fast-Action Call to Action ── */}
        <YouHodlerCta />

      </main>

      {/* ── 9. Global Dark Footer ── */}
      <Footer />
    </div>
  );
}
