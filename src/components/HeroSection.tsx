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
      if (namesRef.current) gsap.set(namesRef.current, { opacity: 0, y: 15 });
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

      // 2. Wedding Portrait Card: Rises and settles into view
      if (photoContainerRef.current) {
        tl.fromTo(
          photoContainerRef.current,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" },
          "-=0.9"
        );
      }

      // 3. Couple Names inside Photo: Floating Bloom
      if (namesRef.current) {
        tl.fromTo(
          namesRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
          "-=0.7"
        );
      }

      // 4. Date Display & Decorative Lines inside Photo
      if (dateRef.current) {
        tl.fromTo(
          dateRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
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
      className="relative -mt-10 sm:-mt-14 pb-0 flex flex-col justify-between items-center text-center overflow-visible z-10 h-[calc(100dvh-140px)] sm:h-[calc(100dvh-150px)] min-h-[500px] snap-start"
    >
      {/* 1. Header title: Large romantic script "Wedding Invitation" curved gracefully along the top crest */}
      <div className="w-full px-4 flex flex-col items-center flex-shrink-0">
        <div
          ref={titleRef}
          className="w-full max-w-[420px] sm:max-w-[460px] mx-auto flex flex-col items-center"
        >
          <svg
            viewBox="0 0 500 82"
            className="w-full h-auto overflow-visible select-none drop-shadow-2xs"
          >
            <defs>
              <path
                id="wedding-invitation-curve"
                d="M 20,76 C 120,10 380,10 480,76"
                fill="none"
              />
            </defs>
            <text
              fill="#812927"
              className="font-script"
              style={{
                fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                fontSize: "65px",
              }}
            >
              <textPath
                href="#wedding-invitation-curve"
                startOffset="50%"
                textAnchor="middle"
              >
                Wedding Invitation
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* 2. Hero Wedding Portrait - Tràn viền trái phải, sát viền dưới, bo vòm 250px ở trên */}
      <div className="w-full flex-1 min-h-0 relative mt-1.5 sm:mt-2">
        <div
          ref={photoContainerRef}
          className="relative w-full h-full rounded-t-[250px] rounded-b-none overflow-hidden shadow-md bg-[#eee4e0]"
        >
          <div ref={photoImageRef} className="relative w-full h-[115%] top-[6%]">
            <Image
              src="/assets/hero-couple.jpg"
              alt="Ngọc Trâm & Lương Huy"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Bottom vignette / shade to ground the photo and provide text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-40 sm:h-48 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none z-10" />

          {/* Tên cô dâu chú rể và Ngày nằm bên trong ảnh (thẳng, không cong chữ, nâng cao vừa tầm nhìn) */}
          <div className="absolute bottom-11 sm:bottom-14 inset-x-4 flex flex-col items-center text-center pointer-events-none z-20 space-y-1">
            {/* Couple Names - Không cong chữ, sang trọng, thanh lịch */}
            <div
              ref={namesRef}
              className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg text-white uppercase tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] select-none"
            >
              <span>{weddingData.bride.shortName}</span>
              <span className="text-[#fcd5ce] font-serif font-light text-xs sm:text-sm italic">&amp;</span>
              <span>{weddingData.groom.shortName}</span>
            </div>

            {/* Date Display */}
            <div ref={dateRef} className="flex items-center justify-center gap-2.5 sm:gap-3 mt-0.5">
              {/* <span
                ref={dateLineLeftRef}
                className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-white/70 origin-right"
              /> */}
              <span className="text-[11px] sm:text-xs tracking-widest text-white/95 uppercase font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                {weddingData.event.dateDisplay}
              </span>
              {/* <span
                ref={dateLineRightRef}
                className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-white/70 origin-left"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
