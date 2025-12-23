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
  title: "あなたのポートフォリオ診断テスト | 2026年版",
  description: "あなたの投資ポートフォリオを入力して、投資タイプ診断を受けましょう。株・不動産・金・投信・ETF・暗号通貨など、様々な資産クラスに対応。2026年の投資を考えるきっかけに。",
  keywords: ["ポートフォリオ", "投資", "診断", "2026年", "資産運用", "投資タイプ"],
  openGraph: {
    title: "あなたのポートフォリオ診断テスト | 2026年版",
    description: "2026年の投資を考えるきっかけに。あなたの投資タイプを診断",
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
