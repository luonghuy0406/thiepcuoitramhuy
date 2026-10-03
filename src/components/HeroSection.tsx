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

      // 2. Couple Names: Floating Bloom
      if (namesRef.current) {
        tl.fromTo(
          namesRef.current,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: "power2.out" },
          "-=0.9"
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
      className="relative -mt-20 sm:-mt-26 pb-0 flex flex-col items-center text-center overflow-visible z-10"
    >
      {/* Top Header Text with subtle curved paths mirroring the arched photo frame */}
      <div className="w-full px-4 flex flex-col items-center">
        {/* 1. Header title: Large romantic script "Wedding Invitation" curved gracefully along an arc */}
        <div
          ref={titleRef}
          className="w-full max-w-[420px] sm:max-w-[460px] mx-auto flex flex-col items-center -mb-0.5"
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

        {/* 2. Couple Names: Refined Cinzel uppercase font, curved harmoniously along a parallel arc */}
        <div
          ref={namesRef}
          className="w-full max-w-[380px] sm:max-w-[420px] mx-auto flex flex-col items-center -mt-1 mb-1"
        >
          <svg
            viewBox="0 0 500 46"
            className="w-full h-auto overflow-visible select-none drop-shadow-2xs"
          >
            <defs>
              <path
                id="couple-names-curve"
                d="M 30,42 C 130,8 370,8 470,42"
                fill="none"
              />
            </defs>
            <text
              fill="#812927"
              className="font-cinzel font-semibold uppercase"
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', serif",
                fontSize: "17px",
                letterSpacing: "0.18em",
              }}
            >
              <textPath
                href="#couple-names-curve"
                startOffset="50%"
                textAnchor="middle"
              >
                {weddingData.bride.shortName} &amp; {weddingData.groom.shortName}
              </textPath>
            </text>
          </svg>

          {/* Date Display */}
          <div ref={dateRef} className="flex items-center justify-center gap-2.5 sm:gap-3 mt-1">
            <span
              ref={dateLineLeftRef}
              className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#812927]/30 origin-right"
            />
            <span className="text-[11px] sm:text-xs font-serif-luxury tracking-wider text-[#812927]/85 uppercase font-medium">
              {weddingData.event.dateDisplay}
            </span>
            <span
              ref={dateLineRightRef}
              className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#812927]/30 origin-left"
            />
          </div>
        </div>
      </div>

      {/* Hero Wedding Portrait - Tràn đều ra viền trái phải, phần trên bo vòm 300px */}
      <div className="w-full relative mt-3 sm:mt-4">
        <div
          ref={photoContainerRef}
          className="relative w-full aspect-[4/5] rounded-t-[250px] rounded-b-none overflow-hidden shadow-md bg-[#eee4e0]"
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
