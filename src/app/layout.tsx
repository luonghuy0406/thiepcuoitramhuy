import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cinelove.me"),
  title: "Lễ Vu Quy - Ngọc Trâm & Lương Huy | Thiệp cưới online",
  description: "Thiệp cưới Lễ Vu Quy của Bùi Huỳnh Ngọc Trâm & Nguyễn Lương Huy. Trân trọng kính mời quý khách tới chung vui!",
  keywords: ["thiệp cưới online", "Lễ Vu Quy", "Ngọc Trâm Lương Huy", "thiệp cưới 42", "Cinelove"],
  openGraph: {
    title: "Lễ Vu Quy - Ngọc Trâm & Lương Huy",
    description: "Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi!",
    images: [
      {
        url: "/assets/wedding-og-share.jpg",
        width: 1200,
        height: 630,
        alt: "Lễ Vu Quy Ngọc Trâm & Lương Huy",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#d8c5be] text-[#3b3232] flex justify-center selection:bg-[#e49696] selection:text-white antialiased">
        <div
          className="w-full max-w-[500px] min-h-screen relative overflow-x-hidden shadow-2xl flex flex-col justify-between"
          style={{
            backgroundImage: "url('/assets/hoatiet/background_all.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "500px auto",
          }}
        >
          {/* 1. HOẠ TIẾT ĐỈNH THIỆP (Hero Crest) - Tràn đều ra viền trái và phải, top -40px */}
          <div
            id="layout-hero-crest"
            className="w-full relative -top-[40px] -mb-[40px] aspect-[660/378] pointer-events-none select-none z-0 drop-shadow-xs flex-shrink-0"
            style={{ top: "-40px" }}
          >
            <Image
              src="/assets/hoatiet/hero-removebg-preview.png"
              alt="Wedding Header Crest"
              fill
              priority
              className="object-cover object-top"
            />
          </div>

          {/* Nội dung chính của thiệp cưới */}
          <div className="w-full flex-1">
            {children}
          </div>

          {/* 2. HOẠ TIẾT ĐÁY THIỆP (End Flourish) - Đưa ra ngoài layout tổng, z-index dưới welcome */}
          <div
            id="layout-end-flourish"
            className="w-full relative aspect-[660/378] -mt-6 sm:-mt-8 pointer-events-none select-none z-0 drop-shadow-xs flex-shrink-0"
          >
            <Image
              src="/assets/hoatiet/end_bg_crop-removebg-preview.png"
              alt="Wedding Footer Flourish"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </body>
    </html>
  );
}
