"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navigation } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function FormalInvitationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
      if (contentRef.current) {
        gsap.from(contentRef.current, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 88%",
            once: true,
          },
          y: 30,
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
      className="relative z-10 px-4 text-center py-4 sm:py-6 overflow-visible"
    >
      {/* Seamless Formal Invitation Framing on background_all.png */}
      <div
        ref={contentRef}
        className="relative max-w-[440px] mx-auto rounded-2xl border border-[#b16964]/20 p-6 sm:p-8 text-center"
      >
        {/* 4 Baroque Corner Flourishes (hoatiet_goc.png) */}
        <div className="absolute -top-1.5 -left-1.5 w-8 h-8 sm:w-10 sm:h-10 pointer-events-none opacity-60">
          <Image
            src="/assets/hoatiet/hoatiet_goc.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-8 h-8 sm:w-10 sm:h-10 pointer-events-none opacity-60 scale-x-[-1]">
          <Image
            src="/assets/hoatiet/hoatiet_goc.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 sm:w-10 sm:h-10 pointer-events-none opacity-60 scale-y-[-1]">
          <Image
            src="/assets/hoatiet/hoatiet_goc.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 sm:w-10 sm:h-10 pointer-events-none opacity-60 rotate-180">
          <Image
            src="/assets/hoatiet/hoatiet_goc.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Delicate inner hairline frame */}
        <div className="absolute inset-1.5 sm:inset-2 border border-[#b16964]/10 rounded-xl pointer-events-none" />

        <div className="relative z-10">
          {/* Decorative Bow (no.png) */}
          <div className="flex justify-center mb-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 relative drop-shadow-2xs pointer-events-none">
              <Image
                src="/assets/hoatiet/no.png"
                alt="Ribbon Bow"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* 1. TOP HEADING: TRÂN TRỌNG KÍNH MỜI [TÊN / QUÝ KHÁCH] ĐẾN CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI */}
          <div className="text-center pt-1 mb-5 sm:mb-6">
            <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-[#b16964] tracking-[0.05em] uppercase leading-relaxed max-w-sm mx-auto">
              TRÂN TRỌNG KÍNH MỜI {guestDisplayName} ĐẾN
              <br />
              CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
            </h3>
          </div>

          {/* 2. NHÀ GÁI & NHÀ TRAI VỚI VẠCH NGĂN ĐỨNG Ở GIỮA */}
          <div className="flex items-center justify-center my-5 sm:my-6 max-w-sm mx-auto">
            {/* Nhà Gái (Bên trái - lên trước) */}
            <div className="flex-1 text-center pr-3 sm:pr-4">
              <h4 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#b16964] tracking-[0.18em] uppercase mb-1">
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
            <div className="w-[1px] h-12 sm:h-14 bg-[#b16964]/30 flex-shrink-0" />

            {/* Nhà Trai (Bên phải) */}
            <div className="flex-1 text-center pl-3 sm:pl-4">
              <h4 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#b16964] tracking-[0.18em] uppercase mb-1">
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

          {/* 3. TÊN CÔ DÂU CHÚ RỂ - Cursive Calligraphy, chỉ hiển thị tên (Cô dâu trước) */}
          <div className="my-6 sm:my-7 text-center space-y-1 select-none">
            <h2 className="font-calligraphy text-4xl sm:text-5xl text-[#b16964] font-normal tracking-wide drop-shadow-2xs">
              {weddingData.bride.shortName}
            </h2>
            <div className="font-calligraphy text-2xl sm:text-3xl text-[#b16964] font-normal my-0.5">
              &amp;
            </div>
            <h2 className="font-calligraphy text-4xl sm:text-5xl text-[#b16964] font-normal tracking-wide drop-shadow-2xs">
              {weddingData.groom.shortName}
            </h2>
          </div>

          {/* 4. BỮA TIỆC CHUNG VUI & THỜI GIAN */}
          <div className="text-center my-5 sm:my-6 space-y-2">
            <h3 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#b16964] tracking-[0.18em] uppercase">
              BỮA TIỆC CHUNG VUI ĐƯỢC TỔ CHỨC VÀO LÚC
            </h3>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 py-2 px-4 sm:px-6 rounded-xl bg-white/40 border border-[#b16964]/25 text-[#b16964]">
              <span className="font-serif-luxury font-bold text-sm sm:text-base tracking-wider">
                {weddingData.event.time}
              </span>
              <span className="text-[#b16964]/40 font-light">|</span>
              <span className="font-serif-luxury font-bold text-sm sm:text-base tracking-wider uppercase">
                {weddingData.event.dayOfWeek}
              </span>
              <span className="text-[#b16964]/40 font-light">|</span>
              <span className="font-serif-luxury font-bold text-sm sm:text-base tracking-wider">
                {weddingData.event.dateDisplay}
              </span>
            </div>
            {/* Ngày âm lịch */}
            <p className="font-serif-luxury italic text-xs sm:text-sm text-[#b16964]/85 text-center tracking-wide pt-0.5 mb-5">
              ({weddingData.event.lunarDateDisplay || "Tức ngày 17 tháng 11 năm Bính Ngọ"})
            </p>
          </div>

          {/* 5. ĐỊA ĐIỂM TỔ CHỨC */}
          <div className="text-center space-y-1 mb-6">
            <h4 className="font-serif-luxury font-bold text-sm sm:text-base text-[#b16964] tracking-[0.16em] uppercase">
              TẠI {weddingData.event.venueName}
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#3b2e2e] font-normal max-w-xs mx-auto leading-relaxed">
              {weddingData.event.venueAddress}
            </p>
          </div>

          {/* 6. NÚT XEM CHỈ ĐƯỜNG */}
          <div className="flex justify-center pt-1 mb-1">
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
