import type { Metadata, Viewport } from "next";
import { Vazirmatn, Gulzar } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-vazirmatn"
});

const gulzar = Gulzar({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-gulzar"
});

export const metadata: Metadata = {
  title: "منوی هوشمند کافه دی",
  description: "یک باریستای هوشمند برای پیشنهاد نوشیدنی مناسب شما"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2A170D"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${gulzar.variable}`}>
      <body>{children}</body>
    </html>
  );
}
