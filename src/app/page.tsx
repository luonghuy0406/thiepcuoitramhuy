"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import EnvelopeModal from "@/components/EnvelopeModal";
import PetalsCanvas from "@/components/PetalsCanvas";
import HeroSection from "@/components/HeroSection";
import InvitationSection from "@/components/InvitationSection";
import LoveStorySection from "@/components/LoveStorySection";
import CountdownSection from "@/components/CountdownSection";
import VenueSection from "@/components/VenueSection";
import ProgramSection from "@/components/ProgramSection";
import GallerySection from "@/components/GallerySection";
import RsvpSection from "@/components/RsvpSection";
import GiftBoxSection from "@/components/GiftBoxSection";
import FloatingToolbar from "@/components/FloatingToolbar";
import { Film } from "lucide-react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [musicTriggered, setMusicTriggered] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const autoScrollActiveRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("opened") === "1" || params.get("opened") === "true") {
        setEnvelopeOpened(true);
      }

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [envelopeOpened]);

  // Track scroll progress for subtle rose-gold reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stop auto-scroll and remove user interaction listeners
  const stopAutoScroll = useCallback(() => {
    if (!autoScrollActiveRef.current) return;
    autoScrollActiveRef.current = false;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setIsAutoScrolling(false);

    window.removeEventListener("wheel", stopAutoScroll);
    window.removeEventListener("touchmove", stopAutoScroll);
    window.removeEventListener("pointerdown", stopAutoScroll);
    window.removeEventListener("keydown", handleKeyCancel);
  }, []);

  const handleKeyCancel = useCallback(
    (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Space",
          "Home",
          "End",
        ].includes(e.code)
      ) {
        stopAutoScroll();
      }
    },
    [stopAutoScroll]
  );

  // Start slow cinematic auto-scroll from top to bottom
  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    autoScrollActiveRef.current = true;
    setIsAutoScrolling(true);

    // Register listeners: any manual scroll or interaction immediately cancels auto-scroll
    window.addEventListener("wheel", stopAutoScroll, { passive: true });
    window.addEventListener("touchmove", stopAutoScroll, { passive: true });
    window.addEventListener("pointerdown", stopAutoScroll, { passive: true });
    window.addEventListener("keydown", handleKeyCancel, { passive: true });

    let startTime: number | null = null;
    let lastTime: number | null = null;
    const targetSpeed = 70; // 70 pixels per second (smooth, graceful, readable pace)

    const step = (now: number) => {
      if (!autoScrollActiveRef.current) return;

      if (startTime === null) startTime = now;
      if (lastTime === null) lastTime = now;

      const elapsed = (now - startTime) / 1000;
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Smooth ease-in acceleration for the first 1.5 seconds
      const easeFactor = Math.min(elapsed / 1.5, 1);
      const currentSpeed = targetSpeed * easeFactor;
      const scrollStep = delta * currentSpeed;

      // Check if user has reached bottom of page
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 6) {
        stopAutoScroll();
        return;
      }

      window.scrollBy({ top: scrollStep, behavior: "instant" });
      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
  }, [stopAutoScroll, handleKeyCancel]);

  const toggleAutoScroll = () => {
    if (isAutoScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  const handleOpened = () => {
    setEnvelopeOpened(true);
    // Reset to top cleanly
    window.scrollTo({ top: 0, behavior: "instant" });

    // Begin slow cinematic auto-scroll after romantic pause (600ms)
    setTimeout(() => {
      startAutoScroll();
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("wheel", stopAutoScroll);
      window.removeEventListener("touchmove", stopAutoScroll);
      window.removeEventListener("pointerdown", stopAutoScroll);
      window.removeEventListener("keydown", handleKeyCancel);
    };
  }, [stopAutoScroll, handleKeyCancel]);

  return (
    <main className="relative min-h-screen pb-20">
      {/* Rose-Gold Scroll Progress Indicator at Top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-black/10 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#dfbaba] via-[#e49696] to-[#812927] transition-all duration-100 ease-out shadow-xs"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Gentle Floating Rose Petals in Background */}
      <PetalsCanvas />

      {/* Floating Audio Player (Top Right) */}
      <AudioPlayer autoPlayTrigger={musicTriggered || envelopeOpened} />

      {/* 3D Envelope Opening Screen */}
      {!envelopeOpened && (
        <EnvelopeModal
          onStart={() => setMusicTriggered(true)}
          onOpened={handleOpened}
        />
      )}

      {/* Main Wedding Invitation Sections - Rich Story Sequence */}
      <div id="wedding-content" className="relative z-10 space-y-6">
        <HeroSection />
        <InvitationSection />
        {/* <LoveStorySection /> */}
        {/* <CountdownSection /> */}
        {/* <VenueSection /> */}
        <ProgramSection />
        <GallerySection />
        <RsvpSection />
        <GiftBoxSection />
      </div>

      {/* Floating Auto-Scroll Status Pill */}
      {isAutoScrolling && (
        <div
          onClick={stopAutoScroll}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-black/80 hover:bg-black/95 backdrop-blur-md text-white/95 px-4 py-2 rounded-full border border-white/25 shadow-2xl flex items-center gap-2 text-xs font-serif-luxury cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Film className="w-3.5 h-3.5 text-yellow-200" />
          <span>Đang tự động cuộn thiệp • Chạm để dừng</span>
        </div>
      )}

      {/* Floating Action Bar (Bottom Right) */}
      <FloatingToolbar
        isAutoScrolling={isAutoScrolling}
        onToggleAutoScroll={toggleAutoScroll}
      />
    </main>
  );
}
