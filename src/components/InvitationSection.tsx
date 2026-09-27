"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navigation, Calendar as CalendarIcon, Heart, Sparkles } from "lucide-react";
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
      {/* Ambient Liquid Glow Orbs in Background for Authentic Glass Refraction */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-gradient-to-tr from-[#dfbaba]/40 via-[#f8edea]/35 to-[#e49696]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[380px] -right-10 w-64 h-64 bg-gradient-to-bl from-[#e49696]/25 via-[#dfbaba]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[720px] -left-10 w-64 h-64 bg-gradient-to-tr from-[#dfbaba]/30 via-transparent to-[#fdf0ec]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Modern Liquid Glass Floating Invitation Card (Gracefully Overlapping Hero Photo) */}
      <div
        ref={letterRef}
        className="relative z-20 -mt-14 sm:-mt-20 max-w-[440px] mx-auto bg-gradient-to-b from-white/80 via-white/65 to-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(129,41,39,0.09),0_2px_8px_rgba(0,0,0,0.03),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(223,186,186,0.3)] border border-white/85 text-center overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_rgba(129,41,39,0.13)] group"
      >
        {/* Diagonal Liquid Specular Glare */}
        <div className="absolute -top-28 -right-28 w-60 h-60 bg-gradient-to-br from-white/60 via-white/10 to-transparent rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-gradient-to-tr from-[#dfbaba]/30 via-transparent to-transparent rounded-full blur-lg pointer-events-none" />

        {/* Modern Luxury Title Header */}
        <div className="relative z-10 flex flex-col items-center mb-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/95 shadow-2xs mb-2">
            <Sparkles className="w-3 h-3 text-[#812927] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-cinzel font-bold text-[#812927]">
              Invitation
            </span>
            <Sparkles className="w-3 h-3 text-[#812927] animate-pulse" />
          </div>
          <p className="text-[10px] sm:text-[11px] font-cormorant tracking-[0.25em] text-[#777] uppercase font-semibold">
            Lễ Vu Quy
          </p>
        </div>

        <h3 className="relative z-10 text-base sm:text-lg font-serif-luxury text-[#2b2727] font-semibold mb-2.5 leading-snug">
          Gửi đến gia đình, người thân &amp; bạn bè quý mến,
        </h3>

        <p className="relative z-10 text-xs sm:text-sm text-[#443c3c] leading-relaxed font-sans font-normal mb-4 max-w-sm mx-auto">
          Cảm ơn bạn đã dành tình cảm yêu thương và thời gian quý báu để cùng chúng mình chung vui trong ngày trọng đại này. Sự hiện diện và lời chúc phúc của bạn là món quà vô giá đối với chúng mình!
        </p>

        {/* Elegant Footer with Signature */}
        <div className="relative z-10 pt-3.5 border-t border-dashed border-[#dfbaba]/75 flex items-center justify-between px-3">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#812927] font-serif-luxury font-bold">
            Trân Trọng Kính Mời
          </span>
          <span className="font-script text-2xl sm:text-3xl text-[#812927] leading-none pt-1">
            Trâm &amp; Huy
          </span>
        </div>
      </div>

      {/* Connecting Liquid Glass Bridge Ribbon */}
      <div className="flex flex-col items-center my-6 select-none relative z-10">
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#812927]/30 to-[#812927]/80" />
        <div className="w-7 h-7 rounded-full bg-white/85 backdrop-blur-md border border-white/95 shadow-xs flex items-center justify-center my-1 text-[#812927] transition-transform duration-300 hover:scale-110">
          <Heart className="w-3.5 h-3.5 fill-[#812927]" />
        </div>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#812927]/80 to-[#812927]/30" />
      </div>

      {/* 2. Formal Centerpiece Wedding Invitation Card (Opaline Liquid Glass Aesthetic) */}
      <div
        ref={cardRef}
        className="relative max-w-[460px] mx-auto bg-gradient-to-b from-white/92 via-white/85 to-[#fdf9f7]/90 backdrop-blur-2xl rounded-[2.2rem] p-6 sm:p-8 shadow-[0_25px_60px_-10px_rgba(129,41,39,0.1),0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(223,186,186,0.3)] border border-white/90 text-left overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_rgba(129,41,39,0.15)] group"
      >
        {/* Ambient Corner Reflections */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-gradient-to-br from-[#dfbaba]/25 via-transparent to-transparent rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-gradient-to-tl from-[#e49696]/20 via-transparent to-transparent rounded-full blur-xl pointer-events-none" />

        {/* Delicate inner hairline frame */}
        <div className="absolute inset-2.5 sm:inset-3.5 border border-[#dfbaba]/45 rounded-[1.8rem] pointer-events-none" />

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

        {/* FAMILY INFORMATION: Translucent Frosted Glass Pods (Nhà Gái & Nhà Trai) */}
        <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4 text-center mb-6">
          {/* Nhà Gái */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/80 shadow-[0_2px_10px_rgba(129,41,39,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-1">
            <h4 className="font-serif-luxury font-bold text-base sm:text-lg text-[#8b2f30] mb-1.5 tracking-wide">
              Nhà Gái
            </h4>
            <p className="font-sans font-medium text-xs sm:text-[13px] text-[#3b3232] leading-snug">
              {weddingData.bride.fatherName}
            </p>
            <p className="font-sans font-medium text-xs sm:text-[13px] text-[#3b3232] leading-snug">
              {weddingData.bride.motherName}
            </p>
            <p className="font-sans font-medium text-[11px] sm:text-xs text-[#777] pt-1 tracking-wide">
              TP. {weddingData.bride.location}
            </p>
          </div>

          {/* Nhà Trai */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/80 shadow-[0_2px_10px_rgba(129,41,39,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-1">
            <h4 className="font-serif-luxury font-bold text-base sm:text-lg text-[#8b2f30] mb-1.5 tracking-wide">
              Nhà Trai
            </h4>
            <p className="font-sans font-medium text-xs sm:text-[13px] text-[#3b3232] leading-snug">
              {weddingData.groom.fatherName}
            </p>
            <p className="font-sans font-medium text-xs sm:text-[13px] text-[#3b3232] leading-snug">
              {weddingData.groom.motherName}
            </p>
            <p className="font-sans font-medium text-[11px] sm:text-xs text-[#777] pt-1 tracking-wide">
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
          <div className="flex-1 py-3 sm:py-3.5 border-t-2 border-b-2 border-double border-[#999] text-center bg-white/40 backdrop-blur-xs rounded-lg">
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
          <div className="flex-1 py-3 sm:py-3.5 border-t-2 border-b-2 border-double border-[#999] text-center bg-white/40 backdrop-blur-xs rounded-lg">
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
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/80 shadow-2xs mt-1">
            <p className="font-sans text-xs sm:text-[13px] text-[#555] font-light leading-relaxed">
              ({weddingData.event.venueAddress})
            </p>
          </div>
        </div>

        {/* FAST ACTION BUTTONS: Google Maps & Add to Calendar */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-dashed border-[#dfbaba]/60">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#8b2f30] to-[#742526] hover:from-[#742526] hover:to-[#5e1e1f] text-white text-xs font-serif-luxury font-semibold py-2.5 px-3 rounded-xl shadow-md border-t border-white/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            Chỉ Đường
          </a>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/80 hover:bg-white backdrop-blur-md text-[#8b2f30] border border-[#8b2f30]/40 text-xs font-serif-luxury font-semibold py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Thêm Vào Lịch
          </a>
        </div>
      </div>
    </section>
  );
}
