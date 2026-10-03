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
  Sparkles,
  Smartphone,
  Laptop,
} from "lucide-react";
import {
  weddingCalendarEvent,
  generateGoogleCalendarUrl,
  downloadICSFile,
  detectDevice,
  DeviceType,
} from "@/data/calendar-event";

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToCalendarModal({
  isOpen,
  onClose,
}: AddToCalendarModalProps) {
  const [device, setDevice] = useState<DeviceType>("other");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [showAllOptions, setShowAllOptions] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDevice(detectDevice());
    }
  }, []);

  // Khóa scroll trang khi mở popup/bottom sheet
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined") {
        setDevice(detectDevice());
      }
    } else {
      document.body.style.overflow = "";
      setActionFeedback(null);
      setShowAllOptions(false);
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

  // Xử lý tải lại / mở Apple Calendar
  const handleAppleCalendar = () => {
    downloadICSFile(weddingCalendarEvent);
    setActionFeedback("apple");
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Xử lý mở Google Calendar trực tiếp
  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(weddingCalendarEvent);
    window.open(url, "_blank", "noopener,noreferrer");
    setActionFeedback("google");
    setTimeout(() => setActionFeedback(null), 3000);
  };

  // Xử lý tải lại file .ics chuẩn
  const handleDownloadICS = () => {
    downloadICSFile(weddingCalendarEvent);
    setActionFeedback("ics");
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const isIPhone = device === "ios";
  const isAndroid = device === "android";
  const isMac = device === "mac";
  const isWindows = device === "windows";

  // Ẩn/hiển thị tùy chọn phù hợp theo từng thiết bị:
  // - Trên iPhone (iOS): Chỉ hiện Apple Calendar (ẩn Google & Android)
  // - Trên Android: Chỉ hiện Google Calendar & Lịch Android (ẩn Apple Calendar)
  // - Trên Mac: Hiện Apple Calendar & Google Calendar
  // - Trên Windows / Other: Hiện Google Calendar & Tải file .ics
  const showApple = showAllOptions || isIPhone || isMac;
  const showGoogle = showAllOptions || isAndroid || isMac || isWindows || device === "other";
  const showICS = showAllOptions || isAndroid || isWindows || device === "other";

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
        <div className="text-center mb-3 pr-6 sm:pr-0">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[#b16964]">
            <span className="h-[1px] w-6 bg-[#b16964]/30" />
            <span className="font-cinzel text-[10px] font-bold uppercase tracking-[0.22em]">
              Save The Date
            </span>
            <span className="h-[1px] w-6 bg-[#b16964]/30" />
          </div>

          <h3 className="font-serif-luxury font-bold text-lg sm:text-xl text-[#7a1c1a] tracking-wide">
            Đã Lưu Ngày Cưới Vào Lịch
          </h3>

          <p className="font-serif-luxury italic text-xs text-[#b16964]/80 mt-0.5">
            {weddingCalendarEvent.coupleNames} · 15.12.2026
          </p>
        </div>

        {/* Device Detection Status Pill */}
        <div className="bg-[#f7ece8] rounded-2xl p-3 mb-3 border border-[#b16964]/20 text-xs text-[#4a3f3f]">
          <div className="flex items-center gap-2 text-[#7a1c1a] font-bold mb-1">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {isIPhone && "Nhận diện iPhone · Lịch Apple"}
              {isMac && "Nhận diện Mac · Apple Calendar"}
              {isAndroid && "Nhận diện thiết bị Android"}
              {!isIPhone && !isMac && !isAndroid && "Đã tạo file lịch cưới .ics"}
            </span>
          </div>

          <p className="text-[11px] text-[#6b5858] leading-relaxed">
            {isIPhone &&
              "File lịch đã được gửi tới máy. Nếu màn hình Lịch Apple chưa tự mở, bạn có thể nhấn nút Lịch Apple bên dưới để mở lại nhé!"}
            {isMac &&
              "File lịch đã được tải xuống để mở trên Apple Calendar hoặc Google Calendar."}
            {isAndroid &&
              "File lịch .ics đã được tải xuống máy. Bạn hãy chạm vào thông báo tải về để thêm vào ứng dụng Lịch (hoặc bấm Google Calendar bên dưới)."}
            {!isIPhone &&
              !isMac &&
              !isAndroid &&
              "File .ics đã được tải về máy tính để mở bằng Outlook hoặc ứng dụng Lịch của bạn."}
          </p>
        </div>

        {/* Event Quick Info Card */}
        <div className="bg-[#fff9f8] rounded-2xl p-3 mb-3.5 border border-[#dfbaba]/40 text-xs text-[#4a3f3f] space-y-1.5">
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
            <span>Tự động đặt chuông nhắc trước 1 ngày (14.12.2026)</span>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {/* 1. Apple Calendar (Chỉ hiển thị cho iPhone / Mac) */}
          {showApple && (
            <button
              type="button"
              onClick={handleAppleCalendar}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer text-left bg-[#fff7f5] border-[#b16964] ring-1 ring-[#b16964]/20"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f5ebe8] flex items-center justify-center text-[#2a2222] flex-shrink-0">
                  <Apple className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#2c2222]">
                    {isIPhone ? "Apple Calendar (Lịch iPhone)" : "Apple Calendar"}
                  </div>
                  <div className="text-[10px] text-[#7a6b6b]">
                    {isIPhone ? "Chạm để mở và lưu vào Lịch iPhone" : "Dành cho macOS & iOS"}
                  </div>
                </div>
              </div>

              {actionFeedback === "apple" ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3" />
                  Đang mở
                </span>
              ) : (
                <span className="text-[10px] font-cinzel font-semibold tracking-wider text-[#b16964] uppercase bg-white px-2 py-0.5 rounded-md border border-[#dfbaba]/40">
                  {isIPhone ? "Mở lịch" : "Mở lại"}
                </span>
              )}
            </button>
          )}

          {/* 2. Google Calendar (Chỉ hiển thị cho Android, Desktop, Mac) */}
          {showGoogle && (
            <button
              type="button"
              onClick={handleGoogleCalendar}
              className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer text-left ${
                isAndroid
                  ? "bg-[#fff7f5] border-[#b16964] ring-1 ring-[#b16964]/20"
                  : "bg-white border-[#dfbaba]/60 hover:border-[#b16964]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f5ebe8] flex items-center justify-center text-[#7a1c1a] flex-shrink-0">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#2c2222]">
                    Google Calendar
                  </div>
                  <div className="text-[10px] text-[#7a6b6b]">
                    Mở app / đồng bộ tài khoản Google
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-cinzel font-semibold tracking-wider text-[#b16964] uppercase bg-white px-2 py-0.5 rounded-md border border-[#dfbaba]/40">
                Mở link
              </span>
            </button>
          )}

          {/* 3. Tải file .ics (Chỉ hiển thị cho Android, Windows, Desktop) */}
          {showICS && (
            <button
              type="button"
              onClick={handleDownloadICS}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white border border-[#dfbaba]/60 hover:border-[#b16964] transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f5ebe8] flex items-center justify-center text-[#7a1c1a] flex-shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif-luxury font-bold text-xs sm:text-[13px] text-[#2c2222]">
                    {isAndroid ? "Lịch hệ thống Android (.ics)" : "Tải file Lịch (.ics)"}
                  </div>
                  <div className="text-[10px] text-[#7a6b6b]">
                    {isAndroid ? "Lưu vào ứng dụng Lịch máy / Samsung" : "Dành cho Outlook & Desktop"}
                  </div>
                </div>
              </div>

              {actionFeedback === "ics" ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3" />
                  Đã tải
                </span>
              ) : (
                <span className="text-[10px] font-cinzel font-semibold tracking-wider text-[#b16964] uppercase bg-white px-2 py-0.5 rounded-md border border-[#dfbaba]/40">
                  Tải lại
                </span>
              )}
            </button>
          )}
        </div>

        {/* Nút xem thêm tùy chọn lịch khác nếu muốn */}
        {!showAllOptions && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowAllOptions(true)}
              className="text-[11px] text-[#b16964]/75 hover:text-[#7a1c1a] underline transition-colors cursor-pointer"
            >
              Tùy chọn lịch khác
            </button>
          </div>
        )}

        {/* Action Button: Xong */}
        <div className="mt-3.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#7a1c1a] hover:bg-[#621614] text-white text-xs font-serif-luxury font-bold tracking-[0.16em] uppercase py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
