"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Clock } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function CalendarTimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Calendar card reveal
      gsap.from(calendarRef.current, {
        scrollTrigger: {
          trigger: calendarRef.current,
          start: "top 90%",
          once: true,
        },
        y: 30,
        scale: 0.97,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      // 2. Timeline line draw-down on scroll
      if (timelineLineRef.current && timelineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 82%",
              end: "bottom 88%",
              scrub: 1.2,
            },
          }
        );
      }

      // 3. Staggered reveal for timeline milestones
      const timelineItems =
        timelineRef.current?.querySelectorAll(".timeline-node") || [];
      timelineItems.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            once: true,
          },
          x: -22,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // December 2026 calendar days setup (1st is Tuesday)
  const calendarDays = [
    null, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30, 31, null, null, null
  ];

  return (
    <section ref={sectionRef} className="py-12 px-4 text-center">
      {/* Calendar Card */}
      <div
        ref={calendarRef}
        className="max-w-[420px] mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-md border border-[#dfbaba]/50 mb-12 transition-shadow hover:shadow-lg"
      >
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#812927] font-bold">
          Save The Date
        </span>

        <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#812927] mt-1 mb-4">
          Tháng 12 / 2026
        </h3>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-[11px] font-semibold text-[#812927] border-b border-[#dfbaba]/40 pb-2 mb-2">
          <span>T2</span>
          <span>T3</span>
          <span>T4</span>
          <span>T5</span>
          <span>T6</span>
          <span>T7</span>
          <span className="text-[#a33f3d]">CN</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-xs">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={idx} className="h-8" />;
            }

            const isWeddingDay = day === 15;

            return (
              <div
                key={idx}
                className="h-8 flex items-center justify-center relative"
              >
                {isWeddingDay ? (
                  <div className="relative w-8 h-8 rounded-full bg-[#812927] text-white flex flex-col items-center justify-center font-bold shadow-md scale-110 animate-pulse">
                    <span className="text-[11px] leading-none">{day}</span>
                    <Heart className="w-2.5 h-2.5 fill-current text-[#ffccd5] mt-0.5" />
                  </div>
                ) : (
                  <span
                    className={`font-medium ${
                      idx % 7 === 6 ? "text-[#a33f3d]" : "text-[#444]"
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-dashed border-[#dfbaba]/60 text-xs text-[#666]">
          {weddingData.event.lunarDate}
        </div>
      </div>

      {/* Wedding Timeline with dynamic progress line */}
      <div className="max-w-[420px] mx-auto text-left">
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#812927] font-bold">
            Lịch Trình
          </span>
          <h3 className="text-2xl font-serif-luxury text-[#3b3232] mt-1">
            Chương Trình Lễ Cưới
          </h3>
        </div>

        <div ref={timelineRef} className="relative pl-6 space-y-6">
          {/* Timeline Background Track */}
          <div className="absolute top-2 bottom-2 left-2.5 w-[2px] bg-[#dfbaba]/30 rounded-full" />

          {/* Animated Timeline Active Progress Line */}
          <div
            ref={timelineLineRef}
            className="absolute top-2 left-2.5 w-[2px] bg-gradient-to-b from-[#812927] to-[#e49696] rounded-full z-0"
          />

          {weddingData.timeline.map((item, index) => (
            <div
              key={index}
              className="timeline-node relative pl-4 transition-transform duration-300 hover:translate-x-1 z-10"
            >
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[19px] top-1 w-4 h-4 rounded-full bg-[#812927] border-2 border-white shadow-md flex items-center justify-center text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffccd5]" />
              </div>

              {/* Event Content Box */}
              <div className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-[#dfbaba]/40 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#812927] mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.time}</span>
                </div>
                <h4 className="font-serif-luxury font-bold text-[#3b3232] text-sm sm:text-base">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-[#666] font-light mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
