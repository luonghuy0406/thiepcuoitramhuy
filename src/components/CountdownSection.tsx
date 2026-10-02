"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles, CalendarHeart } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function CountdownSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const countdownBoxesRef = useRef<HTMLDivElement>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate dynamic calendar grid for December 2026
  const { calendarCells, eventDay } = useMemo(() => {
    const year = weddingData.event.year;
    const month = weddingData.event.month; // 12
    const day = weddingData.event.day; // 15

    const firstDay = new Date(year, month - 1, 1);
    const totalDays = new Date(year, month, 0).getDate();

    // In Vietnam, calendar week starts Monday: Mon=0, Tue=1, ..., Sun=6
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
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            once: true,
          },
          y: 35,
          opacity: 0,
          scale: 0.97,
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
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    // Calculate time left to wedding date
    const targetDate = new Date(weddingData.event.dateISO).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

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
      className="relative z-20 px-4 py-6 sm:py-8 text-center overflow-visible"
    >
      <div
        ref={cardRef}
        className="relative max-w-[450px] mx-auto rounded-3xl shadow-xl border border-[#dfbaba]/70 bg-[#fffdfa] text-center overflow-hidden p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl"
      >
        {/* Inner subtle vintage frame border */}
        <div className="absolute inset-2.5 sm:inset-3 border border-[#dfbaba]/40 rounded-2xl pointer-events-none z-10" />

        <div className="relative z-10">
          {/* Header Badge */}
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[#812927]">
            <Sparkles className="w-3.5 h-3.5 text-[#a33f3d]" />
            <span className="font-cinzel text-xs font-bold uppercase tracking-[0.25em]">
              Save The Date
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#a33f3d]" />
          </div>

          <h3 className="font-serif-luxury font-bold text-xl sm:text-2xl text-[#812927] tracking-wider uppercase mb-1">
            Đếm Ngược Ngày Chung Đôi
          </h3>

          <p className="font-serif-luxury italic text-xs text-[#812927]/80 mb-5">
            Tháng {weddingData.event.month} · Năm {weddingData.event.year}
          </p>

          {/* Calendar Card Box */}
          <div className="bg-[#fcf8f6] rounded-2xl border border-[#dfbaba]/60 p-4 sm:p-5 mb-5 shadow-2xs">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between border-b border-[#dfbaba]/50 pb-2 mb-3 px-1">
              <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.16em] text-[#812927] uppercase">
                Tháng 12 · 2026
              </span>
              <span className="text-[11px] font-serif-luxury italic text-[#812927]/75">
                Tức tháng 11 âm Bính Ngọ
              </span>
            </div>

            {/* Weekday Columns (T2 -> CN) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, idx) => (
                <div
                  key={idx}
                  className={`font-cinzel text-[11px] font-bold py-1 ${
                    idx === 6 ? "text-[#a33f3d]" : "text-[#812927]"
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
                      <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#812927] to-[#a33f3d] text-white flex items-center justify-center font-serif-luxury font-bold text-sm shadow-md ring-2 ring-[#812927]/30 scale-105 select-none animate-pulse">
                        <span>{day}</span>
                        <Heart className="w-2.5 h-2.5 text-rose-200 fill-current absolute -top-1 -right-0.5" />
                      </div>
                    ) : (
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-[13px] font-sans transition-colors ${
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
            <div className="mt-3.5 pt-2.5 border-t border-[#dfbaba]/40 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-serif-luxury italic text-[#812927]">
              <Heart className="w-3 h-3 text-[#812927] fill-current" />
              <span>
                15.12.2026 · {weddingData.event.title} ({weddingData.bride.shortName} &amp; {weddingData.groom.shortName})
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-[1px] w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#812927]/40" />
            <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#812927] uppercase font-bold">
              Thời Gian Còn Lại
            </span>
            <span className="h-[1px] w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#812927]/40" />
          </div>

          {/* 4 Countdown Boxes */}
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
                className="bg-white rounded-2xl py-2.5 px-1 border border-[#dfbaba]/60 shadow-xs flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#812927] leading-tight select-none">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#7a6b6b] font-medium mt-0.5">
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
              className="w-full sm:w-auto bg-[#7a1c1a] hover:bg-[#621614] text-white text-xs sm:text-[13px] font-serif-luxury font-bold tracking-[0.16em] uppercase py-3 px-6 sm:px-8 rounded-full shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <CalendarHeart className="w-4 h-4 text-rose-200" />
              <span>Thêm Vào Google Lịch</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
