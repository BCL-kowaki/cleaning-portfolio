'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  stats: {
    attack: number;
    defense: number;
    liquidity: number;
    inflationResist: number;
  };
}

export default function RadarChart({ stats }: RadarChartProps) {
  const data = {
    labels: ['攻撃力', '防御力', '流動性', 'インフレ耐性'],
    datasets: [
      {
        label: 'スコア',
        data: [stats.attack, stats.defense, stats.liquidity, stats.inflationResist],
        backgroundColor: 'rgba(66, 24, 187, 0.15)',
        borderColor: '#4218BB',
        borderWidth: 2,
        pointBackgroundColor: '#4218BB',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: '#e4e6eb',
        },
        grid: {
          color: '#e4e6eb',
        },
        pointLabels: {
          color: '#1c1e21',
          font: {
            size: 12,
            weight: 600 as const,
          },
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#65676b',
          stepSize: 25,
          font: {
            size: 10,
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1c1e21',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
        titleFont: {
          size: 12,
          weight: 600 as const,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    maintainAspectRatio: true,
  };

  return (
    <div className="w-full max-w-[280px] mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
