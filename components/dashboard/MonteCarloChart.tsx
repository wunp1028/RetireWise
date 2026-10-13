// components/dashboard/MonteCarloChart.tsx
'use client';

import React, { useState, useTransition, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { runMonteCarloSimulation } from '@/lib/engine/monteCarlo';
import { SimulationInput, calculatePortfolioVolatility } from '@/lib/engine/calculator';
import { formatNTD } from '@/lib/engine/inflation';
import { RefreshCw, Zap, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface MonteCarloChartProps {
  simulationInput: SimulationInput;
  retirementAge: number;
}

export default function MonteCarloChart({
  simulationInput,
  retirementAge,
}: MonteCarloChartProps) {
  const autoVolatility = useMemo(() => {
    return calculatePortfolioVolatility(simulationInput.assets);
  }, [simulationInput.assets]);

  const [volatility, setVolatility] = useState<number>(autoVolatility);
  const [seedKey, setSeedKey] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  // 若資產發生結構性變化且使用者未強行自訂，適度同步
  React.useEffect(() => {
    setVolatility(autoVolatility);
  }, [autoVolatility]);

  // 執行 1,000 次模擬
  const mcResult = useMemo(() => {
    return runMonteCarloSimulation(simulationInput, 1000, volatility, seedKey);
  }, [simulationInput, volatility, seedKey]);

  const handleRefresh = () => {
    startTransition(() => {
      setSeedKey((k) => k + 1);
    });
  };

  const formatYAxis = (val: number) => {
    if (Math.abs(val) >= 100000000) {
      return `${(val / 100000000).toFixed(1)}億`;
    }
    return `${(val / 10000).toFixed(0)}萬`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-xl text-xs space-y-1.5 shadow-xl border border-slate-700 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1 font-semibold text-slate-200">
            <span>{data.age} 歲 ({data.calendarYear} 年)</span>
            <span className="text-[10px] text-slate-400">1,000 次模擬分佈</span>
          </div>

          <div className="space-y-1 font-mono text-[11px] pt-1">
            <div className="flex justify-between text-cyan-300">
              <span>PR90 (樂觀 90%):</span>
              <span>{formatNTD(data.pr90)}</span>
            </div>
            <div className="flex justify-between text-emerald-400 font-semibold">
              <span>PR50 (中位數 50%):</span>
              <span>{formatNTD(data.pr50)}</span>
            </div>
            <div className="flex justify-between text-rose-300">
              <span>PR10 (悲觀 10%):</span>
              <span>{formatNTD(data.pr10)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const isHighRisk = mcResult.ruinProbability > 15;

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">
              蒙地卡羅壓力測試 (1,000 次隨機路徑模擬)
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              常態正態分佈擾動
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            考量每年市場報酬率之隨機劇烈波動，驗證家庭資產存續百分位數
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Volatility slider */}
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">年化波動度(σ):</span>
            <input
              type="range"
              min="0.04"
              max="0.25"
              step="0.01"
              value={volatility}
              onChange={(e) => setVolatility(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-emerald-400 w-8 font-semibold">
              {(volatility * 100).toFixed(0)}%
            </span>
          </div>

          <button
            type="button"
            onClick={() => setVolatility(autoVolatility)}
            title="點擊套用依目前資產配置加權推算之波動度"
            className="hidden sm:flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-300 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>配置推算: {(autoVolatility * 100).toFixed(1)}%</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
            <span>重新擾動</span>
          </button>
        </div>
      </div>

      {/* Probability Alert Bar */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
          isHighRisk
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-2 font-medium">
          {isHighRisk ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          )}
          <span>
            {isHighRisk
              ? `終身破產風險為 ${mcResult.ruinProbability}%，建議適度提升儲蓄率或調降退休生活費替代率。`
              : `終身破產機率僅 ${mcResult.ruinProbability}%（存續成功率 ${(100 - mcResult.ruinProbability).toFixed(1)}%），財務體質極為穩健！`}
          </span>
        </div>
        <div className="hidden sm:block text-[11px] font-mono text-slate-400">
          樣本數: 1,000 條軌跡
        </div>
      </div>

      {/* Percentiles AreaChart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mcResult.percentiles}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="pr90Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
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
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              formatter={(val) => <span className="text-slate-300">{val}</span>}
            />

            <ReferenceLine x={retirementAge} stroke="#f59e0b" strokeDasharray="3 3" />
            <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="2 2" strokeWidth={1} />

            <Area
              type="monotone"
              dataKey="pr90"
              name="PR90 (樂觀 90%)"
              stroke="#06b6d4"
              strokeWidth={1.5}
              fill="url(#pr90Gradient)"
            />
            <Area
              type="monotone"
              dataKey="pr50"
              name="PR50 (中位數 50%)"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="pr10"
              name="PR10 (悲觀 10%)"
              stroke="#f43f5e"
              strokeWidth={1.5}
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
