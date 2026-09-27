"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { weddingData } from "@/data/wedding-data";

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const photoImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
      })
        .from(
          namesRef.current,
          {
            y: 35,
            opacity: 0,
            scale: 0.95,
            duration: 1.1,
          },
          "-=0.6"
        )
        .from(
          photoContainerRef.current,
          {
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.7"
        );

      // Parallax scroll on photo
      if (photoImageRef.current) {
        gsap.to(photoImageRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: photoContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative pt-10 pb-0 px-4 flex flex-col items-center text-center overflow-visible z-10"
    >
      {/* Decorative top happiness graphic with gentle rotation and frosted glass disk */}
      <div className="relative mb-3 flex items-center justify-center">
        {/* Soft ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#dfbaba]/50 via-[#f8edea]/60 to-[#e49696]/40 rounded-full blur-md -z-10" />
        <div className="relative w-15 h-15 rounded-full bg-white/80 backdrop-blur-md border border-white/95 shadow-[0_4px_16px_rgba(129,41,39,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center p-3 transition-transform duration-500 hover:rotate-6 hover:scale-105 cursor-pointer">
          <Image
            src="/assets/1egmxjgt9lqs1ro04evek.png"
            alt="Song Hỷ"
            width={40}
            height={40}
            className="object-contain drop-shadow-2xs"
          />
        </div>
      </div>

      {/* Header title */}
      <div ref={titleRef} className="space-y-1.5 flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#812927]/70 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#812927] font-semibold font-cinzel">
            {weddingData.event.subtitle}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#812927]/70 animate-pulse" />
        </span>
        <h3 className="text-base sm:text-lg text-[#554b4b] font-medium font-serif-luxury tracking-widest uppercase">
          Lễ Vu Quy
        </h3>
      </div>

      {/* Couple Names & Date */}
      <div ref={namesRef} className="my-3.5">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-script bg-gradient-to-r from-[#812927] via-[#a33f3d] to-[#812927] bg-clip-text text-transparent tracking-wide py-1 drop-shadow-2xs select-none">
            {weddingData.bride.shortName}
          </h1>
          <div className="flex items-center justify-center gap-3 my-[-6px]">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-[#dfbaba] to-[#812927]/50" />
            <span className="text-2xl font-serif text-[#a33f3d] select-none font-light">&amp;</span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent via-[#dfbaba] to-[#812927]/50" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-script bg-gradient-to-r from-[#812927] via-[#a33f3d] to-[#812927] bg-clip-text text-transparent tracking-wide py-1 drop-shadow-2xs select-none">
            {weddingData.groom.shortName}
          </h1>
        </div>

        {/* Date Display Pill (Frosted Glass Pill) */}
        <div className="flex items-center justify-center mt-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/95 shadow-[0_2px_10px_rgba(129,41,39,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)]">
            <span className="text-[11px] sm:text-xs font-serif-luxury tracking-[0.25em] text-[#812927] uppercase font-bold">
              {weddingData.event.dateDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Wedding Portrait with Parallax - 100% Unobstructed & Clean */}
      <div className="relative w-full max-w-[420px] mx-auto mt-2">
        {/* Ambient Backlight Glow under portrait */}
        <div className="absolute -inset-1.5 rounded-t-[144px] rounded-b-[2.2rem] bg-gradient-to-b from-[#dfbaba]/50 via-white/40 to-[#e49696]/30 blur-lg -z-10" />

        <div
          ref={photoContainerRef}
          className="relative w-full aspect-[4/5] rounded-t-[140px] rounded-b-[2rem] overflow-hidden shadow-[0_25px_60px_-12px_rgba(129,41,39,0.2)] border-4 border-white/95 bg-white"
        >
          <div ref={photoImageRef} className="relative w-full h-[115%] -top-[7%]">
            <Image
              src="/assets/f9a1916a-869c-4bc2-b2c1-f01b95c3729a.png"
              alt="Ngọc Trâm & Lương Huy"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Ultra-subtle bottom vignette gradient to blend seamlessly into liquid glass overlap */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
