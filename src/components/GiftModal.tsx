"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Copy, Check, X } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSide?: "bride" | "groom";
}

export default function GiftModal({
  isOpen,
  onClose,
  defaultSide = "bride",
}: GiftModalProps) {
  const [activeSide, setActiveSide] = useState<"bride" | "groom">(defaultSide);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Sync defaultSide when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSide(defaultSide);
    }
  }, [isOpen, defaultSide]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (acc: string, type: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const isBride = activeSide === "bride";
  const person = isBride ? weddingData.bride : weddingData.groom;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="max-w-[360px] w-full bg-[#fffcfb] rounded-3xl p-6 shadow-2xl border border-[#dfbaba] relative text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#888] hover:text-[#812927] hover:bg-[#f9f1ef] transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Switch Tabs between Bride & Groom */}
        <div className="flex justify-center p-1 bg-[#f9f1ef] rounded-xl mb-4 border border-[#dfbaba]/40 mt-1">
          <button
            type="button"
            onClick={() => setActiveSide("bride")}
            className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              isBride
                ? "bg-[#812927] text-white shadow-2xs font-semibold"
                : "text-[#666] hover:text-[#812927]"
            }`}
          >
            Cô Dâu {weddingData.bride.shortName}
          </button>
          <button
            type="button"
            onClick={() => setActiveSide("groom")}
            className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              !isBride
                ? "bg-[#812927] text-white shadow-2xs font-semibold"
                : "text-[#666] hover:text-[#812927]"
            }`}
          >
            Chú Rể {weddingData.groom.shortName}
          </button>
        </div>

        {/* Title */}
        <div className="mt-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest text-[#812927] font-semibold">
            {isBride ? "Mừng Cưới Cô Dâu" : "Mừng Cưới Chú Rể"}
          </span>
          <h4 className="text-lg font-serif-luxury font-bold text-[#3b3232] mt-0.5">
            {person.shortName}
          </h4>
        </div>

        {/* QR Code Container */}
        <div className="relative w-52 sm:w-56 aspect-[540/660] mx-auto my-3 p-1.5 bg-white rounded-2xl shadow-xs">
          <Image
            src={person.qrCode}
            alt={`Mã QR ${person.shortName}`}
            fill
            className="object-contain rounded-xl"
            priority
          />
        </div>

        {/* Copy Account Number Button */}
        <button
          type="button"
          onClick={() => handleCopy(person.accountNumber, activeSide)}
          className="w-full bg-[#812927] hover:bg-[#6b2220] active:scale-[0.99] text-white text-xs font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer mb-2.5"
        >
          {copiedAccount === activeSide ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span className="font-semibold text-emerald-100">
                Đã sao chép: {person.accountNumber}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>
                Sao chép STK:{" "}
                <span className="font-mono font-semibold tracking-wider">
                  {person.accountNumber}
                </span>
              </span>
            </>
          )}
        </button>

        <p className="text-[10px] text-[#888] font-light leading-relaxed">
          Quét mã QR qua ứng dụng ngân hàng hoặc ví điện tử bất kỳ
        </p>
      </div>
    </div>
  );
}
