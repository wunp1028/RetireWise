// components/dashboard/KPICards.tsx
'use client';

import React from 'react';
import { SimulationSummary } from '@/lib/engine/types';
import { formatNTD, formatPercent } from '@/lib/engine/inflation';
import { TrendingUp, ShieldAlert, ShieldCheck, DollarSign, Activity } from 'lucide-react';

interface KPICardsProps {
  summary: SimulationSummary;
  ruinProbability: number;
  currentAge: number;
  retirementAge: number;
}

export default function KPICards({
  summary,
  ruinProbability,
  currentAge,
  retirementAge,
}: KPICardsProps) {
  const isSafe = summary.ruinAge === null;
  const survivalRate = Math.max(0, 100 - ruinProbability);

  const isFireAchieved = (summary.fireCoverageRatio ?? 0) >= 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. 退休時/終身資產峰值 */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">預估資產峰值</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
          {formatNTD(summary.peakNetWorth, true)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium text-[11px]">
            {summary.peakNetWorthAge} 歲高峰
          </span>
          <span className="text-[11px]">(距今 {summary.peakNetWorthAge - currentAge} 年)</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. 資產存續與耗盡年份 */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">資產存續狀態</span>
          <div
            className={`p-2 rounded-xl ${
              isSafe ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {isSafe ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight">
          {isSafe ? (
            <span className="text-emerald-400">終身無虞</span>
          ) : (
            <span className="text-rose-400">{summary.ruinAge} 歲耗盡</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          {isSafe ? (
            <span className="text-slate-400 text-[11px]">至壽命終點保有正資產</span>
          ) : (
            <span className="text-rose-300 text-[11px]">退休後 {summary.ruinAge! - retirementAge} 年恐透支</span>
          )}
        </div>
        <div
          className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
            isSafe ? 'bg-cyan-500/5' : 'bg-rose-500/10'
          }`}
        />
      </div>

      {/* 3. 蒙地卡羅千次壓力測試成功率 */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">蒙地卡羅存續成功率</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
          <span
            className={
              survivalRate >= 85
                ? 'text-emerald-400'
                : survivalRate >= 70
                ? 'text-amber-400'
                : 'text-rose-400'
            }
          >
            {survivalRate.toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-slate-400 text-[11px]">
            1,000次擾動 · 破產率 {ruinProbability.toFixed(1)}%
          </span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4. 退休首年年度現金流 */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">退休首年淨現金流</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
          <span
            className={
              summary.retirementYearNetCashflow >= 0 ? 'text-emerald-400' : 'text-amber-400'
            }
          >
            {formatNTD(summary.retirementYearNetCashflow, true)}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px] truncate">
            {summary.retirementYearNetCashflow >= 0 ? '年金覆蓋生活開銷' : '需動用本金提領'}
          </span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 5. 4% 法則安全提領率 (FIRE 指標) */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">4% 法則安全年提領</span>
          <div className={`p-2 rounded-xl ${isFireAchieved ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>
            <span className="text-xs font-bold font-mono">4%</span>
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tracking-tight">
          {formatNTD(summary.safeWithdrawalAmount ?? 0, true)}
          <span className="text-xs text-slate-400 font-normal"> /年</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isFireAchieved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
            FIRE覆蓋率 {summary.fireCoverageRatio?.toFixed(0) ?? 0}%
          </span>
          <span className="text-slate-400 text-[10px]">
            {isFireAchieved ? '已達財富自由' : '尚需本金累積'}
          </span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>
    </div>
  );
}
