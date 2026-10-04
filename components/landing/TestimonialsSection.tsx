"use client";

import { Star, MessageSquare } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    name: "David K. Sterling",
    role: "Private Equity Trader",
    rating: 5,
    quote: "Pantera provides consistent automated yield credits without delay. The platform stability and double-entry transaction ledgers offer complete peace of mind.",
    avatar: "/images/avatars/david.jpg",
  },
  {
    name: "Sarah L. Jenkins",
    role: "Crypto Investor",
    rating: 5,
    quote: "The 3-tier affiliate program and automated payout edge engine make this platform unmatched. I've received instant withdrawals directly to my USDT wallet.",
    avatar: "/images/avatars/sarah.jpg",
  },
  {
    name: "Viktor Petrov",
    role: "Portfolio Manager",
    rating: 5,
    quote: "Exceptional platform performance. Transparent package return cycles and real-time interest compounding calculators make capital allocation seamless.",
    avatar: "/images/avatars/viktor.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#15182B] border-b border-[#232742] relative overflow-hidden text-white">
      
      {/* Ambient background glow in Warm Gold */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E9B737]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#E9B737]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex justify-center mb-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#E9B737]/40 bg-[#0E101D] text-[#E9B737] shadow-sm font-mono uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5 text-[#E9B737]" />
              <span>[ 07 // INVESTOR ATTESTATIONS ]</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display uppercase">
            What Our Investors Say
          </h2>
          <p className="text-slate-300 text-sm mt-3 font-normal max-w-xl mx-auto">
            Direct feedback from active platform members and global institutional wealth managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#0E101D] border border-[#232742] hover:border-[#E9B737] rounded-xl p-8 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-[#E9B737]/5 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center gap-1 text-[#E9B737] mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic mb-6 font-normal">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#232742] flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E9B737]/40 flex-shrink-0 bg-[#15182B]">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#E9B737] transition-colors font-mono uppercase">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-[#E9B737] font-mono">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
