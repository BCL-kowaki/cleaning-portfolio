'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import DiagnosisResultComponent from '@/components/DiagnosisResult';
import { PortfolioData, UserInfo } from '@/types/portfolio';
import { diagnosePortfolio } from '@/utils/diagnosis';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  
  // 比率（%）
  const portfolio: PortfolioData = {
    stocks: parseFloat(searchParams.get('stocks') || '0'),
    realEstate: parseFloat(searchParams.get('realEstate') || '0'),
    gold: parseFloat(searchParams.get('gold') || '0'),
    mutualFunds: parseFloat(searchParams.get('mutualFunds') || '0'),
    crypto: parseFloat(searchParams.get('crypto') || '0'),
    cash: parseFloat(searchParams.get('cash') || '0'),
    other: parseFloat(searchParams.get('other') || '0'),
  };

  // 金額（円）
  const amounts = {
    stocks: parseInt(searchParams.get('amt_stocks') || '0', 10),
    realEstate: parseInt(searchParams.get('amt_realEstate') || '0', 10),
    gold: parseInt(searchParams.get('amt_gold') || '0', 10),
    mutualFunds: parseInt(searchParams.get('amt_mutualFunds') || '0', 10),
    crypto: parseInt(searchParams.get('amt_crypto') || '0', 10),
    cash: parseInt(searchParams.get('amt_cash') || '0', 10),
    other: parseInt(searchParams.get('amt_other') || '0', 10),
  };

  const userInfo: UserInfo = {
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    email: searchParams.get('email') || '',
  };

  const totalAmount = parseInt(searchParams.get('total') || '0', 10);

  const total = Object.values(portfolio).reduce((sum, val) => sum + val, 0);
  
  // 診断結果を取得
  const result = Math.abs(total - 100) <= 1 ? diagnosePortfolio(portfolio) : null;

  // メール送信
  useEffect(() => {
    const sendEmail = async () => {
      if (!result || !userInfo.email || emailSent) return;

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userInfo,
            portfolio,
            amounts,
            totalAmount,
            diagnosisResult: {
              emoji: result.emoji,
              title: result.title,
              diagnosis: result.diagnosis,
              newsForecast: result.newsForecast,
              cleanupAdvice: result.cleanupAdvice,
              stats: result.stats,
            },
          }),
        });

        if (response.ok) {
          setEmailSent(true);
          console.log('メール送信成功');
        } else {
          setEmailError(true);
          console.error('メール送信失敗');
        }
      } catch (error) {
        setEmailError(true);
        console.error('メール送信エラー:', error);
      }
    };

    sendEmail();
  }, [result, userInfo, portfolio, totalAmount, emailSent]);
  
  if (Math.abs(total - 100) > 1 || !result) {
    return (
      <div className="bg-white rounded-lg fb-shadow p-8 text-center">
        <p className="text-4xl mb-4">🚫</p>
        <h2 className="text-lg font-bold text-[#333] mb-2">
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

  return (
    <>
      {/* メール送信ステータス */}
      {emailSent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-center">
          <p className="text-green-700 text-sm">
            ✅ 診断結果を {userInfo.email} にお送りしました
          </p>
        </div>
      )}
      {emailError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-center">
          <p className="text-red-700 text-sm">
            ⚠️ メール送信に失敗しました。結果は画面でご確認ください。
          </p>
        </div>
      )}

      {/* ユーザー情報 */}
      <div className="bg-white rounded-lg fb-shadow p-4 mb-4">
        <h2 className="font-bold text-[#333] mb-2 flex items-center gap-2">
          <span className="w-1 h-4 instagram-gradient rounded-full"></span>
          {userInfo.name} 様
        </h2>
        <p className="text-[#65676b] text-sm">
          診断結果をメールでもお送りしています
        </p>
      </div>

      {/* ポートフォリオ概要 */}
      <div className="bg-white rounded-lg fb-shadow p-4 mb-4">
        <h2 className="font-bold text-[#333] mb-2 flex items-center gap-2">
          <span className="w-1 h-4 instagram-gradient rounded-full"></span>
          あなたのポートフォリオ
        </h2>
        <p className="text-[#65676b] text-sm mb-3">
          総資産額: ¥{totalAmount.toLocaleString('ja-JP')}
        </p>
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
            <span className="text-4xl">📊</span>
            <h1 className="text-xl font-bold mt-2">診断結果</h1>
            <p className="text-white/90 text-sm">2026年の投資を考えるヒント</p>
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
          <p>© 株式会社投資の"KAWARA"版.com</p>
        </footer>
      </div>
    </main>
  );
}
