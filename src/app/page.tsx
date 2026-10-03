"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import EnvelopeModal from "@/components/EnvelopeModal";
import PetalsCanvas from "@/components/PetalsCanvas";
import HeroSection from "@/components/HeroSection";
import FormalInvitationSection from "@/components/FormalInvitationSection";
import CountdownSection from "@/components/CountdownSection";
import GallerySection from "@/components/GallerySection";
import RsvpSection from "@/components/RsvpSection";
import ThankYouSection from "@/components/ThankYouSection";
import SectionDivider from "@/components/SectionDivider";
import FloatingToolbar from "@/components/FloatingToolbar";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [openingStarted, setOpeningStarted] = useState(false);
  const [musicTriggered, setMusicTriggered] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const autoScrollActiveRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Ensure page always starts at top on refresh, avoiding browser scroll cache issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Immediately reset scroll position to top
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      // Before unload / reload, reset scroll position so browser doesn't record non-zero scroll
      const handleBeforeUnload = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      };

      // PageShow handles both initial load and restore from BFCache (Back-Forward Cache)
      const handlePageShow = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("pageshow", handlePageShow);
      window.addEventListener("load", handlePageShow);

      // Micro-tick safeguard in case of asynchronous layout shifts during hydration
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 60);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("pageshow", handlePageShow);
        window.removeEventListener("load", handlePageShow);
        clearTimeout(timer);
      };
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("opened") === "1" || params.get("opened") === "true") {
        setEnvelopeOpened(true);
        setOpeningStarted(true);
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

  // Optimize mobile screen snap: enable gentle snap during manual browsing, disable during auto-scroll
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isAutoScrolling) {
        document.documentElement.style.scrollSnapType = "none";
      } else {
        document.documentElement.style.scrollSnapType = "y proximity";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.style.scrollSnapType = "";
      }
    };
  }, [isAutoScrolling]);

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
    const targetSpeed = 50; // 50 pixels per second (thư thái, nhẹ nhàng, dễ đọc)

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

  const requestFullScreen = () => {
    if (typeof document === "undefined") return;
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } catch {
      // Bỏ qua nếu chính sách bảo mật của trình duyệt chặn fullscreen
    }
  };

  const handleStartOpening = () => {
    setMusicTriggered(true);
    // Kích hoạt toàn màn hình khi người dùng chạm mở thiệp (hỗ trợ Android Chrome, Samsung Internet, Desktop)
    requestFullScreen();

    // Thiệp cưới bên trong dần phóng to vừa khít khung hình khi 2 cánh cửa mở ra
    const content = document.getElementById("wedding-content");
    if (content) {
      gsap.fromTo(
        content,
        { scale: 0.88, opacity: 0.65, transformOrigin: "top center" },
        {
          scale: 1,
          opacity: 1,
          duration: 2.3,
          delay: 0.35,
          ease: "power2.out",
        }
      );
    }
  };

  const handleReveal = () => {
    // Kích hoạt hiệu ứng xuất hiện chữ đúng thời điểm cánh cửa phong bì mở ra và bắt đầu mờ đi
    setOpeningStarted(true);
  };

  const handleOpened = () => {
    setEnvelopeOpened(true);
    setOpeningStarted(true);
    const content = document.getElementById("wedding-content");
    if (content) {
      gsap.set(content, { scale: 1, opacity: 1, clearProps: "transform" });
    }
    // Reset to top cleanly
    window.scrollTo({ top: 0, behavior: "instant" });

    // Begin slow cinematic auto-scroll after user enjoys the hero section (3.5s)
    setTimeout(() => {
      startAutoScroll();
    }, 3500);
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
    <main className="relative w-full pb-0">
      {/* Rose-Gold Scroll Progress Indicator at Top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-black/10 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#dfbaba] via-[#e49696] to-[#b16964] transition-all duration-100 ease-out shadow-xs"
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
          onStart={handleStartOpening}
          onReveal={handleReveal}
          onOpened={handleOpened}
        />
      )}

      {/* Main Wedding Invitation Sections - 1 Screen Per Section */}
      <div id="wedding-content" className="relative z-10 w-full">
        <HeroSection isOpeningTriggered={openingStarted || envelopeOpened} />
        <FormalInvitationSection />
        <CountdownSection />
        <SectionDivider variant={1} className="w-full my-4 sm:my-6 px-0" />
        <GallerySection />
        <RsvpSection />
        <ThankYouSection />
      </div>

      {/* Floating Action Bar (Bottom Right) */}
      <FloatingToolbar
        isAutoScrolling={isAutoScrolling}
        onToggleAutoScroll={toggleAutoScroll}
      />
    </main>
  );
}
