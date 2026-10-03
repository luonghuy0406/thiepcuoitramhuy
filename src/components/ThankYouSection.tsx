"use client";

import React from "react";
import Image from "next/image";
import { weddingData } from "@/data/wedding-data";
import SectionDivider from "@/components/SectionDivider";

export default function ThankYouSection() {
  return (
    <section
      id="thank-you-section"
      className="min-h-[calc(100dvh-190px)] sm:min-h-[calc(100dvh-210px)] w-full flex flex-col justify-between items-center text-center px-4 pt-4 pb-0 snap-start relative z-10 select-none overflow-hidden"
    >
      {/* Top Section Divider */}
      <SectionDivider variant={1} className="my-1 sm:my-2" />

      <div className="relative w-full max-w-[440px] mx-auto px-4 flex flex-col items-center my-auto py-4">
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
          Lời cảm Ơn
        </h3>

        {/* Divider flourish */}
        <div className="w-16 h-[1px] bg-[#b16964]/30 mx-auto my-3" />

        {/* Message */}
        <p className="font-sans text-xs sm:text-[13px] text-[#4a3b3b] leading-relaxed max-w-xs mx-auto font-normal px-2">
          Ngày vui của chúng mình sẽ trọn vẹn hơn khi có gia đình và những người thân yêu cùng hiện diện.
          <br/>
          Cảm ơn gia đình và mọi người đã luôn yêu thương, đồng hành và dành cho chúng mình những lời chúc tốt đẹp. Sự hiện diện của mọi người trong ngày đặc biệt này sẽ là niềm vui và kỷ niệm quý giá đối với chúng mình.
          <br/>
          Hẹn gặp mọi người trong ngày vui của chúng mình nhé! 

        </p>

        {/* Couple Cursive Signature */}
        <div className="pt-4 sm:pt-5 pb-2">
          <p className="font-serif-luxury italic text-[11px] text-[#b16964]/70 mb-1">
            With Love,
          </p>
          <div className="font-calligraphy text-3xl sm:text-4xl text-[#b16964] drop-shadow-2xs">
            {weddingData.bride.shortName} &amp; {weddingData.groom.shortName}
          </div>
        </div>
      </div>

      {/* Empty bottom spacer to allow layout-end-flourish to meet section seamlessly */}
      <div className="h-2 flex-shrink-0" />
    </section>
  );
}
