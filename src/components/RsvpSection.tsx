"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, HeartHandshake, Loader2 } from "lucide-react";

interface Wish {
  name: string;
  side: string;
  wishes: string;
  date: string;
  attending?: string;
}

export default function RsvpSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guestSide, setGuestSide] = useState("bride");
  const [guestCount, setGuestCount] = useState("1");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live wishes fetched from Google Sheet (No localStorage, No hardcoded dummy data)
  const [wishesList, setWishesList] = useState<Wish[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);

  // Fetch live wishes directly from Google Sheet via /api/rsvp
  const fetchWishes = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvp", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setWishesList(json.data);
      }
    } catch (err) {
      console.warn("Lỗi đồng bộ lời chúc từ Google Sheet:", err);
    } finally {
      setIsLoadingWishes(false);
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 90%",
          once: true,
        },
        y: 30,
        scale: 0.98,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });
    }, sectionRef);

    // Initial load from Google Sheet
    fetchWishes();

    return () => ctx.revert();
  }, [fetchWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#812927", "#e49696", "#dfbaba", "#ffd166"],
    });

    const newWish: Wish = {
      name: name.trim(),
      side:
        guestSide === "bride"
          ? "Nhà Gái"
          : guestSide === "groom"
          ? "Nhà Trai"
          : "Bạn Cả Hai",
      wishes:
        message.trim() ||
        (attending === "yes"
          ? "Chúc hai bạn mãi mãi hạnh phúc trọn vẹn!"
          : "Gửi ngàn lời chúc phúc tốt đẹp nhất đến tân lang tân nương!"),
      date: "Vừa xong",
      attending: attending === "yes" ? "Tham dự" : "Gửi lời chúc",
    };

    // Optimistically prepend wish to the list
    setWishesList((prev) => [newWish, ...prev]);

    // Save to Google Sheet via backend API
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guestSide,
          guestCount,
          message: message.trim(),
        }),
      });

      const result = await res.json();
      if (result.success) {
        // Refetch after a short delay to get the canonical sheet row and timestamp
        setTimeout(() => {
          fetchWishes();
        }, 1500);
      }
    } catch (err) {
      console.warn("Lỗi gửi xác nhận tham dự:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <section ref={sectionRef} id="rsvp-section" className="py-12 px-4 text-center">
      <div className="max-w-[440px] mx-auto">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="h-[1px] w-8 sm:w-12 bg-[#dfbaba]" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#812927]/90 font-cinzel font-semibold">
            RSVP
          </span>
          <span className="h-[1px] w-8 sm:w-12 bg-[#dfbaba]" />
        </div>
        <h3 className="text-3xl sm:text-4xl font-script text-[#812927] mb-2 drop-shadow-xs">
          Xác Nhận Tham Dự
        </h3>
        <p className="text-xs text-[#666] font-light mb-6 max-w-xs mx-auto">
          Sự hiện diện của bạn là niềm vinh dự cho gia đình chúng mình
        </p>

        {/* RSVP Card Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-md border border-[#dfbaba]/50 text-left space-y-4"
        >
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#812927] mx-auto" />
              <h4 className="text-lg font-serif-luxury font-bold text-[#812927]">
                Cảm Ơn Bạn Rất Nhiều!
              </h4>
              <p className="text-xs text-[#555] leading-relaxed">
                Lời xác nhận và lời chúc của bạn đã được ghi nhận và lưu lại vào Google Sheet.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-xs font-semibold text-[#812927] underline hover:text-[#5a1c1a] cursor-pointer"
              >
                Gửi thêm lời chúc khác
              </button>
            </div>
          ) : (
            <>
              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-[#812927] uppercase tracking-wider mb-1">
                  Họ và tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Thu Thảo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#dfbaba] bg-[#fffcfb] focus:outline-none focus:ring-2 focus:ring-[#812927]/30 transition-all text-[#3b3232]"
                />
              </div>

              {/* Attendance Options */}
              <div>
                <label className="block text-xs font-semibold text-[#812927] uppercase tracking-wider mb-2">
                  Bạn sẽ tham dự chứ?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className={`py-2 px-3 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                      attending === "yes"
                        ? "bg-[#812927] text-white border-[#812927] shadow-xs"
                        : "bg-[#fffcfb] text-[#555] border-[#dfbaba]"
                    }`}
                  >
                    Sẽ Tham Dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`py-2 px-3 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                      attending === "no"
                        ? "bg-[#812927] text-white border-[#812927] shadow-xs"
                        : "bg-[#fffcfb] text-[#555] border-[#dfbaba]"
                    }`}
                  >
                    Gửi Lời Chúc Phúc
                  </button>
                </div>
              </div>

              {/* Guest Side */}
              <div>
                <label className="block text-xs font-semibold text-[#812927] uppercase tracking-wider mb-2">
                  Khách mời của
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {[
                    { id: "bride", label: "Nhà Gái" },
                    { id: "groom", label: "Nhà Trai" },
                    { id: "both", label: "Cả Hai" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGuestSide(item.id)}
                      className={`py-2 rounded-xl font-medium border transition-all cursor-pointer ${
                        guestSide === item.id
                          ? "bg-[#812927] text-white border-[#812927]"
                          : "bg-[#fffcfb] text-[#555] border-[#dfbaba]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of guests (if attending) */}
              {attending === "yes" && (
                <div>
                  <label className="block text-xs font-semibold text-[#812927] uppercase tracking-wider mb-1">
                    Số lượng người tham dự
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#dfbaba] bg-[#fffcfb] focus:outline-none focus:ring-2 focus:ring-[#812927]/30 text-[#3b3232]"
                  >
                    <option value="1">Đi một mình (1 người)</option>
                    <option value="2">Đi cùng người thương (2 người)</option>
                    <option value="family">Đi cùng gia đình (3+ người)</option>
                  </select>
                </div>
              )}

              {/* Wishes Message */}
              <div>
                <label className="block text-xs font-semibold text-[#812927] uppercase tracking-wider mb-1">
                  Lời chúc gửi đến dâu rể
                </label>
                <textarea
                  rows={3}
                  placeholder="Gửi gắm lời chúc tốt đẹp nhất..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#dfbaba] bg-[#fffcfb] focus:outline-none focus:ring-2 focus:ring-[#812927]/30 transition-all text-[#3b3232] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#812927] hover:bg-[#6b2220] disabled:bg-[#812927]/70 text-white py-3 rounded-xl font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang lưu vào Google Sheet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi Xác Nhận &amp; Lời Chúc</span>
                  </>
                )}
              </button>
            </>
          )}
        </form>

        {/* Guest Book / Recent Wishes Feed */}
        <div className="mt-8 text-left">
          <div className="flex items-center justify-between mb-3 border-b border-[#dfbaba]/40 pb-2">
            <h4 className="text-[11px] font-cinzel uppercase tracking-[0.2em] font-bold text-[#812927]">
              Sổ Lưu Bút ({wishesList.length})
            </h4>
            <span className="text-[10px] text-[#888] font-light">
              Lời chúc từ quan khách
            </span>
          </div>

          {isLoadingWishes ? (
            <div className="py-8 text-center space-y-2 bg-white/40 backdrop-blur-xs rounded-xl border border-[#dfbaba]/30">
              <div className="w-5 h-5 border-2 border-[#812927]/30 border-t-[#812927] rounded-full animate-spin mx-auto" />
              <p className="text-[11px] text-[#888] font-light italic">
                Đang kết nối sổ lưu bút từ Google Sheet...
              </p>
            </div>
          ) : wishesList.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xs p-6 rounded-2xl border border-[#dfbaba]/40 text-center space-y-2 shadow-xs">
              <HeartHandshake className="w-7 h-7 text-[#dfbaba] mx-auto" />
              <p className="text-xs text-[#812927] font-serif-luxury font-medium">
                Chưa có lời chúc nào trong sổ lưu bút
              </p>
              <p className="text-[11px] text-[#888] font-light max-w-xs mx-auto leading-relaxed">
                Hãy là người đầu tiên gửi những lời chúc phúc ngọt ngào nhất đến Ngọc Trâm &amp; Lương Huy nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {wishesList.map((w, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-[#dfbaba]/40 shadow-xs hover:border-[#812927]/30 transition-all"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#812927]">{w.name}</span>
                    <div className="flex items-center gap-1.5">
                      {w.date && (
                        <span className="text-[10px] text-[#999] font-light">
                          {w.date}
                        </span>
                      )}
                      <span className="text-[10px] text-[#812927] bg-[#f9f1ef] px-2 py-0.5 rounded-full border border-[#dfbaba]/30 font-medium">
                        {w.side}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#444] font-light leading-relaxed">
                    {w.wishes}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
