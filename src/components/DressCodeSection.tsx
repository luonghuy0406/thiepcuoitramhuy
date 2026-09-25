"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Palette, Car, Camera, Heart, ShieldCheck } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function DressCodeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const swatchesRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Dress Code Card Reveal
      if (cardRef.current) {
        gsap.from(cardRef.current, {
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 88%",
            once: true,
          },
          y: 35,
          scale: 0.96,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      }

      // 2. Swatches pop in with bounce
      if (swatchesRef.current) {
        const swatches = swatchesRef.current.children;
        gsap.from(swatches, {
          scrollTrigger: {
            trigger: swatchesRef.current,
            start: "top 90%",
            once: true,
          },
          scale: 0.4,
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.8)",
          clearProps: "transform,opacity",
        });
      }

      // 3. Guest notes cards slide up
      if (notesRef.current) {
        const notes = notesRef.current.children;
        gsap.from(notes, {
          scrollTrigger: {
            trigger: notesRef.current,
            start: "top 90%",
            once: true,
          },
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="dress-code-section" className="py-16 px-4 text-center">
      <div className="max-w-[460px] mx-auto space-y-8">
        {/* Dress Code Palette Card */}
        <div
          ref={cardRef}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-lg border border-[#dfbaba]/50"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[#812927]">
            <Palette className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.3em] font-bold">
              {weddingData.dressCode.title}
            </span>
          </div>
          <h3 className="text-3xl font-script text-[#812927] mt-1 mb-3">
            Wedding Dress Code
          </h3>
          <p className="text-xs text-[#666] leading-relaxed font-sans font-light mb-6">
            {weddingData.dressCode.description}
          </p>

          {/* Color Swatches Grid */}
          <div
            ref={swatchesRef}
            className="grid grid-cols-4 gap-3 sm:gap-4 mb-6"
          >
            {weddingData.dressCode.colors.map((color, index) => (
              <div
                key={index}
                className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-108"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:shadow-xl"
                  style={{
                    backgroundColor: color.hex,
                    border: color.hex === "#ffffff" ? "2px solid #dfbaba" : "2px solid rgba(255,255,255,0.9)",
                    boxShadow:
                      color.hex === "#ffffff"
                        ? "0 4px 14px rgba(0,0,0,0.1)"
                        : `0 8px 20px -4px ${color.hex}60`,
                  }}
                >
                  <Sparkles
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: color.textColor }}
                  />
                </div>
                <span className="text-xs font-serif-luxury font-bold text-[#812927] mt-2">
                  {color.name}
                </span>
                <span className="text-[10px] text-[#888] font-sans">
                  {color.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Gentle reminder banner */}
          <div className="p-3 bg-[#fdf5f3] rounded-2xl border border-[#dfbaba]/40 text-[11px] text-[#7a4c4a] leading-relaxed font-light">
            ✨ {weddingData.dressCode.notes}
          </div>
        </div>

        {/* Guest Notes Cards */}
        <div ref={notesRef} className="space-y-3">
          <div className="flex items-center justify-center gap-1.5 mb-2 text-[#812927]">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold">
              Lưu Ý Dành Cho Khách Mời
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {weddingData.guestNotes.map((note, idx) => {
              return (
                <div
                  key={idx}
                  className="bg-white/85 backdrop-blur-xs p-4 rounded-2xl border border-[#dfbaba]/40 shadow-xs text-left transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f8edea] text-[#812927] flex items-center justify-center mb-2.5">
                    {note.icon === "car" && <Car className="w-4 h-4" />}
                    {note.icon === "camera" && <Camera className="w-4 h-4" />}
                    {note.icon === "heart" && <Heart className="w-4 h-4" />}
                  </div>
                  <h4 className="text-xs font-serif-luxury font-bold text-[#812927] mb-1">
                    {note.title}
                  </h4>
                  <p className="text-[11px] text-[#666] leading-relaxed font-light">
                    {note.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
