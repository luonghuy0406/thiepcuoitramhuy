"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, HeartHandshake, Loader2, Gift } from "lucide-react";
import GiftModal from "@/components/GiftModal";
import SectionDivider from "@/components/SectionDivider";

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

  const [activeTab, setActiveTab] = useState<"form" | "wishes">("form");
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guestSide, setGuestSide] = useState("bride");
  const [guestCount, setGuestCount] = useState("1");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  // Live wishes fetched from Google Sheet
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
      if (formRef.current) {
        gsap.from(formRef.current, {
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 90%",
            once: true,
          },
          y: 24,
          scale: 0.98,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
        });
      }
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
      colors: ["#b16964", "#e49696", "#dfbaba", "#ffd166"],
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
    <section
      ref={sectionRef}
      id="rsvp-section"
      className="min-h-[100dvh] w-full flex flex-col justify-center items-center px-3.5 py-4 snap-start relative z-10 text-center overflow-visible"
    >
      {/* Top Section Divider */}
      <SectionDivider variant={2} className="my-1 sm:my-1.5" />

      <div className="w-full max-w-[420px] mx-auto">
        <h3 className="text-2xl sm:text-3xl font-script text-[#b16964] mb-0.5 drop-shadow-xs">
          Xác Nhận Tham Dự
        </h3>
        <p className="text-[11px] sm:text-xs text-[#666] font-light mb-2.5 max-w-xs mx-auto">
          Sự hiện diện của bạn là niềm vinh dự cho gia đình chúng mình
        </p>

        {/* Tab Switcher: Gửi Lời Chúc vs Sổ Lưu Bút */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5 p-1 rounded-xl bg-white/60 border border-[#dfbaba]/50 max-w-[340px] mx-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-1 px-3 rounded-lg text-xs font-serif-luxury font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "form"
                ? "bg-[#b16964] text-white shadow-xs"
                : "text-[#7a5252] hover:text-[#b16964]"
            }`}
          >
            Gửi Lời Chúc
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wishes")}
            className={`flex-1 py-1 px-3 rounded-lg text-xs font-serif-luxury font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "wishes"
                ? "bg-[#b16964] text-white shadow-xs"
                : "text-[#7a5252] hover:text-[#b16964]"
            }`}
          >
            Sổ Lưu Bút ({wishesList.length})
          </button>
        </div>

        {/* TAB 1: RSVP FORM */}
        {activeTab === "form" && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#b16964]/20 bg-white/70 backdrop-blur-xs p-4 sm:p-5 text-left space-y-2.5 shadow-2xs transition-all duration-300 w-full"
          >
            {isSubmitted ? (
              <div className="py-6 text-center space-y-2.5">
                <CheckCircle2 className="w-10 h-10 text-[#b16964] mx-auto" />
                <h4 className="text-base font-serif-luxury font-bold text-[#b16964]">
                  Cảm Ơn Bạn Rất Nhiều!
                </h4>
                <p className="text-xs text-[#555] leading-relaxed">
                  Lời chúc của bạn đã được gửi thành công đến dâu rể.
                </p>
                <div className="pt-2 flex flex-col items-center gap-2 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-full bg-[#b16964] hover:bg-[#68201f] text-white py-2 px-4 rounded-xl text-xs font-medium tracking-wider uppercase shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Gửi Quà Cưới Đến Dâu Rể</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("wishes")}
                    className="text-xs font-semibold text-[#b16964] underline hover:text-[#5a1c1a] cursor-pointer pt-0.5"
                  >
                    Xem sổ lưu bút quan khách
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="text-[11px] text-[#777] underline hover:text-[#333] cursor-pointer"
                  >
                    Gửi thêm lời chúc khác
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Name Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#b16964] uppercase tracking-wider mb-0.5">
                    Họ và tên của bạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Sơn Tùng M-TP"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-base sm:text-xs px-3 py-2 rounded-xl border border-[#dfbaba] bg-[#fffcfb] focus:outline-none focus:ring-2 focus:ring-[#b16964]/30 transition-all text-[#3b3232]"
                  />
                </div>

                {/* Attendance Options */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#b16964] uppercase tracking-wider mb-1">
                    Bạn sẽ tham dự chứ?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAttending("yes")}
                      className={`py-1.5 px-3 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                        attending === "yes"
                          ? "bg-[#b16964] text-white border-[#b16964] shadow-xs"
                          : "bg-[#fffcfb] text-[#555] border-[#dfbaba]"
                      }`}
                    >
                      Sẽ Tham Dự
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending("no")}
                      className={`py-1.5 px-3 text-xs rounded-xl font-medium border transition-all cursor-pointer ${
                        attending === "no"
                          ? "bg-[#b16964] text-white border-[#b16964] shadow-xs"
                          : "bg-[#fffcfb] text-[#555] border-[#dfbaba]"
                      }`}
                    >
                      Gửi Lời Chúc Phúc
                    </button>
                  </div>
                </div>

                {/* Guest Side */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#b16964] uppercase tracking-wider mb-1">
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
                        className={`py-1.5 rounded-xl font-medium border transition-all cursor-pointer ${
                          guestSide === item.id
                            ? "bg-[#b16964] text-white border-[#b16964]"
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
                    <label className="block text-[11px] font-semibold text-[#b16964] uppercase tracking-wider mb-0.5">
                      Số lượng người tham dự
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full text-base sm:text-xs px-3 py-2 rounded-xl border border-[#dfbaba] bg-[#fffcfb] focus:outline-none focus:ring-2 focus:ring-[#b16964]/30 text-[#3b3232]"
                    >
                      <option value="1">Đi một mình (1 người)</option>
                      <option value="2">Đi cùng người thương (2 người)</option>
                      <option value="family">Đi cùng gia đình (3+ người)</option>
                    </select>
                  </div>
                )}

                {/* Wishes Message */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#b16964] uppercase tracking-wider mb-0.5">
                    Lời chúc gửi đến dâu rể
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Gửi gắm lời chúc tốt đẹp nhất..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-base sm:text-xs px-3 py-2 rounded-xl border border-[#dfbaba] bg-[#fffcfb] focus:outline-none focus:ring-2 focus:ring-[#b16964]/30 transition-all text-[#3b3232] resize-none"
                  />
                </div>

                {/* Submit Button & Gift Button */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#b16964] hover:bg-[#6b2220] disabled:bg-[#b16964]/70 text-white py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang gửi</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {attending === "no" ? "Gửi Lời Chúc" : "Xác Nhận"}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsGiftModalOpen(true)}
                    className="w-full bg-white hover:bg-[#fff5f4] text-[#b16964] border border-[#b16964]/40 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-[#b16964]"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Gửi Quà Mừng</span>
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* TAB 2: GUEST BOOK WISHES LIST */}
        {activeTab === "wishes" && (
          <div className="rounded-2xl border border-[#b16964]/20 bg-white/70 backdrop-blur-xs p-4 sm:p-5 text-left shadow-2xs w-full">
            <div className="flex items-center justify-between mb-2.5 border-b border-[#dfbaba]/40 pb-1.5">
              <h4 className="text-[11px] font-cinzel uppercase tracking-[0.2em] font-bold text-[#b16964]">
                Sổ Lưu Bút ({wishesList.length})
              </h4>
              <span className="text-[10px] text-[#888] font-light">
                Lời chúc quan khách
              </span>
            </div>

            {isLoadingWishes ? (
              <div className="py-6 text-center space-y-2 bg-white/40 rounded-xl border border-[#dfbaba]/30">
                <div className="w-5 h-5 border-2 border-[#b16964]/30 border-t-[#b16964] rounded-full animate-spin mx-auto" />
                <p className="text-[11px] text-[#888] font-light italic">
                  Đang đồng bộ sổ lưu bút...
                </p>
              </div>
            ) : wishesList.length === 0 ? (
              <div className="bg-white/60 p-5 rounded-xl border border-[#dfbaba]/40 text-center space-y-1.5">
                <HeartHandshake className="w-6 h-6 text-[#dfbaba] mx-auto" />
                <p className="text-xs text-[#b16964] font-serif-luxury font-medium">
                  Chưa có lời chúc nào trong sổ lưu bút
                </p>
                <p className="text-[10px] text-[#888] font-light leading-relaxed">
                  Hãy là người đầu tiên gửi những lời chúc phúc ngọt ngào nhất!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                {wishesList.map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-white/85 p-2.5 rounded-xl border border-[#dfbaba]/40 shadow-xs hover:border-[#b16964]/30 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="font-bold text-[#b16964]">{w.name}</span>
                      <div className="flex items-center gap-1.5">
                        {w.date && (
                          <span className="text-[9px] text-[#999] font-light">
                            {w.date}
                          </span>
                        )}
                        <span className="text-[9px] text-[#b16964] bg-[#f9f1ef] px-1.5 py-0.2 rounded-full border border-[#dfbaba]/30 font-medium">
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

            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className="w-full mt-2.5 py-2 text-xs font-serif-luxury font-bold text-[#b16964] border border-[#b16964]/30 rounded-xl hover:bg-[#b16964]/5 transition-colors cursor-pointer"
            >
              ✍️ Gửi lời chúc của bạn
            </button>
          </div>
        )}
      </div>

      {/* Gift QR Modal */}
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        defaultSide={guestSide === "groom" ? "groom" : "bride"}
      />
    </section>
  );
}
