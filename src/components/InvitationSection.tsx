"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navigation, Calendar as CalendarIcon } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function InvitationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Invitation card graceful entrance on scroll
      if (letterRef.current) {
        gsap.from(letterRef.current, {
          scrollTrigger: {
            trigger: letterRef.current,
            start: "top 90%",
            once: true,
          },
          y: 35,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
          clearProps: "all",
        });
      }

      // 2. Centerpiece formal card reveal on scroll
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            once: true,
          },
          y: 40,
          scale: 0.97,
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

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Lễ Vu Quy: ${weddingData.bride.shortName} & ${weddingData.groom.shortName}`
  )}&dates=20261215T033000Z/20261215T060000Z&details=${encodeURIComponent(
    `Trân trọng kính mời quý khách tham dự Tiệc mừng Lễ Vu Quy tại ${weddingData.event.venueName}`
  )}&location=${encodeURIComponent(weddingData.event.venueAddress)}`;

  return (
    <section
      ref={sectionRef}
      id="invitation-section"
      className="relative z-20 px-4 text-center pt-0 pb-12 overflow-visible"
    >
      {/* 1. Frosted Glass Floating Invitation Greeting Card */}
      <div
        ref={letterRef}
        className="relative z-20 -mt-12 sm:-mt-16 max-w-[440px] mx-auto rounded-3xl shadow-[0_20px_50px_rgba(129,41,39,0.1),0_2px_8px_rgba(0,0,0,0.03)] border border-[#dfbaba]/60 text-center overflow-hidden transition-all duration-500 hover:shadow-2xl"
        style={{
          backgroundImage: "url('/assets/anh1-opt.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Soft veil overlay for optimal typography legibility */}
        <div className="bg-[#fffdfa]/82 backdrop-blur-[1px] p-6 sm:p-8 rounded-3xl">
          {/* Editorial Title Header */}
          <div className="flex flex-col items-center mb-3.5">
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <span className="h-[1px] w-8 sm:w-12 bg-[#dfbaba]" />
              <span className="text-xs uppercase tracking-[0.35em] font-cinzel font-semibold text-[#812927]">
                Invitation
              </span>
              <span className="h-[1px] w-8 sm:w-12 bg-[#dfbaba]" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-cormorant tracking-[0.2em] text-[#777] uppercase font-semibold">
              Lễ Vu Quy
            </p>
          </div>

          <h3 className="text-base sm:text-lg font-serif-luxury text-[#2b2727] font-semibold mb-2.5 leading-snug">
            Gửi đến gia đình, người thân &amp; bạn bè quý mến,
          </h3>

          <p className="text-xs sm:text-sm text-[#443c3c] leading-relaxed font-sans font-light mb-4 max-w-sm mx-auto">
            Cảm ơn bạn đã dành tình cảm yêu thương và thời gian quý báu để cùng chúng mình chung vui trong ngày trọng đại này. Sự hiện diện và lời chúc phúc của bạn là món quà vô giá đối với chúng mình!
          </p>

          {/* Elegant Footer with Signature */}
          <div className="pt-3.5 border-t border-dashed border-[#dfbaba]/75 flex items-center justify-between px-3">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#812927] font-serif-luxury font-bold">
              Trân Trọng Kính Mời
            </span>
            <span className="font-script text-2xl sm:text-3xl text-[#812927] leading-none pt-1">
              Trâm &amp; Huy
            </span>
          </div>
        </div>
      </div>

      {/* Gentle Breathing Room Between Cards */}
      <div className="my-8 sm:my-10" />

      {/* 2. Formal Centerpiece Wedding Invitation Card */}
      <div
        ref={cardRef}
        className="relative max-w-[460px] mx-auto rounded-3xl shadow-2xl border-2 border-[#dfbaba]/70 text-left overflow-hidden transition-all duration-500 hover:shadow-3xl"
        style={{
          backgroundImage: "url('/assets/anh2-opt.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Soft luminous white veil to ensure flawless text legibility */}
        <div className="absolute inset-0 bg-[#fffdfa]/82 backdrop-blur-[1px] pointer-events-none" />

        {/* Delicate inner hairline frame */}
        <div className="absolute inset-2.5 sm:inset-3 border border-[#dfbaba]/50 rounded-2xl pointer-events-none z-10" />

        <div className="relative z-10 p-6 sm:p-8">

        {/* TOP HEADER: Vertical "Lễ Vu Quy" on left & Diagonally Staggered Names on right */}
        <div className="relative z-10 flex items-start justify-between mb-3">
          {/* Left Column: Vertical Burgundy Line + Stacked Calligraphy "Lễ Vu Quy" */}
          <div className="flex flex-col items-center select-none pt-1">
            <div className="w-[2px] h-8 sm:h-9 bg-[#8b2f30] mb-2 rounded-full shadow-xs" />
            <div className="flex flex-col items-center space-y-1">
              <span className="font-calligraphy text-2xl sm:text-3xl font-bold text-[#2b2727] leading-tight">
                Lễ
              </span>
              <span className="font-calligraphy text-2xl sm:text-3xl font-bold text-[#2b2727] leading-tight">
                Vu
              </span>
              <span className="font-calligraphy text-2xl sm:text-3xl font-bold text-[#2b2727] leading-tight">
                Quy
              </span>
            </div>
          </div>

          {/* Right Area: Diagonally Staggered Cursive Names */}
          <div className="flex-1 flex flex-col justify-between pl-3 sm:pl-5 text-right">
            {/* Bride Name (Top right) */}
            <h2 className="font-calligraphy text-3xl sm:text-4xl text-[#8b2f30] font-bold tracking-wide drop-shadow-xs">
              {weddingData.bride.fullName}
            </h2>

            {/* Ampersand in Cursive Script (Centered relative to names) */}
            <div className="font-calligraphy text-2xl sm:text-3xl text-[#8b2f30] font-bold pr-16 sm:pr-24 my-0.5">
              &amp;
            </div>

            {/* Groom Name (Bottom right) */}
            <h2 className="font-calligraphy text-3xl sm:text-4xl text-[#8b2f30] font-bold tracking-wide drop-shadow-xs">
              {weddingData.groom.fullName}
            </h2>
          </div>
        </div>

        {/* MID ACCENT: Vertical stroke above Nhà Gái */}
        <div className="relative z-10 w-[2px] h-8 sm:h-9 bg-[#8b2f30] ml-3 sm:ml-4 my-3 sm:my-4 rounded-full shadow-xs" />

        {/* FAMILY INFORMATION: Two-column layout (Nhà Gái & Nhà Trai) */}
        <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6 text-center mb-6">
          {/* Nhà Gái */}
          <div className="space-y-1">
            <h4 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#2b2727] mb-2 tracking-wide">
              Nhà Gái
            </h4>
            <p className="font-sans font-medium text-xs sm:text-sm text-[#3b3232] leading-snug">
              {weddingData.bride.fatherName}
            </p>
            <p className="font-sans font-medium text-xs sm:text-sm text-[#3b3232] leading-snug">
              {weddingData.bride.motherName}
            </p>
            <p className="font-sans font-medium text-xs sm:text-sm text-[#666] pt-1 tracking-wide">
              TP. {weddingData.bride.location}
            </p>
          </div>

          {/* Nhà Trai */}
          <div className="space-y-1">
            <h4 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#2b2727] mb-2 tracking-wide">
              Nhà Trai
            </h4>
            <p className="font-sans font-medium text-xs sm:text-sm text-[#3b3232] leading-snug">
              {weddingData.groom.fatherName}
            </p>
            <p className="font-sans font-medium text-xs sm:text-sm text-[#3b3232] leading-snug">
              {weddingData.groom.motherName}
            </p>
            <p className="font-sans font-medium text-xs sm:text-sm text-[#666] pt-1 tracking-wide">
              TP. {weddingData.groom.location}
            </p>
          </div>
        </div>

        {/* EVENT ANNOUNCEMENT: Ceremony Title & Time */}
        <div className="relative z-10 mt-6 mb-4 text-center">
          <h3 className="font-serif-luxury font-bold text-xl sm:text-2xl text-[#2b2727] tracking-wider uppercase mb-1 drop-shadow-xs">
            {weddingData.event.title}
          </h3>
          <p className="font-serif-luxury font-bold text-xs sm:text-sm text-[#444] tracking-[0.14em] uppercase">
            VÀO LÚC {weddingData.event.time} {weddingData.event.dayOfWeek.toUpperCase()}
          </p>
        </div>

        {/* CALENDAR BANNER: 3-column with double borders and towering 15 */}
        <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-3 my-4">
          {/* Left Column: Month */}
          <div className="flex-1 py-3 sm:py-3.5 border-t-2 border-b-2 border-double border-[#999] text-center">
            <span className="font-serif-luxury font-bold text-base sm:text-xl text-[#2b2727] tracking-wider uppercase whitespace-nowrap">
              THÁNG {weddingData.event.month}
            </span>
          </div>

          {/* Center Column: Huge Day Numeral */}
          <div className="flex-shrink-0 px-2 sm:px-3 text-center">
            <span className="font-serif-luxury font-bold text-6xl sm:text-8xl text-[#8b2f30] leading-none select-none drop-shadow-xs">
              {weddingData.event.day}
            </span>
          </div>

          {/* Right Column: Year */}
          <div className="flex-1 py-3 sm:py-3.5 border-t-2 border-b-2 border-double border-[#999] text-center">
            <span className="font-serif-luxury font-bold text-base sm:text-xl text-[#2b2727] tracking-wider uppercase whitespace-nowrap">
              NĂM {weddingData.event.year}
            </span>
          </div>
        </div>

        {/* LUNAR DATE */}
        <p className="relative z-10 font-serif-luxury italic text-xs sm:text-sm text-[#555] text-center tracking-wide mb-6">
          ({weddingData.event.lunarDateDisplay})
        </p>

        {/* VENUE & LOCATION */}
        <div className="relative z-10 text-center space-y-1.5 pt-1">
          <p className="font-serif-luxury text-xs sm:text-sm uppercase tracking-[0.2em] text-[#555] font-semibold">
            ĐỊA ĐIỂM TỔ CHỨC
          </p>
          <h4 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2b2727] tracking-wide uppercase drop-shadow-xs">
            {weddingData.event.venueName}
          </h4>
          <p className="font-sans text-xs sm:text-sm text-[#555] font-light max-w-xs sm:max-w-sm mx-auto leading-relaxed">
            ({weddingData.event.venueAddress})
          </p>
        </div>

        {/* FAST ACTION BUTTONS: Google Maps & Add to Calendar */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-dashed border-[#dfbaba]/60">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#8b2f30] hover:bg-[#722627] text-white text-xs font-serif-luxury font-semibold py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            Chỉ Đường
          </a>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-[#fff7f5] text-[#8b2f30] border border-[#8b2f30]/40 text-xs font-serif-luxury font-semibold py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Thêm Vào Lịch
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}
