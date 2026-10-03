"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarHeart } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

// Helper to calculate exact time remaining
const calculateTimeLeft = () => {
  const targetDate = new Date(weddingData.event.dateISO).getTime();
  const now = Date.now();
  const difference = targetDate - now;

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export default function CountdownSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const countdownBoxesRef = useRef<HTMLDivElement>(null);

  // Initialize countdown state immediately to avoid 00:00:00 flash
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  // Calendar cells for December 2026
  const { calendarCells, eventDay } = useMemo(() => {
    const year = weddingData.event.year;
    const month = weddingData.event.month; // 12
    const day = weddingData.event.day; // 15

    const firstDay = new Date(year, month - 1, 1);
    const totalDays = new Date(year, month, 0).getDate();

    // Monday-first offset: Mon=0, Tue=1, ..., Sun=6
    const startOffset = (firstDay.getDay() + 6) % 7;

    const cells: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push(d);
    }

    return { calendarCells: cells, eventDay: day };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            once: true,
          },
          y: 30,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
        });
      }

      if (countdownBoxesRef.current) {
        gsap.from(countdownBoxesRef.current.children, {
          scrollTrigger: {
            trigger: countdownBoxesRef.current,
            start: "top 92%",
            once: true,
          },
          y: 16,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    // Guaranteed countdown interval update
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, []);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Lễ Vu Quy: ${weddingData.bride.shortName} & ${weddingData.groom.shortName}`
  )}&dates=20261215T033000Z/20261215T060000Z&details=${encodeURIComponent(
    `Trân trọng kính mời quý khách tham dự Tiệc mừng Lễ Vu Quy tại ${weddingData.event.venueName} (${weddingData.event.venueAddress})`
  )}&location=${encodeURIComponent(weddingData.event.venueAddress)}`;

  return (
    <section
      ref={sectionRef}
      id="countdown-section"
      className="relative z-10 px-4 py-4 sm:py-6 text-center overflow-visible"
    >
      <div ref={containerRef} className="max-w-[440px] mx-auto text-center">
        {/* Save The Date Crest Badge */}
        <div className="flex items-center justify-center gap-2 mb-1.5 text-[#b16964]">
          <span className="h-[1px] w-6 sm:w-8 bg-[#b16964]/30" />
          <span className="font-cinzel text-xs font-bold uppercase tracking-[0.25em]">
            Save The Date
          </span>
          <span className="h-[1px] w-6 sm:w-8 bg-[#b16964]/30" />
        </div>

        {/* Section Heading */}
        <h3 className="font-serif-luxury font-bold text-xl sm:text-2xl text-[#b16964] tracking-wider uppercase mb-1">
          Đếm Ngược Ngày Chung Đôi
        </h3>

        <p className="font-serif-luxury italic text-xs text-[#b16964]/80 mb-5">
          Tháng {weddingData.event.month} · Năm {weddingData.event.year}
        </p>

        {/* Calendar Card - Modern, refined, not overly rounded (rounded-xl) */}
        <div className="bg-white/60 backdrop-blur-xs rounded-xl border border-[#b16964]/20 p-4 sm:p-5 mb-5 shadow-2xs">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between border-b border-[#b16964]/20 pb-2.5 mb-3 px-1">
            <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.16em] text-[#b16964] uppercase">
              Tháng 12 · 2026
            </span>
            <span className="text-[11px] font-serif-luxury italic text-[#b16964]/80">
              Tức tháng 11 âm Bính Ngọ
            </span>
          </div>

          {/* Weekday Columns (T2 -> CN) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => (
              <div
                key={idx}
                className={`font-cinzel text-[11px] font-bold py-1 ${
                  idx === 6 ? "text-[#a33f3d]" : "text-[#b16964]"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="w-8 h-8 sm:w-9 sm:h-9"
                  />
                );
              }

              const isWeddingDay = day === eventDay;

              return (
                <div
                  key={`day-${day}`}
                  className="flex items-center justify-center"
                >
                  {isWeddingDay ? (
                    /* Day 15 marked with the 3D silk cushion heart (tim.png) */
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-serif-luxury font-bold text-sm text-white select-none animate-pulse">
                      <Image
                        src="/assets/hoatiet/tim.png"
                        alt="Wedding Day"
                        fill
                        className="object-contain drop-shadow-xs scale-110"
                      />
                      <span className="relative z-10 drop-shadow-xs font-bold pt-0.5">
                        {day}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs sm:text-[13px] font-sans transition-colors ${
                        idx % 7 === 6
                          ? "text-[#a33f3d] font-semibold"
                          : "text-[#4a3f3f]"
                      }`}
                    >
                      {day}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Event note below calendar */}
          <div className="mt-3.5 pt-2.5 border-t border-[#b16964]/20 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-serif-luxury italic text-[#b16964]">
            <div className="w-3.5 h-3.5 relative flex-shrink-0">
              <Image
                src="/assets/hoatiet/tim.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span>
              15.12.2026 · {weddingData.event.title} ({weddingData.bride.shortName} &amp; {weddingData.groom.shortName})
            </span>
          </div>
        </div>

        {/* Subtle Countdown Section Label */}
        <div className="flex items-center justify-center gap-3 my-4">
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#b16964]/40" />
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#b16964] uppercase font-bold">
            Thời Gian Còn Lại
          </span>
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#b16964]/40" />
        </div>

        {/* 4 Countdown Boxes - Modern, refined, rounded-xl */}
        <div
          ref={countdownBoxesRef}
          className="grid grid-cols-4 gap-2 sm:gap-3 mb-5"
        >
          {[
            { label: "Ngày", value: timeLeft.days },
            { label: "Giờ", value: timeLeft.hours },
            { label: "Phút", value: timeLeft.minutes },
            { label: "Giây", value: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-xs rounded-xl py-2.5 px-1 border border-[#b16964]/20 shadow-2xs flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#b16964] leading-tight select-none">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#7a5252] font-semibold mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Add to Google Calendar Action Button */}
        <div className="flex justify-center pt-1">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#7a1c1a] hover:bg-[#621614] text-white text-xs sm:text-[13px] font-serif-luxury font-bold tracking-[0.16em] uppercase py-3 px-8 rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <CalendarHeart className="w-4 h-4 text-rose-200" />
            <span>Thêm Vào Google Lịch</span>
          </a>
        </div>
      </div>
    </section>
  );
}
