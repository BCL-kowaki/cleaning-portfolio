'use client';

import React from 'react';
import { DiagnosisResult as DiagnosisResultType } from '@/types/portfolio';
import RadarChart from './RadarChart';

interface DiagnosisResultProps {
  result: DiagnosisResultType;
}

const typeStyles: Record<string, { bg: string; iconBg: string }> = {
  gambler: { bg: 'bg-red-50', iconBg: 'bg-red-100' },
  safekeeper: { bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
  trendy: { bg: 'bg-purple-50', iconBg: 'bg-purple-100' },
  balanced: { bg: 'bg-green-50', iconBg: 'bg-green-100' },
  landlord: { bg: 'bg-amber-50', iconBg: 'bg-amber-100' },
};

export default function DiagnosisResult({ result }: DiagnosisResultProps) {
  const styles = typeStyles[result.type];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* タイプカード */}
      <div className="bg-white rounded-lg fb-shadow overflow-hidden">
        <div className="instagram-gradient p-4 text-white text-center">
          <span className="text-5xl block mb-2">{result.emoji}</span>
          <h2 className="text-xl font-bold">{result.title}</h2>
          <p className="text-white/80 text-sm mt-1">条件: {result.condition}</p>
        </div>
      </div>

      {/* レーダーチャート */}
      <div className="bg-white rounded-lg fb-shadow p-4">
        <h3 className="font-bold text-[#1c1e21] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 instagram-gradient rounded-full"></span>
          ポートフォリオ分析
        </h3>
        <RadarChart stats={result.stats} />
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: '攻撃力', value: result.stats.attack, emoji: '⚔️' },
            { label: '防御力', value: result.stats.defense, emoji: '🛡️' },
            { label: '流動性', value: result.stats.liquidity, emoji: '💧' },
            { label: 'インフレ耐性', value: result.stats.inflationResist, emoji: '🔥' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#f0f2f5] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{stat.emoji}</span>
                <span className="text-[#65676b] text-xs">{stat.label}</span>
              </div>
              <div className="instagram-gradient-text text-2xl font-bold">{stat.value}</div>
              <div className="mt-2 h-1.5 bg-[#e4e6eb] rounded-full overflow-hidden">
                <div
                  className="h-full instagram-gradient transition-all duration-500"
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 診断結果 */}
      <div className={`bg-white rounded-lg fb-shadow overflow-hidden`}>
        <div className={`${styles.bg} p-4`}>
          <h3 className="font-bold text-[#1c1e21] mb-2 flex items-center gap-2">
            🔮 診断結果
          </h3>
          <p className="text-[#1c1e21] text-sm leading-relaxed">
            {result.diagnosis}
          </p>
        </div>
      </div>

      {/* 2026年ニュース予報 */}
      <div className="bg-white rounded-lg fb-shadow overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <h3 className="font-bold text-[#1c1e21] mb-2 flex items-center gap-2">
            📰 2026年ニュース予報
          </h3>
          <p className="text-[#1c1e21] text-sm leading-relaxed">
            {result.newsForecast}
          </p>
        </div>
      </div>

      {/* 大掃除アドバイス */}
      <div className="bg-white rounded-lg fb-shadow p-4">
        <h3 className="font-bold text-[#1c1e21] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 instagram-gradient rounded-full"></span>
          大掃除アドバイス
        </h3>
        <div className="space-y-3">
          {result.cleanupAdvice.map((advice, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 bg-[#f0f2f5] rounded-lg"
            >
              <div className="w-10 h-10 instagram-gradient rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-[#1c1e21] text-sm mb-1">
                  {advice.action}
                </div>
                <p className="text-[#65676b] text-sm">
                  {advice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 免責事項 */}
      <div className="bg-[#f0f2f5] rounded-lg p-4 text-center">
        <p className="text-[#1c1e21] text-base font-medium">
          ⚠️ この診断はエンターテインメントコンテンツです。投資判断は専門家にご相談ください。
        </p>
      </div>
    </div>
  );
}
