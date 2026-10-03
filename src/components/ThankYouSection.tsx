"use client";

import React from "react";
import Image from "next/image";
import { weddingData } from "@/data/wedding-data";

export default function ThankYouSection() {
  return (
    <section id="thank-you-section" className="relative w-full overflow-hidden text-center select-none pt-8 pb-2">
      <div className="relative w-full max-w-[440px] mx-auto px-4 flex flex-col items-center">
        {/* Silk Heart Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-8 h-8 relative animate-pulse">
            <Image
              src="/assets/hoatiet/tim.png"
              alt="Heart"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Heading */}
        <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.25em] text-[#b16964] uppercase">
          Cảm Ơn
        </h3>

        {/* Divider flourish */}
        <div className="w-16 h-[1px] bg-[#b16964]/30 mx-auto my-3" />

        {/* Message */}
        <p className="font-sans text-xs sm:text-[13px] text-[#4a3b3b] leading-relaxed max-w-xs mx-auto font-normal px-2">
          Vì đã cùng chúng mình tạo nên khoảnh khắc đặc biệt và trọn vẹn nhất trong cuộc đời. Sự hiện diện và lời chúc phúc của bạn là món quà vô giá đối với hai gia đình.
        </p>

        {/* Couple Cursive Signature */}
        <div className="pt-4 sm:pt-6 pb-2">
          <p className="font-serif-luxury italic text-[11px] text-[#b16964]/70 mb-1">
            With Love,
          </p>
          <div className="font-calligraphy text-3xl sm:text-4xl text-[#b16964] drop-shadow-2xs">
            {weddingData.bride.shortName} &amp; {weddingData.groom.shortName}
          </div>
        </div>
      </div>
    </section>
  );
}
