"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Heart, Maximize2, Minimize2 } from "lucide-react";

interface FloatingToolbarProps {
  isAutoScrolling?: boolean;
  onToggleAutoScroll?: () => void;
}

export default function FloatingToolbar({
  isAutoScrolling,
  onToggleAutoScroll,
}: FloatingToolbarProps) {
  const [likes, setLikes] = useState(1024);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const heartsPoolRef = useRef<HTMLDivElement>(null);
  const pendingLikesRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Lắng nghe trạng thái Toàn màn hình
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (typeof document === "undefined") return;
      const isDocFullscreen = Boolean(
        document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
      );
      setIsFullscreen(isDocFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Bật/tắt chế độ toàn màn hình
  const toggleFullScreen = () => {
    if (typeof document === "undefined") return;

    const doc = document as any;
    const docEl = document.documentElement as any;

    try {
      if (
        !doc.fullscreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.msFullscreenElement
      ) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    } catch {
      // Ignored
    }
  };

  // Load initial likes count from Google Sheet via /api/likes
  useEffect(() => {
    fetch("/api/likes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.likes === "number" && data.likes >= 1024) {
          setLikes(data.likes);
        }
      })
      .catch((err) => console.warn("Lỗi tải lượt thả tim:", err));
  }, []);

  // Sync batched likes to server
  const syncLikesToServer = useCallback((count: number) => {
    fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.likes === "number") {
          setLikes((prev) => Math.max(prev, data.likes));
        }
      })
      .catch((err) => console.warn("Lỗi đồng bộ thả tim:", err));
  }, []);

  const handleLike = (e: React.MouseEvent) => {
    // 1. Instant local increment & optimistic feedback
    setLikes((prev) => prev + 1);
    pendingLikesRef.current += 1;

    // 2. Spawn floating heart particle
    if (heartsPoolRef.current) {
      const heart = document.createElement("div");
      heart.className =
        "absolute pointer-events-none text-[#e63946] drop-shadow-sm flex items-center justify-center";
      heart.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

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
    }

    // 3. Debounced batch sync to Google Sheet (sync 800ms after last tap)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      const countToSend = pendingLikesRef.current;
      pendingLikesRef.current = 0;
      if (countToSend > 0) {
        syncLikesToServer(countToSend);
      }
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center gap-2.5">
      {/* Container for GSAP Floating Heart Particles */}
      <div
        ref={heartsPoolRef}
        className="absolute bottom-12 right-2 pointer-events-none overflow-visible w-8 h-8"
      />

      

      {/* Nút bật/tắt toàn màn hình */}
      <button
        type="button"
        onClick={toggleFullScreen}
        title={isFullscreen ? "Thu nhỏ màn hình" : "Xem toàn màn hình (Ẩn thanh URL)"}
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-[#7a1c1a] border border-[#dfbaba]/70 shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-[#fff9f8] cursor-pointer"
        aria-label="Chuyển chế độ toàn màn hình"
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 text-[#7a1c1a]" />
        ) : (
          <Maximize2 className="w-4 h-4 text-[#7a1c1a]" />
        )}
      </button>

      {/* Heart Reaction with Badge */}
      <button
        onClick={handleLike}
        title="Thả tim chúc phúc"
        className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff6b8b] to-[#ff4d6d] hover:from-[#ff597b] hover:to-[#e63956] text-white shadow-lg shadow-[#ff4d6d]/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer"
      >
        <Heart className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />

        {/* Counter Pill */}
        <span className="absolute -top-1.5 -left-1.5 bg-[#b16964] text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full shadow-sm scale-90">
          {likes}
        </span>
      </button>
    </div>
  );
}
