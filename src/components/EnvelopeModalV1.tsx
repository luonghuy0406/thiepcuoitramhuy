"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { Heart } from "lucide-react";

interface EnvelopeModalProps {
  onStart?: () => void;
  onReveal?: () => void;
  onOpened: () => void;
}

export default function EnvelopeModalV1({ onStart, onReveal, onOpened }: EnvelopeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [showcaseActive, setShowcaseActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const heartsContainerRef = useRef<HTMLDivElement>(null);
  const textHintRef = useRef<HTMLDivElement>(null);
  const showcaseHintRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isSkippedRef = useRef(false);

  const triggerFadeOut = () => {
    if (isSkippedRef.current) return;
    isSkippedRef.current = true;
    onReveal?.();

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.85,
        ease: "power2.inOut",
        onComplete: () => {
          setIsRemoved(true);
          onOpened();
        },
      });
    } else {
      setIsRemoved(true);
      onOpened();
    }
  };

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    onStart?.();

    const tl = gsap.timeline();
    tlRef.current = tl;

    // 1. Hide text hint smoothly
    if (textHintRef.current) {
      tl.to(
        textHintRef.current,
        { opacity: 0, y: -15, duration: 0.35, ease: "power2.out" },
        0
      );
    }

    // 2. Break wax seal with pop & fade
    if (sealRef.current) {
      tl.to(
        sealRef.current,
        {
          scale: 1.35,
          opacity: 0,
          duration: 0.38,
          ease: "back.in(2)",
        },
        0.08
      );
    }

    // 3. Flip open the envelope flap (180deg upwards)
    if (flapRef.current) {
      tl.to(
        flapRef.current,
        {
          rotateX: 180,
          duration: 0.85,
          ease: "power2.inOut",
        },
        0.2
      );
      // Drop flap z-index once it is upright
      tl.set(flapRef.current, { zIndex: 1 }, 0.65);
    }

    // 4. Emerging Wedding Photo Card
    if (letterRef.current) {
      // Phase 4a: Slide straight up out of the envelope pocket
      tl.to(
        letterRef.current,
        {
          y: -150,
          duration: 0.95,
          ease: "power2.out",
        },
        0.6
      );

      // Phase 4b: Elevate zIndex in front of pocket & flap once cleared
      tl.set(letterRef.current, { zIndex: 40 }, 1.15);

      // Phase 4c: Move into prominent showcase position & scale up
      tl.to(
        letterRef.current,
        {
          y: -125,
          scale: 1.15,
          boxShadow:
            "0 25px 60px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(228, 150, 150, 0.35)",
          duration: 0.85,
          ease: "back.out(1.2)",
          onComplete: () => {
            setShowcaseActive(true);
          },
        },
        1.15
      );

      // Phase 4d: Gentle romantic floating breathing effect during showcase (1.5s)
      tl.to(
        letterRef.current,
        {
          y: -131,
          duration: 0.75,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        2.0
      );
    }

    // 5. Burst of romantic floating hearts
    if (heartsContainerRef.current) {
      const hearts = heartsContainerRef.current.children;
      tl.to(
        hearts,
        {
          opacity: 1,
          y: (i) => -350 - Math.random() * 220,
          x: (i) => (i % 2 === 0 ? -90 : 90) * Math.random(),
          scale: (i) => 1.1 + Math.random() * 0.6,
          rotation: (i) => (Math.random() - 0.5) * 80,
          duration: 1.8,
          stagger: 0.08,
          ease: "power1.out",
        },
        0.5
      );

      tl.to(
        hearts,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power1.in",
        },
        2.0
      );
    }

    // 6. After showcase, transition into main invitation
    tl.add(() => {
      triggerFadeOut();
    }, 3.5);
  };

  const handleShowcaseTap = () => {
    // Allows instant skip if user taps during showcase
    if (showcaseActive && !isSkippedRef.current) {
      tlRef.current?.kill();
      triggerFadeOut();
    }
  };

  if (isRemoved) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#161010]/85 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-opacity select-none"
    >
      {/* Decorative top title */}
      <div className="text-center mb-6 max-w-sm px-2">
        <div className="flex items-center justify-center gap-3 mb-1.5">
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-[#f3cb7c] to-[#e4ad57]" />
          <p className="text-xs uppercase tracking-[0.35em] font-cinzel font-semibold text-[#f5d082] drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            Lễ Vu Quy
          </p>
          <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent via-[#f3cb7c] to-[#e4ad57]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-luxury font-medium tracking-wide text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] mt-1 flex items-center justify-center gap-2">
          <span className="bg-gradient-to-r from-[#ffffff] via-[#fff3db] to-[#fde5bd] bg-clip-text text-transparent">
            Ngọc Trâm
          </span>
          <span className="text-[#f5d082] font-script text-2xl sm:text-3xl font-normal drop-shadow">
            &amp;
          </span>
          <span className="bg-gradient-to-r from-[#fde5bd] via-[#fff3db] to-[#ffffff] bg-clip-text text-transparent">
            Lương Huy
          </span>
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1.5 opacity-90">
          <span className="text-[11px] sm:text-xs font-cormorant tracking-[0.25em] text-[#f7e7ce] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            15 . 12 . 2026
          </span>
        </div>
      </div>

      {/* 3D Envelope & Photo Card Container */}
      <div
        onClick={isOpen ? handleShowcaseTap : handleOpen}
        className="relative w-[340px] sm:w-[380px] h-[230px] sm:h-[250px] cursor-pointer group perspective-1000"
      >
        {/* Envelope Floating Shadow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-black/50 rounded-full blur-md animate-shadow-scale pointer-events-none" />

        {/* Envelope Body */}
        <div className="relative w-full h-full bg-[#752422] rounded-2xl shadow-2xl overflow-visible transition-transform duration-300">
          {/* Top Flap (Flips open upwards from top edge) */}
          <div
            ref={flapRef}
            className="absolute top-0 inset-x-0 h-[135px] sm:h-[145px] z-[25] origin-top transform-style-3d pointer-events-none rounded-t-2xl overflow-visible"
            style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
          >
            {/* SVG Flap Triangle pointing down with rounded top corners */}
            <svg
              viewBox="0 0 380 145"
              preserveAspectRatio="none"
              className="w-full h-full block drop-shadow-md rounded-t-2xl"
            >
              <defs>
                <clipPath id="flap-top-clip">
                  <rect x="0" y="0" width="380" height="145" rx="16" ry="16" />
                </clipPath>
              </defs>
              <polygon
                points="0,0 380,0 190,145"
                fill="#812927"
                clipPath="url(#flap-top-clip)"
              />
            </svg>

            {/* Realistic Wax Seal Image from public/assets/envelope-wax-seal.png */}
            <div
              ref={sealRef}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] z-[30] pointer-events-auto filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-108 active:scale-95 cursor-pointer"
            >
              <Image
                src="/assets/envelope-wax-seal.png"
                alt="Wax Seal T & H"
                fill
                sizes="(max-width: 640px) 76px, 88px"
                className="object-contain select-none pointer-events-none drop-shadow-md"
                priority
              />
            </div>
          </div>

          {/* Emerging Wedding Photo Card */}
          <div
            ref={letterRef}
            className="absolute inset-x-3 sm:inset-x-4 top-2 h-[220px] sm:h-[240px] bg-[#fffcf9] rounded-2xl shadow-xl p-2.5 sm:p-3 flex flex-col justify-between z-[5] border border-[#e49696]/40 overflow-hidden transform-gpu"
            style={{ transformOrigin: "center bottom" }}
          >
            {/* Photo Framed Area */}
            <div className="relative w-full h-[148px] sm:h-[165px] rounded-xl overflow-hidden shadow-inner bg-[#f5e6e6]">
              <Image
                src="/assets/envelope-card-photo.jpg"
                alt="Ngọc Trâm & Lương Huy"
                fill
                sizes="(max-width: 640px) 340px, 380px"
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] drop-shadow pointer-events-none">
                <span className="tracking-[0.2em] uppercase font-serif-luxury text-[9px] sm:text-[10px] text-yellow-100">
                  Save Our Date
                </span>
                <span className="font-serif-luxury text-[10px] sm:text-[11px] text-white/95">
                  15 . 12 . 2026
                </span>
              </div>
            </div>

            {/* Photo Card Typography Footer */}
            <div className="pt-1.5 pb-0.5 text-center flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-6 bg-[#dfbaba]" />
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#812927]/85 font-sans font-medium">
                  Trân Trọng Kính Mời
                </p>
                <span className="h-[1px] w-6 bg-[#dfbaba]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-script text-[#812927] mt-0.5 leading-tight">
                Ngọc Trâm &amp; Lương Huy
              </h3>
            </div>
          </div>

          {/* Envelope Pocket */}
          <div
            className="absolute inset-0 pointer-events-none z-[15] rounded-2xl overflow-hidden"
            style={{ borderRadius: "1rem" }}
          >
            <svg
              viewBox="0 0 380 250"
              preserveAspectRatio="none"
              className="w-full h-full block rounded-2xl overflow-hidden"
              style={{ borderRadius: "1rem" }}
            >
              <defs>
                <clipPath id="pocket-body-clip">
                  <rect x="0" y="0" width="380" height="250" rx="16" ry="16" />
                </clipPath>
                <linearGradient id="pocket-left-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7e2726" />
                  <stop offset="100%" stopColor="#6f201f" />
                </linearGradient>
                <linearGradient id="pocket-right-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7e2726" />
                  <stop offset="100%" stopColor="#6f201f" />
                </linearGradient>
                <linearGradient id="pocket-bottom-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#8d2e2c" />
                  <stop offset="100%" stopColor="#792523" />
                </linearGradient>
              </defs>
              <g clipPath="url(#pocket-body-clip)">
                <polygon points="0,0 0,250 190,145" fill="url(#pocket-left-grad)" />
                <polygon points="380,0 380,250 190,145" fill="url(#pocket-right-grad)" />
                <polygon points="0,250 380,250 190,135" fill="url(#pocket-bottom-grad)" />
                <path
                  d="M 0 0 L 190 145 L 380 0"
                  fill="none"
                  stroke="#963533"
                  strokeWidth="1.2"
                  strokeOpacity="0.45"
                />
                <path
                  d="M 0 250 L 190 135 L 380 250"
                  fill="none"
                  stroke="#a13d3a"
                  strokeWidth="1.2"
                  strokeOpacity="0.55"
                />
              </g>
            </svg>
          </div>

          {/* Hearts Particle Fountain */}
          <div
            ref={heartsContainerRef}
            className="absolute inset-0 pointer-events-none z-40 overflow-visible"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-[#ff4d6d]"
              >
                <Heart className="w-6 h-6 fill-current drop-shadow-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Prompt Button Before Click */}
      {!isOpen && (
        <div
          ref={textHintRef}
          onClick={handleOpen}
          className="mt-8 flex flex-col items-center cursor-pointer"
        >
          <span className="text-xs uppercase tracking-[0.25em] font-cinzel font-medium text-white/95 bg-[#812927]/90 hover:bg-[#812927] px-7 py-3 rounded-full border border-white/25 shadow-xl transition-all hover:scale-105 active:scale-95">
            Chạm để mở thiệp
          </span>
        </div>
      )}

      {/* Showcase Indicator During the Image Display */}
      {isOpen && (
        <div
          ref={showcaseHintRef}
          onClick={handleShowcaseTap}
          className="mt-8 flex flex-col items-center cursor-pointer transition-opacity duration-500"
        >
          <span className="text-[11px] font-serif-luxury tracking-widest text-white/80 bg-black/40 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20 shadow-lg">
            Chạm bất kỳ đâu để vào thiệp
          </span>
        </div>
      )}
    </div>
  );
}
