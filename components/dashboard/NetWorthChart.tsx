// components/dashboard/NetWorthChart.tsx
'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { YearlyProjection } from '@/lib/engine/types';
import { formatNTD } from '@/lib/engine/inflation';
import { Printer, Layers, GitCompare } from 'lucide-react';

interface NetWorthChartProps {
  projections: YearlyProjection[];
  retirementAge: number;
  ruinAge: number | null;
  planBProjections?: YearlyProjection[];
  planBName?: string;
}

export default function NetWorthChart({
  projections,
  retirementAge,
  ruinAge,
  planBProjections,
  planBName,
}: NetWorthChartProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // 格式化 Y 軸標籤 (以萬元/億元呈現)
  const formatYAxis = (val: number) => {
    if (Math.abs(val) >= 100000000) {
      return `${(val / 100000000).toFixed(1)}億`;
    }
    return `${(val / 10000).toFixed(0)}萬`;
  };

  // 合併計畫 A 與計畫 B 數據以進行同圖疊加
  const mergedData = projections.map((p, idx) => {
    const planBItem = planBProjections?.[idx];
    return {
      ...p,
      planBNetWorth: planBItem ? planBItem.endingNetWorth : undefined,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-xl text-xs space-y-1.5 shadow-xl border border-slate-700 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 gap-4">
            <span className="font-bold text-slate-200">
              {data.age} 歲 ({data.calendarYear} 年)
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                data.isRetired
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {data.isRetired ? '退休階段' : '累積階段'}
            </span>
          </div>

          <div className="space-y-1 pt-1 font-mono text-[11px]">
            <div className="flex justify-between gap-4">
              <span className="text-emerald-400 font-medium">計畫 A 淨資產:</span>
              <span className="font-bold text-emerald-400">
                {formatNTD(data.endingNetWorth)}
              </span>
            </div>

            {data.planBNetWorth !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-sky-300 font-medium">{planBName || '計畫 B'}:</span>
                <span className="font-bold text-sky-300">
                  {formatNTD(data.planBNetWorth)}
                </span>
              </div>
            )}

            {showBreakdown && (
              <div className="flex justify-between gap-4">
                <span className="text-teal-300">金融流動資產:</span>
                <span className="text-teal-300">
                  {formatNTD(data.endingFinancialAssets)}
                </span>
              </div>
            )}

            <div className="flex justify-between gap-4 pt-1 border-t border-slate-800">
              <span className="text-slate-400">當年度投資收益:</span>
              <span className={data.investmentReturn >= 0 ? 'text-cyan-400' : 'text-rose-400'}>
                {formatNTD(data.investmentReturn)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">年度淨儲蓄(差額):</span>
              <span className={data.netSavings >= 0 ? 'text-emerald-300' : 'text-amber-300'}>
                {formatNTD(data.netSavings)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">
              資產消長動態曲線 (Net Worth Timeline)
            </h2>
            {planBProjections && (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <GitCompare className="w-3 h-3" />
                計畫 A / B 雙軌對比中
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            呈現自當前年齡逐年複利增長、退休轉折提領至壽命終點之資產水位
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3 h-3" />
            <span>{showBreakdown ? '只看總淨資產' : '顯示金融資產比較'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            title="列印或另存為 PDF 財務報告"
          >
            <Printer className="w-3 h-3 text-slate-400" />
            <span>列印/PDF</span>
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mergedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="financialGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="age"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(age) => `${age}歲`}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* 退休轉折點垂直參考線 */}
            <ReferenceLine
              x={retirementAge}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `退休 (${retirementAge}歲)`,
                fill: '#f59e0b',
                fontSize: 11,
                position: 'top',
              }}
            />

            {/* 破產警示線 */}
            {ruinAge && (
              <ReferenceLine
                x={ruinAge}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `資產耗盡 (${ruinAge}歲)`,
                  fill: '#f43f5e',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="endingNetWorth"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#netWorthGradient)"
              name="計畫 A 淨資產"
            />

            {/* 計畫 B 對照組曲線 */}
            {planBProjections && (
              <Area
                type="monotone"
                dataKey="planBNetWorth"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="none"
                name={planBName || '計畫 B 淨資產'}
              />
            )}

            {showBreakdown && (
              <Area
                type="monotone"
                dataKey="endingFinancialAssets"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#financialGradient)"
                name="流動金融資產"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
