import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ポートフォリオ年末大掃除診断 | 2026年に向けたリバランスアドバイス",
  description: "あなたの投資ポートフォリオを入力して、2026年の経済市況に対するリスク診断とリバランスのアドバイスを受け取りましょう。株・不動産・金・投信・ETF・暗号通貨など、様々な資産クラスに対応。",
  keywords: ["ポートフォリオ", "投資", "診断", "リバランス", "2026年", "資産運用"],
  openGraph: {
    title: "ポートフォリオ年末大掃除診断",
    description: "2026年に向けた投資ポートフォリオのリバランスアドバイス",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
