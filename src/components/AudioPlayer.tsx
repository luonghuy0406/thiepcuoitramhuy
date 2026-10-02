"use client";

import React, { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function AudioPlayer({ autoPlayTrigger }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlayTrigger && !hasInteracted && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {
          // Browser prevented autoplay without prior gesture
        });
    }
  }, [autoPlayTrigger, hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch((e) => console.log("Audio play error:", e));
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 pointer-events-auto">
      <audio
        ref={audioRef}
        src="/audio/wedding-music.mp3"
        loop
        preload="auto"
      />

      <button
        onClick={togglePlay}
        title={isPlaying ? "Tạm dừng nhạc" : "Bật nhạc (Lễ Đường - Kai Đinh)"}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-white/60 backdrop-blur-md ${
          isPlaying
            ? "bg-[#e49696] text-white shadow-[#e49696]/40 scale-105"
            : "bg-white/80 text-[#812927] hover:bg-white"
        }`}
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center ${
            isPlaying ? "animate-spin-slow" : ""
          }`}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#812927]" />
          )}
        </div>
      </button>
    </div>
  );
}
