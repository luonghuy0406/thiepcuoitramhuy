"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Navigation, Calendar as CalendarIcon, Clock } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function VenueSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          once: true,
        },
        y: 30,
        scale: 0.97,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });
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
    <section ref={sectionRef} className="py-12 px-4 text-center">
      <div
        ref={cardRef}
        className="max-w-[440px] mx-auto rounded-3xl shadow-xl border border-[#dfbaba]/60 overflow-hidden text-center transition-all duration-300 hover:shadow-2xl"
        style={{
          backgroundImage: "url('/assets/venue-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[#fffdfa]/88 backdrop-blur-[1.5px] p-6 sm:p-7 rounded-3xl">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#b16964] font-bold">
          Địa Điểm Tổ Chức
        </span>

        <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#b16964] mt-2 mb-1">
          {weddingData.event.venueName}
        </h3>

        <div className="flex items-center justify-center gap-2 text-xs text-[#555] mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#b16964]" />
          <span>{weddingData.event.venueAddress}</span>
        </div>

        {/* Time Badge */}
        <div className="bg-[#f9f1ef] py-3 px-4 rounded-xl border border-[#dfbaba]/40 flex items-center justify-around text-xs text-[#444] mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#b16964]" />
            <span className="font-semibold">{weddingData.event.time}</span>
          </div>
          <div className="w-[1px] h-4 bg-[#dfbaba]" />
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-[#b16964]" />
            <span>Thứ Năm, 15.12.2026</span>
          </div>
        </div>

        {/* Map Preview Container with Romantic Heart Pin */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-inner border border-[#dfbaba]/40 mb-6 bg-[#eae4e1]">
          {/* Map background image preview */}
          <iframe
            title="Bản đồ địa điểm tổ chức"
            width="100%"
            height="100%"
            className="border-0 grayscale-[30%] contrast-[105%]"
            src="https://maps.google.com/maps?q=Trong+Dong+Palace+18A+Ly+Van+Phuc+Ha+Noi&t=&z=15&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
          />

          {/* Direct link overlay */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-[#b16964] text-[11px] font-medium px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 transition-all"
          >
            <Navigation className="w-3 h-3 text-[#b16964]" />
            Mở Google Maps
          </a>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#b16964] hover:bg-[#6b2220] text-white text-xs font-medium py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            Chỉ Đường
          </a>

          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-[#f9f1ef] text-[#b16964] border border-[#b16964]/40 text-xs font-medium py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
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
