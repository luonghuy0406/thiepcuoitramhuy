"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { weddingData } from "@/data/wedding-data";

export default function CountdownSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 90%",
          once: true,
        },
        rotateX: 30,
        y: 25,
        opacity: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: "power3.out",
      });
    }, sectionRef);

    // Calculate time left to Dec 15, 2026 10:30:00
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

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 bg-gradient-to-b from-transparent via-[#f8edea]/80 to-transparent text-center"
    >
      <div className="max-w-[420px] mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-[#812927] font-semibold">
          Save The Date
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif-luxury text-[#3b3232] mt-1 mb-2">
          Đếm Ngược Ngày Chung Đôi
        </h3>
        <p className="text-xs text-[#666] font-light mb-6">
          Khoảnh khắc thiêng liêng sắp diễn ra
        </p>

        {/* Countdown Box Grid with 3D Flip */}
        <div
          ref={cardsRef}
          className="grid grid-cols-4 gap-2 sm:gap-3 perspective-1000"
        >
          {[
            { label: "Ngày", value: timeLeft.days },
            { label: "Giờ", value: timeLeft.hours },
            { label: "Phút", value: timeLeft.minutes },
            { label: "Giây", value: timeLeft.seconds },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-md rounded-2xl py-3 px-1 border border-[#dfbaba]/50 shadow-md flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <span className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#812927]">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#777] font-medium mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs font-serif italic text-[#812927] mt-6 tracking-wide">
          10:30 Thứ Năm - 15 Tháng 12, 2026
        </p>
      </div>
    </section>
  );
}
