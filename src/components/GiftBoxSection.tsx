"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Copy, Check } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function GiftBoxSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 90%",
          once: true,
        },
        y: 30,
        scale: 0.98,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = (acc: string, type: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  return (
    <section ref={sectionRef} className="py-12 px-4 text-center">
      <div className="max-w-[440px] mx-auto">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="h-[1px] w-8 sm:w-12 bg-[#dfbaba]" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#812927]/90 font-cinzel font-semibold">
            Wedding Gift
          </span>
          <span className="h-[1px] w-8 sm:w-12 bg-[#dfbaba]" />
        </div>
        <h3 className="text-3xl sm:text-4xl font-script text-[#812927] mb-2 drop-shadow-xs">
          Hộp Mừng Cưới
        </h3>
        <p className="text-xs text-[#666] font-light mb-8 leading-relaxed max-w-xs mx-auto">
          Tình cảm và sự chúc phúc của quý khách là món quà trân quý nhất với
          chúng mình!
        </p>

        {/* Bank Cards Grid */}
        <div ref={cardsRef} className="space-y-4">
          {/* Bride Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-md border border-[#dfbaba]/50 flex flex-col items-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#dfbaba] shadow-sm mb-3">
              <Image
                src={weddingData.bride.avatar}
                alt={weddingData.bride.fullName}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-xs uppercase tracking-wider text-[#a33f3d] font-semibold">
              Mừng Cưới Cô Dâu
            </span>
            <h4 className="text-lg font-serif-luxury font-bold text-[#3b3232] mt-0.5">
              {weddingData.bride.fullName}
            </h4>

            {/* QR Code */}
            <div className="relative w-36 h-36 my-3 p-2 bg-white rounded-xl shadow-xs border border-[#dfbaba]/40">
              <Image
                src={weddingData.bride.qrCode}
                alt="QR Code Cô dâu"
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="text-xs text-[#555] space-y-0.5 mb-3">
              <p className="font-semibold text-[#812927]">
                {weddingData.bride.bankName}
              </p>
              <p className="font-mono tracking-wider text-sm text-[#3b3232]">
                {weddingData.bride.accountNumber}
              </p>
            </div>

            <button
              onClick={() => handleCopy(weddingData.bride.accountNumber, "bride")}
              className="bg-[#f9f1ef] hover:bg-[#dfbaba]/40 text-[#812927] border border-[#dfbaba] text-xs font-medium py-2 px-4 rounded-full flex items-center gap-1.5 transition-all shadow-2xs"
            >
              {copiedAccount === "bride" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600 font-semibold">
                    Đã sao chép STK!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép số tài khoản</span>
                </>
              )}
            </button>
          </div>

          {/* Groom Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-md border border-[#dfbaba]/50 flex flex-col items-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#dfbaba] shadow-sm mb-3">
              <Image
                src={weddingData.groom.avatar}
                alt={weddingData.groom.fullName}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-xs uppercase tracking-wider text-[#a33f3d] font-semibold">
              Mừng Cưới Chú Rể
            </span>
            <h4 className="text-lg font-serif-luxury font-bold text-[#3b3232] mt-0.5">
              {weddingData.groom.fullName}
            </h4>

            {/* QR Code */}
            <div className="relative w-36 h-36 my-3 p-2 bg-white rounded-xl shadow-xs border border-[#dfbaba]/40">
              <Image
                src={weddingData.groom.qrCode}
                alt="QR Code Chú rể"
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="text-xs text-[#555] space-y-0.5 mb-3">
              <p className="font-semibold text-[#812927]">
                {weddingData.groom.bankName}
              </p>
              <p className="font-mono tracking-wider text-sm text-[#3b3232]">
                {weddingData.groom.accountNumber}
              </p>
            </div>

            <button
              onClick={() => handleCopy(weddingData.groom.accountNumber, "groom")}
              className="bg-[#f9f1ef] hover:bg-[#dfbaba]/40 text-[#812927] border border-[#dfbaba] text-xs font-medium py-2 px-4 rounded-full flex items-center gap-1.5 transition-all shadow-2xs"
            >
              {copiedAccount === "groom" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600 font-semibold">
                    Đã sao chép STK!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép số tài khoản</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cute Wedding Couple Sticker GIF & Thank You Note */}
        <div className="mt-12 text-center flex flex-col items-center">
          <div className="relative w-28 h-28 mb-3">
            <Image
              src="/assets/694f2494535443aa96ab2f8cbf4d06bf.gif"
              alt="Wedding animation"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <h3 className="text-3xl font-script text-[#812927] mb-1">
            Thank you!
          </h3>
          <p className="text-xs text-[#666] font-light max-w-xs leading-relaxed">
            Cảm ơn bạn đã luôn yêu thương và đồng hành cùng chúng mình trong chặng
            đường hạnh phúc này!
          </p>

          <div className="w-12 h-[1px] bg-[#dfbaba] my-4" />

          <p className="text-[10px] tracking-[0.25em] uppercase text-[#888] font-cinzel">
            Bùi Huỳnh Ngọc Trâm &amp; Nguyễn Lương Huy • 2026
          </p>
        </div>
      </div>
    </section>
  );
}
