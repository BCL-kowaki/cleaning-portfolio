'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import DiagnosisResultComponent from '@/components/DiagnosisResult';
import { PortfolioData } from '@/types/portfolio';
import { diagnosePortfolio } from '@/utils/diagnosis';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  
  const portfolio: PortfolioData = {
    stocks: parseFloat(searchParams.get('stocks') || '0'),
    realEstate: parseFloat(searchParams.get('realEstate') || '0'),
    gold: parseFloat(searchParams.get('gold') || '0'),
    mutualFunds: parseFloat(searchParams.get('mutualFunds') || '0'),
    crypto: parseFloat(searchParams.get('crypto') || '0'),
    cash: parseFloat(searchParams.get('cash') || '0'),
    other: parseFloat(searchParams.get('other') || '0'),
  };

  const total = Object.values(portfolio).reduce((sum, val) => sum + val, 0);
  
  if (Math.abs(total - 100) > 1) {
    return (
      <div className="bg-white rounded-lg fb-shadow p-8 text-center">
        <p className="text-4xl mb-4">🚫</p>
        <h2 className="text-lg font-bold text-[#1c1e21] mb-2">
          ポートフォリオデータが見つかりません
        </h2>
        <p className="text-[#65676b] text-sm mb-6">
          まずはポートフォリオを入力してください
        </p>
        <Link
          href="/"
          className="inline-block instagram-gradient text-white py-2.5 px-6 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          トップに戻る
        </Link>
      </div>
    );
  }

  const result = diagnosePortfolio(portfolio);

  return (
    <>
      {/* ポートフォリオ概要 */}
      <div className="bg-white rounded-lg fb-shadow p-4 mb-4">
        <h2 className="font-bold text-[#1c1e21] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 instagram-gradient rounded-full"></span>
          あなたのポートフォリオ
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '株式', value: portfolio.stocks, emoji: '📈' },
            { label: '不動産', value: portfolio.realEstate, emoji: '🏢' },
            { label: '金', value: portfolio.gold, emoji: '🥇' },
            { label: '投信/ETF', value: portfolio.mutualFunds, emoji: '📊' },
            { label: '暗号通貨', value: portfolio.crypto, emoji: '₿' },
            { label: '現金', value: portfolio.cash, emoji: '💵' },
            { label: 'その他', value: portfolio.other, emoji: '📦' },
          ].filter(item => item.value > 0).map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1 bg-[#f0f2f5] px-2.5 py-1.5 rounded-full text-xs"
            >
              <span>{item.emoji}</span>
              <span className="text-[#65676b]">{item.label}</span>
              <span className="instagram-gradient-text font-semibold">{item.value.toFixed(1)}%</span>
            </span>
          ))}
        </div>
      </div>

      <DiagnosisResultComponent result={result} />
    </>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-[#f0f2f5]">
      {/* ヘッダー */}
      <header className="instagram-gradient text-white py-5 px-4 mb-6">
        <div className="container mx-auto max-w-xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm mb-2">
            ← 戻る
          </Link>
          <div className="text-center">
            <span className="text-4xl">🧹</span>
            <h1 className="text-xl font-bold mt-2">診断結果</h1>
            <p className="text-white/90 text-sm">2026年に向けた大掃除アドバイス</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 max-w-xl pb-8">
        <Suspense fallback={
          <div className="bg-white rounded-lg fb-shadow p-8 text-center">
            <div className="text-4xl mb-2 animate-pulse">⏳</div>
            <p className="text-[#65676b] text-sm">診断中...</p>
          </div>
        }>
          <ResultContent />
        </Suspense>

        <footer className="mt-6 text-center text-[#65676b] text-xs">
          <p>© 2025 ポートフォリオ年末大掃除診断</p>
        </footer>
      </div>
    </main>
  );
}
