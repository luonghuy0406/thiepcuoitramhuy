"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { weddingData } from "@/data/wedding-data";

interface HeroSectionProps {
  isOpeningTriggered?: boolean;
}

export default function HeroSection({ isOpeningTriggered = true }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);
  const ampersandRef = useRef<HTMLSpanElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const dateLineLeftRef = useRef<HTMLSpanElement>(null);
  const dateLineRightRef = useRef<HTMLSpanElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const photoImageRef = useRef<HTMLDivElement>(null);

  const hasAnimatedRef = useRef(false);

  // Initial hidden state if envelope is not yet opened
  useEffect(() => {
    if (!isOpeningTriggered && !hasAnimatedRef.current) {
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, y: 28 });
      if (namesRef.current) gsap.set(namesRef.current, { opacity: 0, y: 20 });
      if (dateRef.current) gsap.set(dateRef.current, { opacity: 0 });
      if (photoContainerRef.current) gsap.set(photoContainerRef.current, { opacity: 0, y: 35 });
    }
  }, [isOpeningTriggered]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!isOpeningTriggered || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. "Wedding Invitation": Floating Bloom with blur-to-sharp rise
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 24, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power2.out" }
        );
      }

      // 2. Couple Names: Floating Bloom without letter-spacing
      if (namesRef.current) {
        tl.fromTo(
          namesRef.current,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: "power2.out" },
          "-=0.9"
        );
      }

      if (ampersandRef.current) {
        tl.fromTo(
          ampersandRef.current,
          { opacity: 0, scale: 0.5, rotate: -10 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: "back.out(1.5)" },
          "-=1.0"
        );
      }

      // 3. Date Display & Decorative Gold Lines
      if (dateRef.current) {
        tl.fromTo(
          dateRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" },
          "-=0.8"
        );
      }

      if (dateLineLeftRef.current && dateLineRightRef.current) {
        tl.fromTo(
          [dateLineLeftRef.current, dateLineRightRef.current],
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.95, ease: "power2.out" },
          "<"
        );
      }

      // 4. Wedding Portrait Card
      if (photoContainerRef.current) {
        tl.fromTo(
          photoContainerRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" },
          "-=0.8"
        );
      }

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
  }, [isOpeningTriggered]);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative -mt-14 sm:-mt-18 pb-0 flex flex-col items-center text-center overflow-visible z-10"
    >
      {/* Top Header Text with side padding */}
      <div className="w-full px-4 flex flex-col items-center">
        {/* Header title: Large romantic script "Wedding Invitation" nestled right below the hero crest */}
        <div ref={titleRef} className="relative z-10 flex flex-col items-center mb-1">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-script text-[#812927] tracking-wide py-1 drop-shadow-xs select-none">
            Wedding Invitation
          </h2>
        </div>

        {/* Couple Names & Date: Refined Cinzel uppercase font, smaller and naturally spaced */}
        <div ref={namesRef} className="relative z-10 my-1 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm md:text-base font-cinzel font-semibold text-[#812927] uppercase select-none tracking-normal">
            <span>{weddingData.bride.shortName}</span>
            <span ref={ampersandRef} className="text-[#a33f3d] font-serif font-light text-xs sm:text-sm italic">&amp;</span>
            <span>{weddingData.groom.shortName}</span>
          </div>

          {/* Date Display */}
          <div ref={dateRef} className="flex items-center justify-center gap-2.5 sm:gap-3 mt-1.5">
            <span ref={dateLineLeftRef} className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#812927]/30 origin-right" />
            <span className="text-[11px] sm:text-xs font-serif-luxury tracking-wider text-[#812927]/85 uppercase font-medium">
              {weddingData.event.dateDisplay}
            </span>
            <span ref={dateLineRightRef} className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#812927]/30 origin-left" />
          </div>
        </div>
      </div>

      {/* Hero Wedding Portrait - Tràn đều ra viền trái phải, phần trên bo tròn duyên dáng */}
      <div className="w-full relative mt-4 sm:mt-5">
        <div
          ref={photoContainerRef}
          className="relative w-full aspect-[4/5] rounded-t-[36px] sm:rounded-t-[44px] rounded-b-none overflow-hidden shadow-md bg-[#eee4e0]"
        >
          <div ref={photoImageRef} className="relative w-full h-[115%] -top-[7%]">
            <Image
              src="/assets/hero-couple.png"
              alt="Ngọc Trâm & Lương Huy"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Gentle bottom shade to ground the photo */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
