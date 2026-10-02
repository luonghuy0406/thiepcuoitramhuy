"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { weddingData } from "@/data/wedding-data";

export default function ProgramSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

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
          y: 25,
          opacity: 0,
          stagger: 0.12,
          duration: 1.0,
          ease: "power3.out",
        });
      }

      // 2. Schedule list card & items reveal with stagger
      if (scheduleRef.current) {
        const items = scheduleRef.current.querySelectorAll(".schedule-item");
        gsap.from(items, {
          scrollTrigger: {
            trigger: scheduleRef.current,
            start: "top 90%",
            once: true,
          },
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="program-section" className="py-14 px-4 text-center">
      {/* Header */}
      <div ref={headerRef} className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#812927] font-semibold font-cinzel">
          Chương Trình Tiệc Cưới
        </span>
        <h3 className="text-4xl sm:text-5xl font-script text-[#812927] mt-1 mb-2">
          Wedding Schedule
        </h3>
        <p className="text-xs text-[#777] font-light max-w-xs mx-auto">
          Thời gian diễn ra các khoảnh khắc đáng nhớ trong ngày trọng đại
        </p>
      </div>

      <div className="max-w-[460px] mx-auto">
        {/* Schedule List Card */}
        <div
          ref={scheduleRef}
          className="rounded-3xl shadow-xl border border-[#dfbaba]/60 overflow-hidden text-left transition-all duration-300 hover:shadow-2xl"
          style={{
            backgroundImage: "url('/assets/bg-lake-terrace-opt.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-[#fffdfa]/88 backdrop-blur-[2px] p-6 sm:p-7 rounded-3xl divide-y divide-[#dfbaba]/30">
          {weddingData.programSchedule.map((prog, idx) => (
            <div
              key={idx}
              className={`schedule-item flex items-baseline gap-4 sm:gap-5 ${
                idx === 0 ? "pb-4" : idx === weddingData.programSchedule.length - 1 ? "pt-4" : "py-4"
              } transition-colors duration-200 hover:bg-[#fff9f7]/60 rounded-xl px-2`}
            >
              {/* Time Column */}
              <div className="flex-shrink-0 w-14 sm:w-16">
                <span className="font-serif-luxury font-bold text-base sm:text-lg text-[#812927] tracking-wide">
                  {prog.time}
                </span>
              </div>

              {/* Activity Details Column */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-serif-luxury font-bold text-[#2b2727] leading-snug">
                  {prog.title}
                </h4>
                <p className="text-xs text-[#666] font-light mt-0.5 leading-relaxed">
                  {prog.description}
                </p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
