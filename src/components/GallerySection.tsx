"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { weddingData } from "@/data/wedding-data";

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxImageRef = useRef<HTMLDivElement>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 88%",
            once: true,
          },
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out",
        });
      }

      // 2. Grand Arch Portrait: Clip-path Curtain reveal + Parallax scrub
      const grandCard = galleryRef.current?.querySelector(".grand-card");
      const grandImg = galleryRef.current?.querySelector(".grand-img");
      if (grandCard) {
        gsap.fromTo(
          grandCard,
          {
            clipPath: "inset(12% 8% 12% 8% round 80px)",
            scale: 1.08,
            opacity: 0.4,
          },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: grandCard,
              start: "top 85%",
              end: "center center",
              scrub: 1.2,
            },
          }
        );

        if (grandImg) {
          gsap.to(grandImg, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: grandCard,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
      }

      // 3. Asymmetric Duo: Fan-out angle rotation & slide
      const duoLeft = galleryRef.current?.querySelector(".duo-card-left");
      const duoRight = galleryRef.current?.querySelector(".duo-card-right");
      if (duoLeft) {
        gsap.from(duoLeft, {
          scrollTrigger: {
            trigger: duoLeft,
            start: "top 88%",
            once: true,
          },
          x: -50,
          rotate: -6,
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          ease: "back.out(1.5)",
        });
      }
      if (duoRight) {
        gsap.from(duoRight, {
          scrollTrigger: {
            trigger: duoRight,
            start: "top 88%",
            once: true,
          },
          x: 50,
          rotate: 6,
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          delay: 0.15,
          ease: "back.out(1.5)",
        });
      }

      // 4. Polaroid Scrapbook Cards: Photo-drop settling animation
      const polaroidBride = galleryRef.current?.querySelector(".polaroid-bride");
      const polaroidGroom = galleryRef.current?.querySelector(".polaroid-groom");
      if (polaroidBride) {
        gsap.from(polaroidBride, {
          scrollTrigger: {
            trigger: polaroidBride,
            start: "top 88%",
            once: true,
          },
          y: 60,
          rotate: -8,
          scale: 0.86,
          opacity: 0,
          duration: 1.2,
          ease: "back.out(1.8)",
        });
      }
      if (polaroidGroom) {
        gsap.from(polaroidGroom, {
          scrollTrigger: {
            trigger: polaroidGroom,
            start: "top 88%",
            once: true,
          },
          y: 60,
          rotate: 8,
          scale: 0.86,
          opacity: 0,
          duration: 1.2,
          delay: 0.15,
          ease: "back.out(1.8)",
        });
      }

      // 5. Panoramic Romance Banner: Center expand wipe
      const panoCard = galleryRef.current?.querySelector(".panoramic-card");
      if (panoCard) {
        gsap.fromTo(
          panoCard,
          {
            clipPath: "inset(0 15% 0 15% round 24px)",
            scale: 1.05,
            opacity: 0.5,
          },
          {
            clipPath: "inset(0 0% 0 0% round 24px)",
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panoCard,
              start: "top 85%",
              end: "center center",
              scrub: 1.2,
            },
          }
        );
      }

      // 6. Triptych Trio: 3D Flip cards turn-in
      const triptychItems =
        galleryRef.current?.querySelectorAll(".triptych-item") || [];
      if (triptychItems.length > 0) {
        gsap.from(triptychItems, {
          scrollTrigger: {
            trigger: triptychItems[0],
            start: "top 90%",
            once: true,
          },
          rotateY: 40,
          y: 35,
          opacity: 0,
          scale: 0.9,
          stagger: 0.12,
          duration: 1.1,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") {
        setActivePhotoIndex(null);
      } else if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev + 1) % weddingData.gallery.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) =>
          prev !== null
            ? (prev - 1 + weddingData.gallery.length) % weddingData.gallery.length
            : null
        );
      }
    },
    [activePhotoIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const openPhoto = (index: number) => {
    setActivePhotoIndex(index);
    // Smooth entrance animation for lightbox modal
    requestAnimationFrame(() => {
      if (lightboxRef.current && lightboxImageRef.current) {
        gsap.fromTo(
          lightboxRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );
        gsap.fromTo(
          lightboxImageRef.current,
          { scale: 0.9, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }
        );
      }
    });
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      if (lightboxImageRef.current) {
        gsap.fromTo(
          lightboxImageRef.current,
          { opacity: 0.3, x: 20, scale: 0.98 },
          { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: "power2.out" }
        );
      }
      setActivePhotoIndex((activePhotoIndex + 1) % weddingData.gallery.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex !== null) {
      if (lightboxImageRef.current) {
        gsap.fromTo(
          lightboxImageRef.current,
          { opacity: 0.3, x: -20, scale: 0.98 },
          { opacity: 1, x: 0, scale: 1, duration: 0.35, ease: "power2.out" }
        );
      }
      setActivePhotoIndex(
        (activePhotoIndex - 1 + weddingData.gallery.length) %
          weddingData.gallery.length
      );
    }
  };

  return (
    <section ref={sectionRef} id="gallery-section" className="py-16 px-4 text-center">
      {/* Title */}
      <div ref={headerRef} className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.35em] text-[#812927] font-semibold font-cinzel">
          Album Ảnh Cưới
        </span>
        <h3 className="text-4xl sm:text-5xl font-script text-[#812927] mt-1 mb-2 drop-shadow-xs">
          Sweet Moments
        </h3>
        <p className="text-xs text-[#777] font-light max-w-xs mx-auto">
          Từng ánh mắt, nụ cười lưu giữ trọn vẹn tình yêu của chúng mình
        </p>
      </div>

      {/* Editorial Scrapbook Gallery Layout with Smooth Transitions */}
      <div ref={galleryRef} className="max-w-[460px] mx-auto space-y-6">
        {/* 1. Grand Feature Portrait (Arch Luxury Frame with Parallax) */}
        <div
          onClick={() => openPhoto(0)}
          className="gallery-card grand-card group relative w-full aspect-[4/5] rounded-t-[160px] rounded-b-3xl overflow-hidden cursor-pointer shadow-xl border-4 border-white/95 bg-white transition-all duration-700 hover:shadow-2xl hover:border-white"
        >
          <div className="grand-img relative w-full h-[115%] -top-[7%] transition-transform duration-700 group-hover:scale-105">
            <Image
              src={weddingData.gallery[0].src}
              alt={weddingData.gallery[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 500px) 100vw, 460px"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 pointer-events-none" />

          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white pointer-events-none">
            <span className="text-[11px] font-serif-luxury tracking-widest uppercase text-white/95 drop-shadow">
              Ngọc Trâm &amp; Lương Huy
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 2. Asymmetric Duo: Elegant Portrait + Quote Card */}
        <div className="grid grid-cols-2 gap-3.5 items-center">
          {/* Left: Romantic Vertical Portrait */}
          <div
            onClick={() => openPhoto(1)}
            className="gallery-card duo-card-left group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md border-2 border-white/90 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:rotate-1"
          >
            <Image
              src={weddingData.gallery[1].src}
              alt={weddingData.gallery[1].alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-108"
              sizes="(max-width: 500px) 50vw, 230px"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
              <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
            </div>
          </div>

          {/* Right: Close-up Bride Photo + Romantic Quote */}
          <div className="space-y-3">
            <div
              onClick={() => openPhoto(2)}
              className="gallery-card duo-card-right group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md border-2 border-white/90 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:-rotate-1"
            >
              <Image
                src={weddingData.gallery[2].src}
                alt={weddingData.gallery[2].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-108"
                sizes="(max-width: 500px) 50vw, 230px"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                <ZoomIn className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>

            <div className="gallery-card bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#dfbaba]/50 text-center shadow-xs transition-shadow hover:shadow-md">
              <p className="text-[11px] font-serif-luxury italic text-[#812927] leading-relaxed">
                “Bởi vì yêu anh, em thấy thế giới này dịu dàng hơn biết mấy...”
              </p>
            </div>
          </div>
        </div>

        {/* 3. Polaroid Scrapbook Cards (Bride & Groom Duo) */}
        <div className="grid grid-cols-2 gap-3.5 pt-2">
          {/* Bride / Couple Polaroid */}
          <div
            onClick={() => openPhoto(4)}
            className="gallery-card polaroid-bride group bg-white p-2.5 pb-4 rounded-xl shadow-lg border border-[#dfbaba]/40 cursor-pointer -rotate-1 hover:rotate-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-2">
              <Image
                src={weddingData.gallery[4].src}
                alt={weddingData.gallery[4].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-106"
              />
            </div>
            <p className="text-[11px] font-script text-[#812927] tracking-wide">
              Ngọc Trâm &amp; Lương Huy
            </p>
          </div>

          {/* Groom Polaroid */}
          <div
            onClick={() => openPhoto(3)}
            className="gallery-card polaroid-groom group bg-white p-2.5 pb-4 rounded-xl shadow-lg border border-[#dfbaba]/40 cursor-pointer rotate-1 hover:rotate-0 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-2">
              <Image
                src={weddingData.gallery[3].src}
                alt={weddingData.gallery[3].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-106"
              />
            </div>
            <p className="text-[11px] font-script text-[#812927] tracking-wide">
              Chú rể Lương Huy
            </p>
          </div>
        </div>

        {/* 4. Panoramic Romance Banner */}
        <div
          onClick={() => openPhoto(5)}
          className="gallery-card panoramic-card group relative w-full aspect-[16/9] rounded-3xl overflow-hidden cursor-pointer shadow-xl border-3 border-white bg-white transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
        >
          <Image
            src={weddingData.gallery[5].src}
            alt={weddingData.gallery[5].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-106"
            sizes="(max-width: 500px) 100vw, 460px"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 text-left pointer-events-none">
            <span className="text-[10px] tracking-widest uppercase text-white/80 block">
              Forever and Always
            </span>
            <span className="text-sm font-serif-luxury text-white font-medium">
              Tình yêu nở hoa
            </span>
          </div>
        </div>

        {/* 5. Triptych Trio (3 side-by-side joyful photos) */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {[6, 7, 8].map((idx) => {
            const item = weddingData.gallery[idx];
            if (!item) return null;
            return (
              <div
                key={idx}
                onClick={() => openPhoto(idx)}
                className="gallery-card triptych-item group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md border-2 border-white bg-white transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 500px) 33vw, 150px"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                  <ZoomIn className="w-4 h-4 text-white drop-shadow" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal with Animated Entrance & Navigation */}
      {activePhotoIndex !== null && (
        <div
          ref={lightboxRef}
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer select-none"
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md z-50 transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left / Previous button */}
          <button
            onClick={prevPhoto}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/90 p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md z-50 transition-all hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right / Next button */}
          <button
            onClick={nextPhoto}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/90 p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md z-50 transition-all hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Photo Frame */}
          <div
            ref={lightboxImageRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] max-h-[80vh] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/20"
          >
            <Image
              src={weddingData.gallery[activePhotoIndex].src}
              alt={weddingData.gallery[activePhotoIndex].alt}
              fill
              className="object-contain"
              priority
            />

            {/* Photo Counter & Caption */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-center text-white">
              <p className="text-xs font-light text-white/95 mb-1 drop-shadow">
                {weddingData.gallery[activePhotoIndex].alt}
              </p>
              <span className="text-[10px] tracking-widest uppercase text-white/70 font-sans">
                {activePhotoIndex + 1} / {weddingData.gallery.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
