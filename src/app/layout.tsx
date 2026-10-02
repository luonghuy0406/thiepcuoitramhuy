import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-[#dbc8c1] text-[#3b3232] flex justify-center selection:bg-[#e49696] selection:text-white">
        <div className="w-full max-w-[500px] min-h-screen bg-[#f9f1ef] relative overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
