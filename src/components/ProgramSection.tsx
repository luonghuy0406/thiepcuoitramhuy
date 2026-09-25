"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarClock,
  Coffee,
  Heart,
  Wine,
  Gift,
  Music,
  Sparkles,
} from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function ProgramSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const thankYouRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
            once: true,
          },
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out",
        });
      }

      // 2. Schedule list card & items reveal with stagger
      if (scheduleRef.current) {
        gsap.from(scheduleRef.current, {
          scrollTrigger: {
            trigger: scheduleRef.current,
            start: "top 90%",
            once: true,
          },
          y: 25,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });

        const items = scheduleRef.current.querySelectorAll(".schedule-item");
        gsap.from(items, {
          scrollTrigger: {
            trigger: scheduleRef.current,
            start: "top 90%",
            once: true,
          },
          x: -15,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
      }

      // 3. Thank You Card Reveal
      if (thankYouRef.current) {
        gsap.from(thankYouRef.current, {
          scrollTrigger: {
            trigger: thankYouRef.current,
            start: "top 90%",
            once: true,
          },
          y: 30,
          scale: 0.97,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getProgramIcon = (iconName: string) => {
    switch (iconName) {
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      case "ring":
        return <Heart className="w-4 h-4" />;
      case "wine":
        return <Wine className="w-4 h-4" />;
      case "gift":
        return <Gift className="w-4 h-4" />;
      case "music":
        return <Music className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <section ref={sectionRef} id="program-section" className="py-16 px-4 text-center">
      {/* Header */}
      <div ref={headerRef} className="mb-10">
        <div className="flex items-center justify-center gap-1.5 mb-1 text-[#812927]">
          <CalendarClock className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-[0.3em] font-bold">
            Chương Trình Tiệc Cưới
          </span>
          <CalendarClock className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-4xl font-script text-[#812927] mt-1 mb-2">
          Wedding Schedule
        </h3>
        <p className="text-xs text-[#777] font-light max-w-xs mx-auto">
          Thời gian diễn ra các khoảnh khắc đáng nhớ trong ngày trọng đại
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#812927]" />
          <Heart className="w-3 h-3 text-[#812927] fill-[#812927]" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#812927]" />
        </div>
      </div>

      <div className="max-w-[460px] mx-auto space-y-10">
        {/* Schedule List Card */}
        <div
          ref={scheduleRef}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-lg border border-[#dfbaba]/50 space-y-4"
        >
          {weddingData.programSchedule.map((prog, idx) => (
            <div
              key={idx}
              className="schedule-item flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-[#dfbaba]/60 text-left shadow-xs transition-all duration-300 hover:bg-[#fff7f5] hover:shadow-sm"
            >
              {/* Time Pill Badge */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <span className="bg-[#812927] text-white text-xs font-serif-luxury font-bold px-2.5 py-1 rounded-xl shadow-xs">
                  {prog.time}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#f8edea] text-[#812927] flex items-center justify-center mt-2">
                  {getProgramIcon(prog.icon)}
                </div>
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-serif-luxury font-bold text-[#812927] leading-snug">
                  {prog.title}
                </h4>
                <p className="text-xs text-[#555] font-light mt-0.5 leading-relaxed">
                  {prog.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Heartfelt Thank You Card */}
        <div
          ref={thankYouRef}
          className="relative bg-gradient-to-b from-white via-[#fffdfa] to-[#fcf3f0] rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#dfbaba]/60 overflow-hidden"
        >
          {/* Decorative Corner Flairs */}
          <div className="absolute top-2 left-2 text-[#dfbaba]/60">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute top-2 right-2 text-[#dfbaba]/60">
            <Sparkles className="w-4 h-4" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.35em] text-[#812927] font-semibold block mb-2">
            {weddingData.thankYou.subtitle}
          </span>
          <h3 className="text-3xl font-script text-[#812927] mb-4">
            {weddingData.thankYou.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#444] font-sans font-light leading-relaxed mb-6 italic">
            “{weddingData.thankYou.message}”
          </p>

          {/* Couple Signatures */}
          <div className="pt-4 border-t border-dashed border-[#dfbaba]/60 flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#888] block font-sans">
                Chú rể
              </span>
              <p className="text-2xl font-script text-[#812927]">
                {weddingData.thankYou.groomSignature}
              </p>
            </div>

            <Heart className="w-4 h-4 text-[#812927] fill-[#812927] animate-pulse" />

            <div className="text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#888] block font-sans">
                Cô dâu
              </span>
              <p className="text-2xl font-script text-[#812927]">
                {weddingData.thankYou.brideSignature}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
