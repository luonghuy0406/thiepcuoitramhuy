"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarHeart,
  CalendarPlus,
  Download,
  Apple,
  X,
  Bell,
  Check,
  MapPin,
  Clock,
} from "lucide-react";
import {
  weddingCalendarEvent,
  generateGoogleCalendarUrl,
  downloadICSFile,
} from "@/data/calendar-event";

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToCalendarModal({
  isOpen,
  onClose,
}: AddToCalendarModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Khóa scroll trang khi mở popup/bottom sheet
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setDownloadSuccess(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Đóng bằng phím ESC
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

  // Xử lý lưu vào Apple Calendar
  const handleAppleCalendar = () => {
    downloadICSFile(weddingCalendarEvent);
    setDownloadSuccess("apple");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Xử lý lưu vào Google Calendar
  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(weddingCalendarEvent);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Xử lý tải file .ics chuẩn
  const handleDownloadICS = () => {
    downloadICSFile(weddingCalendarEvent);
    setDownloadSuccess("ics");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="w-full sm:max-w-[420px] bg-[#fffdfb] rounded-t-[28px] sm:rounded-3xl p-5 pt-4 pb-6 sm:p-6 shadow-2xl border border-[#dfbaba]/70 relative text-left transition-all animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-250">
        {/* Mobile Pull Handle Indicator */}
        <div className="w-10 h-1 bg-[#b16964]/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Nút đóng góc phải */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#888] hover:text-[#b16964] hover:bg-[#f9f1ef] transition-colors cursor-pointer"
          aria-label="Đóng popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Tiêu đề trang nhã */}
        <div className="text-center mb-4 pr-6 sm:pr-0">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[#b16964]">
            <span className="h-[1px] w-6 bg-[#b16964]/30" />
            <span className="font-cinzel text-[10px] font-bold uppercase tracking-[0.22em]">
              Save The Date
            </span>
            <span className="h-[1px] w-6 bg-[#b16964]/30" />
          </div>

          <h3 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#7a1c1a] tracking-wide">
            Lưu Ngày Cưới Vào Lịch
          </h3>

          <p className="font-serif-luxury italic text-xs text-[#b16964]/80 mt-0.5">
            {weddingCalendarEvent.coupleNames} · 15.12.2026
          </p>
        </div>

        {/* Event Quick Info Card */}
        <div className="bg-[#fbf6f4] rounded-2xl p-3 sm:p-3.5 mb-4 border border-[#dfbaba]/40 text-xs text-[#4a3f3f] space-y-1.5">
          <div className="flex items-center gap-2 text-[#7a1c1a] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#b16964] flex-shrink-0" />
            <span>10:30 Thứ Ba · Ngày 15 Tháng 12, 2026</span>
          </div>
          <div className="flex items-start gap-2 text-[#5a4c4c]">
            <MapPin className="w-3.5 h-3.5 text-[#b16964] flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{weddingCalendarEvent.location}</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-[#b16964]/15 text-[11px] text-[#8e4a47]">
            <Bell className="w-3 h-3 text-[#b16964] flex-shrink-0" />
            <span>Tự động đặt nhắc nhở trước 1 ngày (14.12.2026)</span>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {/* 1. Apple Calendar */}
          <button
            type="button"
            onClick={handleAppleCalendar}
            className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white border border-[#dfbaba]/60 hover:border-[#b16964] hover:bg-[#fff9f8] transition-all group shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5ebe8] flex items-center justify-center text-[#2a2222] group-hover:scale-105 transition-transform flex-shrink-0">
                <Apple className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#2c2222] group-hover:text-[#7a1c1a] transition-colors">
                  Apple Calendar
                </div>
                <div className="text-[11px] text-[#7a6b6b]">
                  Dành cho iPhone, iPad &amp; Mac
                </div>
              </div>
            </div>

            {downloadSuccess === "apple" ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                <Check className="w-3 h-3" />
                Đã tải file
              </span>
            ) : (
              <span className="text-[10px] font-cinzel font-semibold tracking-wider text-[#b16964] uppercase bg-[#fbf4f2] px-2 py-1 rounded-md border border-[#dfbaba]/40">
                Mở Lịch
              </span>
            )}
          </button>

          {/* 2. Google Calendar */}
          <button
            type="button"
            onClick={handleGoogleCalendar}
            className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white border border-[#dfbaba]/60 hover:border-[#b16964] hover:bg-[#fff9f8] transition-all group shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5ebe8] flex items-center justify-center text-[#7a1c1a] group-hover:scale-105 transition-transform flex-shrink-0">
                <CalendarPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#2c2222] group-hover:text-[#7a1c1a] transition-colors">
                  Google Calendar
                </div>
                <div className="text-[11px] text-[#7a6b6b]">
                  Mở trực tiếp trên web / app Google
                </div>
              </div>
            </div>

            <span className="text-[10px] font-cinzel font-semibold tracking-wider text-[#b16964] uppercase bg-[#fbf4f2] px-2 py-1 rounded-md border border-[#dfbaba]/40">
              Mở Link
            </span>
          </button>

          {/* 3. Tải file .ics */}
          <button
            type="button"
            onClick={handleDownloadICS}
            className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-white border border-[#dfbaba]/60 hover:border-[#b16964] hover:bg-[#fff9f8] transition-all group shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f5ebe8] flex items-center justify-center text-[#7a1c1a] group-hover:scale-105 transition-transform flex-shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#2c2222] group-hover:text-[#7a1c1a] transition-colors">
                  Tải File Lịch (.ics)
                </div>
                <div className="text-[11px] text-[#7a6b6b]">
                  Tương thích Outlook, Android &amp; Desktop
                </div>
              </div>
            </div>

            {downloadSuccess === "ics" ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                <Check className="w-3 h-3" />
                Đã tải về
              </span>
            ) : (
              <span className="text-[10px] font-cinzel font-semibold tracking-wider text-[#b16964] uppercase bg-[#fbf4f2] px-2 py-1 rounded-md border border-[#dfbaba]/40">
                Tải Về
              </span>
            )}
          </button>
        </div>

        {/* Footer info note */}
        <p className="text-[11px] font-sans text-center text-[#8e7b7b] mt-3.5">
          Chọn ứng dụng lịch yêu thích để không bỏ lỡ ngày vui của chúng mình nhé!
        </p>
      </div>
    </div>
  );
}
