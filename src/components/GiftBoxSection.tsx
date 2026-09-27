"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Copy, Check, X, Gift, QrCode, Sparkles } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function GiftBoxSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Modal state: null (closed) | "bride" | "groom"
  const [activeModal, setActiveModal] = useState<"bride" | "groom" | null>(null);
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
        y: 25,
        scale: 0.98,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopy = (acc: string, type: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const activePerson = activeModal === "bride" ? weddingData.bride : weddingData.groom;
  const isBrideActive = activeModal === "bride";

  return (
    <section ref={sectionRef} id="gift-section" className="py-12 px-4 text-center">
      <div className="max-w-[440px] mx-auto">
        {/* Section Header */}
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
        <p className="text-xs text-[#666] font-light mb-7 leading-relaxed max-w-xs mx-auto">
          Sự chúc phúc và hiện diện của quý khách là món quà ý nghĩa nhất. Nếu quý khách muốn gửi món quà mừng từ phương xa, có thể mở phong bao dưới đây:
        </p>

        {/* Discreet Gift Cards Grid (No exposed raw QR codes) */}
        <div ref={cardsRef} className="grid grid-cols-2 gap-3.5 sm:gap-4">
          {/* Bride Gift Card (Cô Dâu Ngọc Trâm prioritized first) */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm border border-[#dfbaba]/60 hover:border-[#812927]/40 hover:shadow-md transition-all flex flex-col items-center justify-between text-center group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#dfbaba] shadow-2xs mb-2.5 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={weddingData.bride.avatar}
                alt={weddingData.bride.fullName}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#812927] font-semibold">
              Mừng Cô Dâu
            </span>
            <h4 className="text-sm sm:text-base font-serif-luxury font-bold text-[#3b3232] mt-0.5">
              {weddingData.bride.shortName}
            </h4>
            <p className="text-[11px] text-[#888] font-light mt-0.5 mb-3">
              {weddingData.bride.bankName}
            </p>

            <button
              onClick={() => setActiveModal("bride")}
              className="w-full bg-[#812927] hover:bg-[#68201f] text-white text-[11px] font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer group-hover:shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Gửi Mừng</span>
            </button>
          </div>

          {/* Groom Gift Card (Chú Rể Lương Huy) */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm border border-[#dfbaba]/60 hover:border-[#812927]/40 hover:shadow-md transition-all flex flex-col items-center justify-between text-center group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#dfbaba] shadow-2xs mb-2.5 group-hover:scale-105 transition-transform duration-300">
              <Image
                src={weddingData.groom.avatar}
                alt={weddingData.groom.fullName}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#812927] font-semibold">
              Mừng Chú Rể
            </span>
            <h4 className="text-sm sm:text-base font-serif-luxury font-bold text-[#3b3232] mt-0.5">
              {weddingData.groom.shortName}
            </h4>
            <p className="text-[11px] text-[#888] font-light mt-0.5 mb-3">
              {weddingData.groom.bankName}
            </p>

            <button
              onClick={() => setActiveModal("groom")}
              className="w-full bg-[#812927] hover:bg-[#68201f] text-white text-[11px] font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer group-hover:shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Gửi Mừng</span>
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

      {/* Luxury Envelope / QR Modal Dialog */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="max-w-[360px] w-full bg-[#fffcfb] rounded-3xl p-6 shadow-2xl border border-[#dfbaba] relative text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#888] hover:text-[#812927] hover:bg-[#f9f1ef] transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Switch Tabs between Bride & Groom inside Modal */}
            <div className="flex justify-center p-1 bg-[#f9f1ef] rounded-xl mb-4 border border-[#dfbaba]/40">
              <button
                onClick={() => setActiveModal("bride")}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                  isBrideActive
                    ? "bg-[#812927] text-white shadow-2xs"
                    : "text-[#666] hover:text-[#812927]"
                }`}
              >
                Cô Dâu Ngọc Trâm
              </button>
              <button
                onClick={() => setActiveModal("groom")}
                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                  !isBrideActive
                    ? "bg-[#812927] text-white shadow-2xs"
                    : "text-[#666] hover:text-[#812927]"
                }`}
              >
                Chú Rể Lương Huy
              </button>
            </div>

            {/* Avatar & Title */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#dfbaba] shadow-xs mx-auto mb-2">
              <Image
                src={activePerson.avatar}
                alt={activePerson.fullName}
                fill
                className="object-cover"
              />
            </div>

            <span className="text-[10px] uppercase tracking-widest text-[#812927] font-semibold">
              {isBrideActive ? "Mừng Cưới Cô Dâu" : "Mừng Cưới Chú Rể"}
            </span>
            <h4 className="text-base font-serif-luxury font-bold text-[#3b3232]">
              {activePerson.fullName}
            </h4>

            {/* QR Code Container */}
            <div className="relative w-44 h-44 mx-auto my-3 p-2 bg-white rounded-2xl shadow-xs border border-[#dfbaba]/50">
              <Image
                src={activePerson.qrCode}
                alt={`Mã QR ${activePerson.fullName}`}
                fill
                className="object-contain p-1.5"
              />
            </div>

            {/* Account Details Box */}
            <div className="bg-[#f9f1ef] rounded-xl p-3 border border-[#dfbaba]/40 text-xs space-y-0.5 mb-3.5">
              <p className="text-[11px] text-[#666]">
                Ngân hàng:{" "}
                <span className="font-bold text-[#812927]">
                  {activePerson.bankName}
                </span>
              </p>
              <p className="text-[11px] text-[#666]">
                Chủ tài khoản:{" "}
                <span className="font-medium text-[#3b3232] uppercase">
                  {activePerson.fullName}
                </span>
              </p>
              <p className="font-mono text-sm tracking-wider font-semibold text-[#812927] pt-0.5">
                {activePerson.accountNumber}
              </p>
            </div>

            {/* Copy Account Number Button */}
            <button
              onClick={() => handleCopy(activePerson.accountNumber, activeModal)}
              className="w-full bg-[#f9f1ef] hover:bg-[#dfbaba]/30 text-[#812927] border border-[#dfbaba] text-xs font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer mb-2"
            >
              {copiedAccount === activeModal ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600 font-semibold">
                    Đã sao chép số tài khoản!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép số tài khoản</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-[#888] font-light leading-relaxed">
              Quét mã QR qua ứng dụng ngân hàng hoặc ví điện tử bất kỳ
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
