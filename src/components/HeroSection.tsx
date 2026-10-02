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
  const songHyRef = useRef<HTMLDivElement>(null);
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
      if (songHyRef.current) gsap.set(songHyRef.current, { opacity: 0, y: -18 });
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, y: 32 });
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

      // 1. Traditional Song Hỷ Emblem: Gentle scale & fall
      if (songHyRef.current) {
        tl.fromTo(
          songHyRef.current,
          { opacity: 0, scale: 0.75, y: -16 },
          { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "back.out(1.2)" }
        );
      }

      // 2. "Wedding Invitation": Floating Bloom with blur-to-sharp rise
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 28, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power2.out" },
          "-=0.7"
        );
      }

      // 3. Couple Names: Floating Bloom without letter-spacing
      if (namesRef.current) {
        tl.fromTo(
          namesRef.current,
          { opacity: 0, y: 18, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power2.out" },
          "-=0.9"
        );
      }

      if (ampersandRef.current) {
        tl.fromTo(
          ampersandRef.current,
          { opacity: 0, scale: 0.5, rotate: -10 },
          { opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: "back.out(1.5)" },
          "-=1.1"
        );
      }

      // 4. Date Display & Decorative Gold Lines
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

      // 5. Wedding Portrait Card
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
      className="relative pt-10 pb-6 sm:pb-8 px-4 flex flex-col items-center text-center overflow-visible z-10"
    >
      {/* Romantic Soft Floral Pastel Pink Background Motif */}
      <div className="absolute top-0 left-0 right-0 h-[520px] pointer-events-none overflow-hidden z-0 opacity-75">
        <Image
          src="/assets/hero-floral-bg.jpg"
          alt="Floral background"
          fill
          priority
          className="object-cover object-top filter brightness-[1.08] contrast-[0.96] blur-[0.2px]"
        />
        {/* Pastel pink luminous veil & soft gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff5f6]/40 via-[#fdeef0]/30 to-[#f9f1ef]" />
      </div>

      {/* Traditional Song Hỷ Emblem: Romantic Peony Floral Wreath Motif */}
      <div ref={songHyRef} className="relative z-10 mb-1 flex items-center justify-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 relative transition-transform duration-500 hover:scale-105 cursor-pointer opacity-95">
          <Image
            src="/assets/song-hy-emblem.png"
            alt="Song Hỷ"
            width={70}
            height={70}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Header title: Large romantic script "Wedding Invitation" */}
      <div ref={titleRef} className="relative z-10 flex flex-col items-center mb-1">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-script text-[#812927] tracking-wide py-1 drop-shadow-xs select-none">
          Wedding Invitation
        </h2>
      </div>

      {/* Couple Names & Date: Refined Cinzel uppercase font, smaller and naturally spaced */}
      <div ref={namesRef} className="relative z-10 my-2 flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-sm md:text-base font-cinzel font-semibold text-[#812927] uppercase select-none tracking-normal">
          <span>{weddingData.bride.shortName}</span>
          <span ref={ampersandRef} className="text-[#a33f3d] font-serif font-light text-xs sm:text-sm italic">&amp;</span>
          <span>{weddingData.groom.shortName}</span>
        </div>

        {/* Date Display */}
        <div ref={dateRef} className="flex items-center justify-center gap-2.5 sm:gap-3 mt-2">
          <span ref={dateLineLeftRef} className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#812927]/30 origin-right" />
          <span className="text-[11px] sm:text-xs font-serif-luxury tracking-wider text-[#812927]/85 uppercase font-medium">
            {weddingData.event.dateDisplay}
          </span>
          <span ref={dateLineRightRef} className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#812927]/30 origin-left" />
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
              src="/assets/hero-couple.png"
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
