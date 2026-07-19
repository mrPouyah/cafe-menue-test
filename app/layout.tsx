import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-vazirmatn"
});

export const metadata: Metadata = {
  title: "منوی هوشمند کافه دی",
  description: "یک باریستای هوشمند برای پیشنهاد نوشیدنی مناسب شما"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF9F6"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body
        style={{ "--cafe-photo": `url(${basePath}/images/cafe-background.jpg)` } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
