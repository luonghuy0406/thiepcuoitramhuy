"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navigation, MapPin } from "lucide-react";
import { weddingData } from "@/data/wedding-data";
import SectionDivider from "@/components/SectionDivider";

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
          y: 24,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
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
      className="min-h-[100dvh] w-full flex flex-col justify-evenly items-center px-3.5 sm:px-4 py-2 sm:py-3 snap-start relative z-10 text-center"
    >
      {/* 1. Hoạ tiết ngăn cách trải dài sát viền trái phải */}
      <SectionDivider variant={1} className="w-full my-0 px-0 flex-shrink-0" />

      {/* 2. Khung thiệp Formal Invitation tràn đều, cân đối không gian màn hình dọc */}
      <div
        ref={contentRef}
        className="relative w-full max-w-[460px] mx-auto rounded-2xl border border-[#b16964]/25 p-4 sm:p-6 text-center shadow-xs bg-white/40 backdrop-blur-[2px]"
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
        <div className="absolute inset-1.5 sm:inset-2 border border-[#b16964]/12 rounded-xl pointer-events-none" />

        <div className="relative z-10">
          {/* 1. TOP HEADING: TRÂN TRỌNG KÍNH MỜI [TÊN / QUÝ KHÁCH] ĐẾN CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI */}
          <div className="text-center pt-0.5 mb-3.5 sm:mb-4">
            <h3 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#b16964] tracking-[0.08em] uppercase leading-relaxed max-w-sm mx-auto">
              TRÂN TRỌNG KÍNH MỜI {guestDisplayName} ĐẾN
              <br />
              CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI
            </h3>
          </div>

          {/* 2. NHÀ GÁI & NHÀ TRAI VỚI VẠCH NGĂN ĐỨNG Ở GIỮA */}
          <div className="flex items-center justify-center my-3 sm:my-3.5 max-w-sm mx-auto">
            {/* Nhà Gái (Bên trái - lên trước) */}
            <div className="flex-1 text-center pr-3 sm:pr-4">
              <h4 className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#b16964] tracking-[0.16em] uppercase mb-1">
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
            <div className="w-[1px] h-11 sm:h-12 bg-[#b16964]/30 flex-shrink-0" />

            {/* Nhà Trai (Bên phải) */}
            <div className="flex-1 text-center pl-3 sm:pr-4">
              <h4 className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#b16964] tracking-[0.16em] uppercase mb-1">
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
          <div className="my-3 sm:my-3.5 text-center space-y-0.5 select-none">
            <h2 className="font-calligraphy text-3xl sm:text-4xl text-[#b16964] font-normal tracking-wide drop-shadow-2xs leading-tight">
              {weddingData.bride.shortName}
            </h2>
            <div className="font-calligraphy text-xl sm:text-2xl text-[#b16964] font-normal my-0 leading-none">
              &amp;
            </div>
            <h2 className="font-calligraphy text-3xl sm:text-4xl text-[#b16964] font-normal tracking-wide drop-shadow-2xs leading-tight">
              {weddingData.groom.shortName}
            </h2>
          </div>

          {/* 4. BỮA TIỆC CHUNG VUI & THỜI GIAN */}
          <div className="text-center my-3 sm:my-3.5 space-y-1.5">
            <h3 className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#b16964] tracking-[0.16em] uppercase">
              BỮA TIỆC CHUNG VUI ĐƯỢC TỔ CHỨC VÀO LÚC
            </h3>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 py-1.5 px-4 sm:px-6 rounded-xl bg-white/60 border border-[#b16964]/25 text-[#b16964] shadow-2xs">
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
            <p className="font-serif-luxury italic text-xs sm:text-[13px] text-[#b16964]/85 text-center tracking-wide pt-0.5">
              ({weddingData.event.lunarDateDisplay || "Tức ngày 17 tháng 11 năm Bính Ngọ"})
            </p>
          </div>

          {/* 5. ĐỊA ĐIỂM TỔ CHỨC */}
          <div className="text-center space-y-0.5 mb-3 sm:mb-3.5">
            <h4 className="font-serif-luxury font-bold text-xs sm:text-sm text-[#b16964] tracking-[0.14em] uppercase">
              TẠI {weddingData.event.venueName}
            </h4>
            <p className="font-sans text-xs sm:text-[13px] text-[#3b2e2e] font-normal max-w-sm mx-auto leading-relaxed">
              {weddingData.event.venueAddress}
            </p>
          </div>

          {/* 6. BẢN ĐỒ GOOGLE MAPS TƯƠNG TÁC RỘNG RÃI & NÚT XEM CHỈ ĐƯỜNG */}
          <div className="w-full mt-2.5 space-y-2.5">
            {/* Live Interactive Map Frame - Rộng rãi, chi tiết, nổi bật trên màn hình dọc */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full h-32 sm:h-36 rounded-xl overflow-hidden border border-[#b16964]/30 shadow-xs transition-all hover:border-[#b16964]/60 cursor-pointer"
              title="Nhấn để mở chỉ đường trên Google Maps"
            >
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  weddingData.event.mapQuery
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 pointer-events-none scale-102"
                loading="lazy"
                aria-label="Bản đồ địa điểm tiệc cưới"
              />
              {/* Subtle hover overlay */}
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors pointer-events-none" />

              {/* Floating Map Pin Badge */}
              {/* <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[#b16964] text-[10px] sm:text-[11px] font-serif-luxury font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5 pointer-events-none border border-[#b16964]/25">
                <MapPin className="w-3 h-3 text-[#b16964]" />
                <span>Mở Bản Đồ</span>
              </div> */}
            </a>

            {/* Nút Xem Chỉ Đường */}
            {/* <div className="flex justify-center pt-0.5">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7a1c1a] hover:bg-[#621614] text-white text-xs sm:text-[13px] font-serif-luxury font-bold tracking-[0.18em] uppercase py-2.5 sm:py-3 px-8 sm:px-10 rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                XEM CHỈ ĐƯỜNG
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
