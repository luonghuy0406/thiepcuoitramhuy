"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, Sparkles } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function LoveStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
            once: true,
          },
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out",
        });
      }

      // 2. Timeline vertical line drawing on scroll scrub
      if (lineProgressRef.current && timelineRef.current) {
        gsap.fromTo(
          lineProgressRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 78%",
              end: "bottom 85%",
              scrub: 1.2,
            },
          }
        );
      }

      // 3. Staggered reveal for love story cards
      const storyCards = timelineRef.current?.querySelectorAll(".story-card") || [];
      storyCards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
          x: 25,
          y: 20,
          opacity: 0,
          scale: 0.96,
          duration: 1.0,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="love-story-section" className="py-16 px-4 text-center">
      {/* Section Header */}
      <div ref={headerRef} className="mb-12">
        <div className="flex items-center justify-center gap-1.5 mb-1 text-[#b16964]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-[0.35em] font-bold">
            Hành Trình Yêu Thương
          </span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-4xl font-script text-[#b16964] mt-1 mb-2 drop-shadow-xs">
          Our Love Story
        </h3>
        <p className="text-xs text-[#777] font-light max-w-xs mx-auto">
          Từng dấu mốc đưa Ngọc Trâm và Lương Huy đến bến bờ hạnh phúc
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#b16964]" />
          <Heart className="w-3 h-3 text-[#b16964] fill-[#b16964]" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#b16964]" />
        </div>
      </div>

      {/* Love Story Timeline with Left Spine */}
      <div ref={timelineRef} className="relative max-w-[460px] mx-auto space-y-8">
        {/* Animated Left Spine Line */}
        <div className="absolute left-[15px] top-4 bottom-8 w-[2px] bg-[#dfbaba]/50 pointer-events-none z-0">
          <div
            ref={lineProgressRef}
            className="w-full bg-gradient-to-b from-[#e49696] via-[#b16964] to-[#e49696] rounded-full shadow-[0_0_8px_rgba(129,41,39,0.4)]"
            style={{ height: "0%" }}
          />
        </div>

        {weddingData.loveStory.map((item, idx) => {
          return (
            <div
              key={idx}
              className="story-card relative flex items-start gap-3 sm:gap-4.5 group"
            >
              {/* Timeline Heart Node (perfectly aligned with spine line) */}
              <div className="relative z-10 flex-shrink-0 mt-3 w-8 h-8 rounded-full bg-white border-2 border-[#b16964] shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-3.5 h-3.5 text-[#b16964] fill-[#b16964]" />
              </div>

              {/* Story Content Card */}
              <div className="flex-1 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-lg border border-[#dfbaba]/50 text-left transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                {/* Photo Frame */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-3.5 bg-[#f5e6e6] shadow-inner">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                    sizes="(max-width: 500px) 100vw, 420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Year Pill Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-yellow-100 px-3 py-1 rounded-full text-xs font-serif-luxury font-bold border border-yellow-200/30 shadow-md">
                    {item.year}
                  </div>

                  <div className="absolute bottom-2 left-3 text-white text-[11px] font-serif-luxury tracking-wide drop-shadow pointer-events-none">
                    {item.date}
                  </div>
                </div>

                {/* Text Info */}
                <div className="px-1">
                  <h4 className="text-xl font-serif-luxury font-bold text-[#b16964] mb-1.5 flex items-center gap-2">
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-[#555] leading-relaxed font-sans font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
