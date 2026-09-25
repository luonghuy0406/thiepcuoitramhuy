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
      className="relative pt-12 pb-0 px-4 flex flex-col items-center text-center overflow-visible"
    >
      {/* Decorative top happiness graphic with gentle rotation on scroll */}
      <div className="w-16 h-16 relative mb-2 opacity-90 transition-transform duration-500 hover:rotate-6">
        <Image
          src="/assets/1egmxjgt9lqs1ro04evek.png"
          alt="Song Hỷ"
          fill
          className="object-contain"
        />
      </div>

      {/* Header title */}
      <div ref={titleRef} className="space-y-1">
        <p className="text-xs tracking-[0.3em] uppercase text-[#812927] font-semibold">
          {weddingData.event.subtitle}
        </p>
        <h3 className="text-base text-[#666] font-medium font-serif-luxury tracking-wider">
          Thiệp mời cưới
        </h3>
      </div>

      {/* Couple Names & Date */}
      <div ref={namesRef} className="my-4">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl font-script text-[#812927] tracking-wide py-1 drop-shadow-sm">
            {weddingData.groom.shortName}
          </h1>
          <span className="text-2xl font-serif text-[#a33f3d] my-[-6px]">&amp;</span>
          <h1 className="text-4xl sm:text-5xl font-script text-[#812927] tracking-wide py-1 drop-shadow-sm">
            {weddingData.bride.shortName}
          </h1>
        </div>

        {/* Date Display (Outside photo, elegant typography) */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#812927]" />
          <span className="text-xs font-serif-luxury tracking-[0.25em] text-[#812927] uppercase font-semibold">
            {weddingData.event.dateDisplay}
          </span>
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#812927]" />
        </div>
      </div>

      {/* Hero Wedding Portrait with Parallax - 100% Unobstructed & Clean */}
      <div
        ref={photoContainerRef}
        className="relative w-full max-w-[420px] aspect-[4/5] rounded-t-[140px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white/95 bg-white"
      >
        <div ref={photoImageRef} className="relative w-full h-[115%] -top-[7%]">
          <Image
            src="/assets/f9a1916a-869c-4bc2-b2c1-f01b95c3729a.png"
            alt="Lương Huy & Ngọc Trâm"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
