"use client";

import React from "react";
import Image from "next/image";

import { twMerge } from "tailwind-merge";

interface SectionDividerProps {
  variant?: 1 | 2;
  className?: string;
}

export default function SectionDivider({
  variant = 1,
  className = "",
}: SectionDividerProps) {
  // variant 1: hoathiet_ngan.png (1178x212)
  // variant 2: hoatiet_ngan1.png (1294x193)
  const isVariant1 = variant === 1;
  const src = isVariant1
    ? "/assets/hoatiet/hoathiet_ngan.png"
    : "/assets/hoatiet/hoatiet_ngan1.png";
  const aspectClass = isVariant1 ? "aspect-[1178/212]" : "aspect-[1294/193]";

  return (
    <div
      className={twMerge(
        "relative w-full max-w-[320px] sm:max-w-[380px] mx-auto my-2.5 sm:my-4 px-4 flex items-center justify-center pointer-events-none select-none",
        className
      )}
    >
      <div className={`w-full ${aspectClass} relative drop-shadow-xs`}>
        <Image
          src={src}
          alt="Section Divider"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
