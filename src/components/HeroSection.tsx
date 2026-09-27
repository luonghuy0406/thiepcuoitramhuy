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
      {/* Traditional Song Hỷ Emblem */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="w-13 h-13 relative transition-transform duration-500 hover:scale-105 cursor-pointer">
          <Image
            src="/assets/1egmxjgt9lqs1ro04evek.png"
            alt="Song Hỷ"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Header title */}
      <div ref={titleRef} className="space-y-1 flex flex-col items-center">
        <p className="text-[11px] tracking-[0.35em] uppercase text-[#812927]/90 font-cinzel font-semibold">
          {weddingData.event.subtitle}
        </p>
        <h2 className="text-xs sm:text-sm text-[#777] font-serif-luxury tracking-[0.25em] uppercase font-medium">
          Lễ Vu Quy
        </h2>
      </div>

      {/* Couple Names & Date */}
      <div ref={namesRef} className="my-3">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl font-script text-[#812927] tracking-wide py-1 drop-shadow-xs select-none">
            {weddingData.bride.shortName}
          </h1>
          <div className="flex items-center justify-center gap-3 my-[-6px]">
            <span className="h-[1px] w-10 sm:w-14 bg-[#dfbaba]" />
            <span className="text-2xl font-serif text-[#a33f3d] select-none font-light">&amp;</span>
            <span className="h-[1px] w-10 sm:w-14 bg-[#dfbaba]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-script text-[#812927] tracking-wide py-1 drop-shadow-xs select-none">
            {weddingData.groom.shortName}
          </h1>
        </div>

        {/* Date Display */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#812927]/35" />
          <span className="text-xs font-serif-luxury tracking-[0.25em] text-[#812927] uppercase font-semibold">
            {weddingData.event.dateDisplay}
          </span>
          <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#812927]/35" />
        </div>
      </div>

      {/* Hero Wedding Portrait with Parallax - 100% Unobstructed & Clean */}
      <div className="relative w-full max-w-[420px] mx-auto mt-2">
        <div
          ref={photoContainerRef}
          className="relative w-full aspect-[4/5] rounded-t-[140px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white bg-white"
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

          {/* Gentle bottom shade to ground the photo */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
