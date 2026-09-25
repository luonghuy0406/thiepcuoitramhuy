import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cinelove.me"),
  title: "Thiệp Cưới - Lương Huy & Ngọc Trâm | Thiệp cưới online",
  description: "Thiệp cưới online của Nguyễn Lương Huy & Bùi Huỳnh Ngọc Trâm. Trân trọng kính mời quý khách tới chung vui!",
  keywords: ["thiệp cưới online", "Lương Huy Ngọc Trâm", "thiệp cưới 42", "Cinelove"],
  openGraph: {
    title: "Thiệp Cưới - Lương Huy & Ngọc Trâm",
    description: "Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi!",
    images: [
      {
        url: "/assets/0660702c-af3c-42e6-8978-b23bf1e51c39.jpg",
        width: 1200,
        height: 630,
        alt: "Thiệp Cưới Lương Huy & Ngọc Trâm",
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
      <body className="min-h-screen bg-[#241f1f] text-[#3b3232] flex justify-center selection:bg-[#e49696] selection:text-white">
        <div className="w-full max-w-[500px] min-h-screen bg-[#f9f1ef] relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
