"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navigation } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function FormalInvitationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [guestName, setGuestName] = useState<string>("");

  useEffect(() => {
    const readParam = () => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const raw =
        params.get("name") ||
        params.get("to") ||
        params.get("guest") ||
        params.get("ten") ||
        params.get("u") ||
        "";
      if (raw && raw.trim()) {
        setGuestName(raw.replace(/\+/g, " ").trim());
      } else {
        setGuestName("");
      }
    };

    readParam();
    window.addEventListener("popstate", readParam);
    return () => window.removeEventListener("popstate", readParam);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            once: true,
          },
          y: 35,
          scale: 0.98,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "all",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    weddingData.event.mapQuery
  )}`;

  // Format parent name with dot (Ông. / Bà.)
  const formatParent = (name: string, prefix: "Ông" | "Bà") => {
    const clean = name.replace(/^(Ông|Bà)[:.]\s*/i, "").trim();
    return `${prefix}. ${clean}`;
  };

  // Guest name display in header: default to "QUÝ KHÁCH" if empty
  const cleanName = guestName.trim();
  const guestDisplayName = cleanName ? cleanName.toUpperCase() : "QUÝ KHÁCH";

  return (
    <section
      ref={sectionRef}
      id="formal-invitation-section"
      className="relative z-20 px-4 text-center py-6 sm:py-8 overflow-visible"
    >
      {/* Formal Wedding Invitation Card - Bố cục chuẩn theo thiết kế */}
      <div
        ref={cardRef}
        className="relative max-w-[450px] mx-auto rounded-3xl shadow-xl border border-[#dfbaba]/70 bg-[#fffdfa] text-center overflow-hidden p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl"
      >
        {/* Delicate inner hairline frame */}
        <div className="absolute inset-2.5 sm:inset-3 border border-[#dfbaba]/40 rounded-2xl pointer-events-none z-10" />

        <div className="relative z-10">
          {/* 1. TOP HEADING: TRÂN TRỌNG KÍNH MỜI [TÊN / QUÝ KHÁCH] ĐẾN CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI */}
          <div className="text-center pt-1 mb-6 sm:mb-7">
            <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-[#812927] tracking-[0.05em] uppercase leading-relaxed max-w-sm mx-auto">
              TRÂN TRỌNG KÍNH MỜI {guestDisplayName} ĐẾN
              <br />
              CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
            </h3>
          </div>

          {/* 2. NHÀ GÁI & NHÀ TRAI VỚI VẠCH NGĂN ĐỨNG Ở GIỮA */}
          <div className="flex items-center justify-center my-6 sm:my-7 max-w-sm mx-auto">
            {/* Nhà Gái (Bên trái - lên trước) */}
            <div className="flex-1 text-center pr-3 sm:pr-4">
              <h4 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#812927] tracking-[0.18em] uppercase mb-1.5">
                NHÀ GÁI
              </h4>
              <p className="font-sans text-xs sm:text-[13px] text-[#332b2b] leading-relaxed font-normal">
                {formatParent(weddingData.bride.fatherName, "Ông")}
              </p>
              <p className="font-sans text-xs sm:text-[13px] text-[#332b2b] leading-relaxed font-normal">
                {formatParent(weddingData.bride.motherName, "Bà")}
              </p>
            </div>

            {/* Vạch ngăn đứng */}
            <div className="w-[1px] h-14 sm:h-16 bg-[#812927]/35 flex-shrink-0" />

            {/* Nhà Trai (Bên phải) */}
            <div className="flex-1 text-center pl-3 sm:pl-4">
              <h4 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#812927] tracking-[0.18em] uppercase mb-1.5">
                NHÀ TRAI
              </h4>
              <p className="font-sans text-xs sm:text-[13px] text-[#332b2b] leading-relaxed font-normal">
                {formatParent(weddingData.groom.fatherName, "Ông")}
              </p>
              <p className="font-sans text-xs sm:text-[13px] text-[#332b2b] leading-relaxed font-normal">
                {formatParent(weddingData.groom.motherName, "Bà")}
              </p>
            </div>
          </div>

          {/* 3. TÊN CÔ DÂU CHÚ RỂ - FONT CHỮ CÁCH ĐIỆU Cursive, KHÔNG CẦN HỌ (CÔ DÂU LÊN TRƯỚC) */}
          <div className="my-7 sm:my-9 text-center space-y-1 select-none">
            <h2 className="font-calligraphy text-4xl sm:text-5xl text-[#812927] font-normal tracking-wide drop-shadow-xs">
              {weddingData.bride.shortName}
            </h2>
            <div className="font-calligraphy text-2xl sm:text-3xl text-[#812927] font-normal my-1">
              &amp;
            </div>
            <h2 className="font-calligraphy text-4xl sm:text-5xl text-[#812927] font-normal tracking-wide drop-shadow-xs">
              {weddingData.groom.shortName}
            </h2>
          </div>

          {/* 4. BỮA TIỆC CHUNG VUI & THỜI GIAN */}
          <div className="text-center my-6 sm:my-7 space-y-1.5">
            <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-[#812927] tracking-[0.16em] uppercase">
              BỮA TIỆC CHUNG VUI
            </h3>
            <p className="font-serif-luxury font-bold text-xs sm:text-sm text-[#812927] tracking-[0.14em] uppercase">
              ĐƯỢC TỔ CHỨC VÀO LÚC {weddingData.event.time}, {weddingData.event.dayOfWeek.toUpperCase()}
            </p>
          </div>

          {/* 5. KHUNG LỊCH NGÀY CƯỚI: THÁNG 12 | 15 | NĂM 2026 */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-5 max-w-sm mx-auto">
            {/* Tháng với viền trên và viền dưới */}
            <div className="flex-1 py-1 sm:py-1.5 border-t border-b border-[#812927] text-center">
              <span className="font-serif-luxury font-bold text-xs sm:text-sm text-[#812927] tracking-[0.2em] uppercase whitespace-nowrap">
                THÁNG {weddingData.event.month}
              </span>
            </div>

            {/* Số ngày kích thước lớn */}
            <div className="flex-shrink-0 px-2 sm:px-3 text-center">
              <span className="font-serif-luxury font-bold text-6xl sm:text-7xl text-[#812927] leading-none select-none">
                {weddingData.event.day}
              </span>
            </div>

            {/* Năm với viền trên và viền dưới */}
            <div className="flex-1 py-1 sm:py-1.5 border-t border-b border-[#812927] text-center">
              <span className="font-serif-luxury font-bold text-xs sm:text-sm text-[#812927] tracking-[0.2em] uppercase whitespace-nowrap">
                NĂM {weddingData.event.year}
              </span>
            </div>
          </div>

          {/* Ngày âm lịch */}
          <p className="font-serif-luxury italic text-xs sm:text-sm text-[#812927] text-center tracking-wide mb-6">
            ({weddingData.event.lunarDateDisplay || "Tức ngày 17 tháng 11 năm Bính Ngọ"})
          </p>

          {/* 6. ĐỊA ĐIỂM TỔ CHỨC */}
          <div className="text-center space-y-1.5 mb-7">
            <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-[#812927] tracking-[0.16em] uppercase">
              TẠI {weddingData.event.venueName}
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#3b2e2e] font-normal max-w-xs mx-auto leading-relaxed">
              {weddingData.event.venueAddress}
            </p>
          </div>

          {/* 7. NÚT XEM CHỈ ĐƯỜNG */}
          <div className="flex justify-center pt-1 mb-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#7a1c1a] hover:bg-[#621614] text-white text-xs sm:text-sm font-serif-luxury font-bold tracking-[0.18em] uppercase py-3 px-8 sm:px-10 rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              XEM CHỈ ĐƯỜNG
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
