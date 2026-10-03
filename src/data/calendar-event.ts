import { weddingData } from "./wedding-data";

/**
 * Cấu hình thông tin sự kiện lịch cưới duy nhất (Single Source of Truth)
 * Dễ dàng chỉnh sửa thông tin ngày giờ, địa điểm, mô tả và nhắc nhở
 */
export interface WeddingCalendarEventConfig {
  /** Tiêu đề sự kiện hiển thị trên lịch */
  title: string;
  /** Tên cặp đôi */
  coupleNames: string;
  /** Tên cô dâu và chú rể */
  brideName: string;
  groomName: string;
  /** Thời gian bắt đầu (ISO 8601 có múi giờ, ví dụ UTC+7) */
  startDate: string;
  /** Thời gian kết thúc (ISO 8601 có múi giờ) */
  endDate: string;
  /** Tên địa điểm tổ chức */
  venueName: string;
  /** Địa chỉ chi tiết */
  venueAddress: string;
  /** Vị trí đầy đủ trên lịch */
  location: string;
  /** Mô tả chi tiết khi mở sự kiện */
  description: string;
  /** Thời gian nhắc nhở trước sự kiện (phút) - 1440 phút = 1 ngày */
  reminderMinutes: number;
  /** Tên file .ics tải về máy */
  fileName: string;
}

export const weddingCalendarEvent: WeddingCalendarEventConfig = {
  coupleNames: `${weddingData.bride.shortName} & ${weddingData.groom.shortName}`,
  title: `Lễ Vu Quy: ${weddingData.bride.shortName} & ${weddingData.groom.shortName}`,
  brideName: weddingData.bride.fullName,
  groomName: weddingData.groom.fullName,
  startDate: weddingData.event.dateISO, // "2026-12-15T10:30:00+07:00"
  endDate: "2026-12-15T13:30:00+07:00", // Tiệc mừng khoảng 3 tiếng
  venueName: weddingData.event.venueName,
  venueAddress: weddingData.event.venueAddress,
  location: `${weddingData.event.venueName}, ${weddingData.event.venueAddress}`,
  description:
    `Trân trọng kính mời quý khách tham dự Tiệc mừng Lễ Vu Quy của ${weddingData.bride.shortName} & ${weddingData.groom.shortName}.\n\n` +
    `• Thời gian: ${weddingData.event.time} ${weddingData.event.dayOfWeek}, ${weddingData.event.dateDisplay}\n` +
    `• Địa điểm: ${weddingData.event.venueName}\n` +
    `• Địa chỉ: ${weddingData.event.venueAddress}\n\n` +
    `Sự hiện diện của quý khách là niềm vinh dự to lớn cho gia đình chúng tôi!`,
  reminderMinutes: 1440, // Nhắc nhở trước 1 ngày
  fileName: "Dam-Cuoi-Huy-Tram-15-12-2026.ics",
};

/**
 * Chuyển đổi định dạng ISO string sang định dạng UTC dùng cho Google Calendar và file .ics
 * Ví dụ: 2026-12-15T10:30:00+07:00 -> 20261215T033000Z
 */
export const formatToUTC = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
};

/**
 * Tạo đường dẫn mở trực tiếp Google Calendar với các thông tin đã điền sẵn
 */
export const generateGoogleCalendarUrl = (
  config: WeddingCalendarEventConfig = weddingCalendarEvent
): string => {
  const startUTC = formatToUTC(config.startDate);
  const endUTC = formatToUTC(config.endDate);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: config.title,
    dates: `${startUTC}/${endUTC}`,
    details: config.description,
    location: config.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Tạo nội dung chuẩn file iCalendar (.ics) RFC 5545
 * Hỗ trợ nhắc nhở trước 1 ngày (VALARM TRIGGER:-P1D)
 */
export const generateICSContent = (
  config: WeddingCalendarEventConfig = weddingCalendarEvent
): string => {
  const startUTC = formatToUTC(config.startDate);
  const endUTC = formatToUTC(config.endDate);
  const nowUTC = formatToUTC(new Date().toISOString());
  const uid = `wedding-huy-tram-20261215-${Date.now()}@cinelove.vn`;

  // Escape các ký tự đặc biệt theo chuẩn RFC 5545
  const cleanDescription = config.description
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

  const cleanSummary = config.title
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

  const cleanLocation = config.location
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cinelove Wedding//Huy and Tram Wedding//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowUTC}`,
    `DTSTART:${startUTC}`,
    `DTEND:${endUTC}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:Nhắc nhở: Ngày mai là ${cleanSummary}!`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

/**
 * Nhận diện loại thiết bị / hệ điều hành của người dùng
 */
export type DeviceType = "ios" | "android" | "mac" | "windows" | "other";

export const detectDevice = (): DeviceType => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "other";
  }

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera || "";

  // iOS detection (iPhone, iPad, iPod) - hỗ trợ cả iPadOS trên Safari (báo là Macintosh nhưng có cảm ứng)
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";
  if (/android/i.test(userAgent)) return "android";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "mac";
  if (/Windows/i.test(userAgent)) return "windows";

  return "other";
};

/**
 * Tự động thêm sự kiện vào lịch theo thiết bị người dùng (1 chạm):
 * - iPhone / iPad (iOS): Điều hướng đến /api/calendar với Content-Type text/calendar để Safari mở trực tiếp giao diện "Thêm vào Lịch" của Apple.
 * - Android: Tải file .ics chuẩn để Android mở trực tiếp vào ứng dụng Lịch hệ thống (Google Calendar / Samsung Calendar).
 * - Mac / Windows / Desktop: Tải file .ics chuẩn để mở bằng Apple Calendar hoặc Outlook.
 */
export const addToCalendarByDevice = (
  config: WeddingCalendarEventConfig = weddingCalendarEvent
): { device: DeviceType; success: boolean } => {
  if (typeof window === "undefined") {
    return { device: "other", success: false };
  }

  const device = detectDevice();

  // Tải file .ics chuẩn trực tiếp trên trình duyệt (100% Client-side, không cần backend)
  // - Trên iOS: Safari nhận diện file .ics và mở ứng dụng Apple Calendar
  // - Trên Android: Trình duyệt tải file .ics để lưu vào Google/Samsung Calendar
  // - Trên Desktop: Mở bằng Outlook hoặc Apple Calendar
  downloadICSFile(config);
  return { device, success: true };
};

/**
 * Kích hoạt tải file .ics xuống thiết bị (hỗ trợ Apple Calendar, Outlook, Android, Desktop)
 */
export const downloadICSFile = (
  config: WeddingCalendarEventConfig = weddingCalendarEvent
) => {
  if (typeof window === "undefined") return;

  const icsContent = generateICSContent(config);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", config.fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

