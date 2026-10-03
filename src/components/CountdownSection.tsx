"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarHeart } from "lucide-react";
import { weddingData } from "@/data/wedding-data";
import SectionDivider from "@/components/SectionDivider";
import AddToCalendarModal from "@/components/AddToCalendarModal";
import {
  addToCalendarByDevice,
  weddingCalendarEvent,
} from "@/data/calendar-event";

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

  // State mở popup/bottom sheet Lưu Ngày Cưới
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Xử lý khi nhấn nút Lưu Ngày Cưới: tự động nhận biết thiết bị và tải .ics / mở lịch ngay lập tức
  const handleAddToCalendar = () => {
    addToCalendarByDevice(weddingCalendarEvent);
    setIsCalendarModalOpen(true);
  };

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
      // Animate container as a single unit - avoids child ScrollTrigger opacity bugs
      if (containerRef.current) {
        gsap.from(containerRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            once: true,
          },
          y: 20,
          opacity: 0,
          duration: 0.9,
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

  return (
    <section
      ref={sectionRef}
      id="countdown-section"
      className="min-h-[100dvh] w-full flex flex-col justify-evenly items-center px-3 sm:px-4 py-2 sm:py-3 snap-start relative z-10 text-center"
    >
      {/* 1. Top Section Divider - Trải dài sát hai mép viền */}
      <SectionDivider variant={2} className="w-full my-0 px-0 flex-shrink-0" />

      <div ref={containerRef} className="w-full max-w-[440px] sm:max-w-[460px] mx-auto text-center">
        {/* Save The Date Crest Badge */}
        <div className="flex items-center justify-center gap-2 mb-1 text-[#b16964]">
          <span className="h-[1px] w-6 sm:w-10 bg-[#b16964]/30" />
          <span className="font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em]">
            Save The Date
          </span>
          <span className="h-[1px] w-6 sm:w-10 bg-[#b16964]/30" />
        </div>

        {/* Section Heading */}
        <h3 className="font-serif-luxury font-bold text-xl sm:text-2xl text-[#b16964] tracking-wider uppercase mb-0.5">
          Đếm Ngược Ngày Chung Đôi
        </h3>

        <p className="font-serif-luxury italic text-xs sm:text-[13px] text-[#b16964]/80 mb-2.5 sm:mb-3">
          Tháng {weddingData.event.month} · Năm {weddingData.event.year}
        </p>

        {/* 2. ĐỒNG HỒ ĐẾM NGƯỢC (COUNTDOWN TIMER) - Đặt ngay dưới tiêu đề */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mb-3 sm:mb-4 max-w-sm sm:max-w-md mx-auto">
          {[
            { label: "Ngày", value: timeLeft.days },
            { label: "Giờ", value: timeLeft.hours },
            { label: "Phút", value: timeLeft.minutes },
            { label: "Giây", value: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="py-1.5 sm:py-2 px-1 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <span
                suppressHydrationWarning
                className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#b16964] leading-tight select-none"
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] sm:text-[11px] font-cinzel uppercase tracking-wider text-[#7a5252] font-semibold mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 3. BẢNG LỊCH THÁNG 12 (Chỉ border, không background) */}
        <div className="rounded-2xl border border-[#b16964]/30 p-3 sm:p-4 mb-3 sm:mb-4 max-w-sm sm:max-w-md mx-auto">
          {/* Calendar Month Header */}
          <div className="flex items-center justify-between border-b border-[#b16964]/20 pb-1.5 mb-1.5 px-1">
            <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.16em] text-[#b16964] uppercase">
              Tháng 12 · 2026
            </span>
            <span className="text-[11px] sm:text-xs font-serif-luxury italic text-[#b16964]/80">
              Tức tháng 11 năm Bính Ngọ
            </span>
          </div>

          {/* Weekday Columns (T2 -> CN) */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => (
              <div
                key={idx}
                className={`font-cinzel text-[10px] sm:text-[11px] font-bold py-0.5 ${
                  idx === 6 ? "text-[#a33f3d]" : "text-[#b16964]"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="w-7 h-7 sm:w-8 sm:h-8"
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
                    <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-serif-luxury font-bold text-xs sm:text-sm text-white select-none animate-pulse">
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
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-sans transition-colors ${
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
        </div>

        {/* 4. NÚT LƯU NGÀY CƯỚI / ADD TO CALENDAR */}
        <div className="flex justify-center pt-0.5">
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="w-full sm:w-auto bg-[#7a1c1a] hover:bg-[#621614] text-white text-xs sm:text-[13px] font-serif-luxury font-bold tracking-[0.16em] uppercase py-2.5 sm:py-3 px-8 sm:px-10 rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CalendarHeart className="w-4 h-4 text-rose-200" />
            <span>Lưu Ngày Cưới</span>
          </button>
        </div>
      </div>

      {/* Popup / Bottom Sheet Lưu Ngày Cưới (Apple Calendar, Google Calendar, .ics) */}
      <AddToCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />
    </section>
  );
}
