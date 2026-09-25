"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { Heart, MessageSquareHeart, ChevronUp, Play, Pause } from "lucide-react";

interface FloatingToolbarProps {
  isAutoScrolling?: boolean;
  onToggleAutoScroll?: () => void;
}

export default function FloatingToolbar({
  isAutoScrolling,
  onToggleAutoScroll,
}: FloatingToolbarProps) {
  const [likes, setLikes] = useState(1024);
  const heartsPoolRef = useRef<HTMLDivElement>(null);

  const handleLike = (e: React.MouseEvent) => {
    setLikes((prev) => prev + 1);

    if (!heartsPoolRef.current) return;

    // Create a floating heart element
    const heart = document.createElement("div");
    heart.className =
      "absolute pointer-events-none text-[#ff4d6d] flex items-center justify-center";
    heart.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

    const randomX = (Math.random() - 0.5) * 60;
    const randomScale = 0.8 + Math.random() * 0.6;
    const randomRotate = (Math.random() - 0.5) * 45;

    heartsPoolRef.current.appendChild(heart);

    gsap.fromTo(
      heart,
      {
        x: 0,
        y: 0,
        scale: 0.3,
        opacity: 1,
        rotation: 0,
      },
      {
        x: randomX,
        y: -180 - Math.random() * 80,
        scale: randomScale,
        rotation: randomRotate,
        opacity: 0,
        duration: 1.8,
        ease: "power2.out",
        onComplete: () => {
          heart.remove();
        },
      }
    );
  };

  const scrollToRsvp = () => {
    const el = document.getElementById("rsvp-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-3">
      {/* Container for GSAP Floating Heart Particles */}
      <div
        ref={heartsPoolRef}
        className="absolute bottom-12 right-2 pointer-events-none overflow-visible w-8 h-8"
      />

      {/* Cinematic Auto-Scroll Toggle */}
      {onToggleAutoScroll && (
        <button
          onClick={onToggleAutoScroll}
          title={
            isAutoScrolling
              ? "Tạm dừng cuộn tự động"
              : "Bật cuộn tự động (Cinematic)"
          }
          className={`w-9 h-9 rounded-full border shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 ${
            isAutoScrolling
              ? "bg-[#812927] text-white border-[#812927] shadow-[#812927]/30"
              : "bg-white/90 hover:bg-white text-[#812927] border-[#dfbaba]/60"
          }`}
        >
          {isAutoScrolling ? (
            <Pause className="w-4 h-4 animate-pulse" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
      )}

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        title="Lên đầu trang"
        className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#812927] border border-[#dfbaba]/60 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Wish shortcut */}
      <button
        onClick={scrollToRsvp}
        title="Gửi lời chúc"
        className="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#812927] border border-[#dfbaba]/60 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        <MessageSquareHeart className="w-4 h-4" />
      </button>

      {/* Heart Reaction with Badge */}
      <button
        onClick={handleLike}
        title="Thả tim chúc phúc"
        className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff6b8b] to-[#ff4d6d] hover:from-[#ff597b] hover:to-[#e63956] text-white shadow-lg shadow-[#ff4d6d]/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer"
      >
        <Heart className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />

        {/* Counter Pill */}
        <span className="absolute -top-1.5 -left-1.5 bg-[#812927] text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm scale-90">
          {likes}
        </span>
      </button>
    </div>
  );
}
