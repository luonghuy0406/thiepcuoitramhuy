"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";
import { Send, CheckCircle2, Heart, MessageSquare } from "lucide-react";

interface Wish {
  name: string;
  side: string;
  wishes: string;
  date: string;
}

export default function RsvpSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guestSide, setGuestSide] = useState("both");
  const [guestCount, setGuestCount] = useState("1");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [wishesList, setWishesList] = useState<Wish[]>([
    {
      name: "Trần Minh Quân",
      side: "Bạn Chú Rể",
      wishes: "Chúc hai bạn trăm năm hạnh phúc, sớm đón thiên thần nhỏ nhé!",
      date: "Vừa xong",
    },
    {
      name: "Hoàng Thu Thảo",
      side: "Bạn Cô Dâu",
      wishes: "Ngọc Trâm ơi xinh đẹp tuyệt vời, chúc hai bạn một đời an yên bên nhau!",
      date: "10 phút trước",
    },
  ]);

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

    // Load stored wishes if available
    try {
      const stored = localStorage.getItem("wedding_wishes");
      if (stored) {
        setWishesList(JSON.parse(stored));
      }
    } catch {}

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

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
        guestSide === "groom"
          ? "Nhà Trai"
          : guestSide === "bride"
          ? "Nhà Gái"
          : "Bạn Cả Hai",
      wishes:
        message.trim() ||
        (attending === "yes"
          ? "Chúc hai bạn mãi mãi hạnh phúc trọn vẹn!"
          : "Gửi ngàn lời chúc phúc tốt đẹp nhất đến tân lang tân nương!"),
      date: "Vừa xong",
    };

    const updated = [newWish, ...wishesList];
    setWishesList(updated);
    try {
      localStorage.setItem("wedding_wishes", JSON.stringify(updated));
    } catch {}

    setIsSubmitted(true);
  };

  return (
    <section ref={sectionRef} id="rsvp-section" className="py-12 px-4 text-center">
      <div className="max-w-[440px] mx-auto">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#812927] font-bold">
          Xác Nhận Tham Dự & Lời Chúc
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#812927] mt-1 mb-2">
          Gửi Lời Chúc Mừng
        </h3>
        <p className="text-xs text-[#666] font-light mb-6">
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
              <CheckCircle2 className="w-12 h-12 text-[#812927] mx-auto animate-bounce" />
              <h4 className="text-lg font-serif-luxury font-bold text-[#812927]">
                Cảm Ơn Bạn Rất Nhiều!
              </h4>
              <p className="text-xs text-[#555] leading-relaxed">
                Lời xác nhận và lời chúc của bạn đã được gửi tới Lương Huy & Ngọc Trâm.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-xs font-semibold text-[#812927] underline hover:text-[#5a1c1a]"
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
                  placeholder="Ví dụ: Nguyễn Văn A"
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
                    className={`py-2 px-3 text-xs rounded-xl font-medium border transition-all ${
                      attending === "yes"
                        ? "bg-[#812927] text-white border-[#812927] shadow-xs"
                        : "bg-[#fffcfb] text-[#555] border-[#dfbaba]"
                    }`}
                  >
                    🎉 Sẽ Tham Dự
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`py-2 px-3 text-xs rounded-xl font-medium border transition-all ${
                      attending === "no"
                        ? "bg-[#812927] text-white border-[#812927] shadow-xs"
                        : "bg-[#fffcfb] text-[#555] border-[#dfbaba]"
                    }`}
                  >
                    💌 Gửi Lời Chúc Phúc
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
                    { id: "groom", label: "Nhà Trai" },
                    { id: "bride", label: "Nhà Gái" },
                    { id: "both", label: "Cả Hai" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGuestSide(item.id)}
                      className={`py-2 rounded-xl font-medium border transition-all ${
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
                className="w-full bg-[#812927] hover:bg-[#6b2220] text-white py-3 rounded-xl font-medium text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Gửi Xác Nhận & Lời Chúc
              </button>
            </>
          )}
        </form>

        {/* Guest Book / Recent Wishes Feed */}
        <div className="mt-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-[#812927]" />
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#812927]">
              Sổ Lưu Bút ({wishesList.length})
            </h4>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {wishesList.map((w, idx) => (
              <div
                key={idx}
                className="bg-white/70 backdrop-blur-xs p-3.5 rounded-xl border border-[#dfbaba]/40 shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-[#812927]">{w.name}</span>
                  <span className="text-[10px] text-[#888] bg-[#f9f1ef] px-2 py-0.5 rounded-full border border-[#dfbaba]/30">
                    {w.side}
                  </span>
                </div>
                <p className="text-xs text-[#444] font-light leading-relaxed">
                  {w.wishes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
