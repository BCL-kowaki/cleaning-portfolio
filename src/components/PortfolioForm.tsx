'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioData, UserInfo } from '@/types/portfolio';

const assetTypes = [
  { key: 'stocks', label: '株式', emoji: '📈', description: '個別株・国内外株式' },
  { key: 'realEstate', label: '不動産', emoji: '🏢', description: '実物不動産・不動産投資' },
  { key: 'gold', label: '金', emoji: '🥇', description: 'ゴールド・貴金属' },
  { key: 'mutualFunds', label: '投信/ETF', emoji: '📊', description: 'インデックスファンド・ETF' },
  { key: 'crypto', label: '暗号通貨', emoji: '₿', description: 'ビットコイン・アルトコイン' },
  { key: 'cash', label: '現金', emoji: '💵', description: '預貯金・MMF' },
  { key: 'other', label: 'その他', emoji: '📦', description: '債券・商品・その他資産' },
] as const;

interface PortfolioAmounts {
  stocks: number;
  realEstate: number;
  gold: number;
  mutualFunds: number;
  crypto: number;
  cash: number;
  other: number;
}

function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

function parseFormattedNumber(str: string): number {
  return parseInt(str.replace(/,/g, ''), 10) || 0;
}

export default function PortfolioForm() {
  const router = useRouter();
  const [amounts, setAmounts] = useState<PortfolioAmounts>({
    stocks: 0,
    realEstate: 0,
    gold: 0,
    mutualFunds: 0,
    crypto: 0,
    cash: 0,
    other: 0,
  });

  const [inputValues, setInputValues] = useState<Record<string, string>>({
    stocks: '',
    realEstate: '',
    gold: '',
    mutualFunds: '',
    crypto: '',
    cash: '',
    other: '',
  });

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const total = useMemo(() => {
    return Object.values(amounts).reduce((sum, val) => sum + val, 0);
  }, [amounts]);

  const percentages = useMemo((): PortfolioData => {
    if (total === 0) {
      return {
        stocks: 0, realEstate: 0, gold: 0, mutualFunds: 0, crypto: 0, cash: 0, other: 0,
      };
    }
    return {
      stocks: (amounts.stocks / total) * 100,
      realEstate: (amounts.realEstate / total) * 100,
      gold: (amounts.gold / total) * 100,
      mutualFunds: (amounts.mutualFunds / total) * 100,
      crypto: (amounts.crypto / total) * 100,
      cash: (amounts.cash / total) * 100,
      other: (amounts.other / total) * 100,
    };
  }, [amounts, total]);

  const handleChange = (key: keyof PortfolioAmounts, value: string) => {
    const numValue = parseFormattedNumber(value);
    if (numValue < 0) return;
    
    setInputValues(prev => ({ ...prev, [key]: value.replace(/,/g, '') }));
    setAmounts(prev => ({ ...prev, [key]: numValue }));
  };

  const handleBlur = (key: keyof PortfolioAmounts) => {
    const value = amounts[key];
    if (value > 0) {
      setInputValues(prev => ({ ...prev, [key]: formatNumber(value) }));
    }
  };

  const handleFocus = (key: keyof PortfolioAmounts) => {
    const value = amounts[key];
    setInputValues(prev => ({ ...prev, [key]: value > 0 ? value.toString() : '' }));
  };

  const handleUserInfoChange = (key: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserInfo> = {};
    
    if (!userInfo.name.trim()) {
      newErrors.name = '氏名を入力してください';
    }
    
    if (!userInfo.phone.trim()) {
      newErrors.phone = '電話番号を入力してください';
    } else if (!/^[0-9-]+$/.test(userInfo.phone)) {
      newErrors.phone = '有効な電話番号を入力してください';
    }
    
    if (!userInfo.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (total === 0) return;
    if (!validateForm()) return;

    const params = new URLSearchParams();
    // 比率を渡す
    Object.entries(percentages).forEach(([key, value]) => {
      params.set(key, value.toFixed(2));
    });
    // 金額を渡す（管理者通知用）
    Object.entries(amounts).forEach(([key, value]) => {
      params.set(`amt_${key}`, value.toString());
    });
    // ユーザー情報も渡す
    params.set('name', userInfo.name);
    params.set('phone', userInfo.phone);
    params.set('email', userInfo.email);
    params.set('total', total.toString());
    
    router.push(`/result?${params.toString()}`);
  };

  const isFormValid = total > 0 && userInfo.name && userInfo.phone && userInfo.email;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ユーザー情報入力 */}
      <div className="bg-[#f0f2f5] rounded-lg p-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-[#65676b] mb-1">
            氏名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={userInfo.name}
            onChange={(e) => handleUserInfoChange('name', e.target.value)}
            placeholder="山田 太郎"
            className={`w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-[#dddfe2]'} focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 transition-all bg-white text-sm`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#65676b] mb-1">
            電話番号 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={userInfo.phone}
            onChange={(e) => handleUserInfoChange('phone', e.target.value)}
            placeholder="090-1234-5678"
            className={`w-full px-3 py-2 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-[#dddfe2]'} focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 transition-all bg-white text-sm`}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#65676b] mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) => handleUserInfoChange('email', e.target.value)}
            placeholder="example@email.com"
            className={`w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-[#dddfe2]'} focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 transition-all bg-white text-sm`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      {/* ポートフォリオ入力 */}
      <div className="space-y-3">
        <h3 className="font-bold text-[#1c1e21] flex items-center gap-2">
          <span className="w-1 h-4 instagram-gradient rounded-full"></span>
          現在のポートフォリオ
        </h3>
        
        {assetTypes.map(({ key, label, emoji, description }) => (
          <div
            key={key}
            className="p-3 rounded-lg bg-[#f0f2f5] hover:bg-[#e4e6eb] transition-colors"
          >
            {/* モバイル: 縦並び / PC: 横並び */}
            <div className="flex items-center gap-3 md:gap-3">
              <div className="w-10 h-10 rounded-full bg-white fb-shadow flex items-center justify-center text-xl flex-shrink-0">
                {emoji}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#1c1e21] text-sm">{label}</div>
                <div className="text-[#65676b] text-xs">{description}</div>
              </div>
              {/* PC: 横に表示 */}
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65676b] text-sm">¥</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputValues[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    onBlur={() => handleBlur(key)}
                    onFocus={() => handleFocus(key)}
                    placeholder="0"
                    className="w-28 pl-6 pr-2 py-2 text-right text-sm font-medium rounded-lg border border-[#dddfe2] focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 transition-all bg-white"
                  />
                </div>
                <div className="w-16 py-1.5 px-2 rounded-lg bg-white border border-[#dddfe2] text-center">
                  <span className="instagram-gradient-text font-bold text-sm">
                    {percentages[key].toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            {/* モバイル: 下に表示 */}
            <div className="flex md:hidden items-center gap-2 mt-2 pl-13">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65676b] text-sm">¥</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValues[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  onBlur={() => handleBlur(key)}
                  onFocus={() => handleFocus(key)}
                  placeholder="0"
                  className="w-full pl-6 pr-2 py-2 text-right text-sm font-medium rounded-lg border border-[#dddfe2] focus:border-[#dc2743] focus:ring-2 focus:ring-[#dc2743]/20 transition-all bg-white"
                />
              </div>
              <div className="w-20 py-1.5 px-2 rounded-lg bg-white border border-[#dddfe2] text-center flex-shrink-0">
                <span className="instagram-gradient-text font-bold text-sm">
                  {percentages[key].toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* サマリーカード */}
      <div className="bg-[#f0f2f5] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[#65676b] text-xs">総資産額</div>
            <div className="text-xl font-bold text-[#1c1e21]">¥{formatNumber(total)}</div>
          </div>
          <div className="text-right">
            <div className="text-[#65676b] text-xs">入力済み</div>
            <div className="text-lg font-semibold text-[#1c1e21]">
              {Object.values(amounts).filter(v => v > 0).length}<span className="text-[#65676b] font-normal">/7</span>
            </div>
          </div>
        </div>

        {total > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {assetTypes.filter(({ key }) => percentages[key] > 0).map(({ key, emoji, label }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs fb-shadow"
              >
                <span>{emoji}</span>
                <span className="text-[#65676b]">{label}</span>
                <span className="instagram-gradient-text font-semibold">{percentages[key].toFixed(1)}%</span>
              </span>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            isFormValid
              ? 'instagram-gradient text-white hover:opacity-90 active:scale-[0.98]'
              : 'bg-[#e4e6eb] text-[#bcc0c4] cursor-not-allowed'
          }`}
        >
          {!userInfo.name || !userInfo.phone || !userInfo.email
            ? 'お客様情報を入力してください'
            : total > 0
            ? '🧹 大掃除診断を開始'
            : '金額を入力してください'}
        </button>
      </div>
    </form>
  );
}
