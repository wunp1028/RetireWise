// app/page.tsx
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { runSimulation, calculatePortfolioVolatility } from '@/lib/engine/calculator';
import { runMonteCarloSimulation } from '@/lib/engine/monteCarlo';
import KPICards from '@/components/dashboard/KPICards';
import NetWorthChart from '@/components/dashboard/NetWorthChart';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import MonteCarloChart from '@/components/dashboard/MonteCarloChart';
import { formatNTD } from '@/lib/engine/inflation';
import {
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  CalendarCheck,
  GraduationCap,
  Home,
  ShieldAlert,
  GitCompare,
  Smile,
  Copy,
  Trash2,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    family,
    assets,
    liabilities,
    children,
    lifeEvents,
    cashFlow,
    scenario,
    updateFamilyProfile,
    updateCashFlowProfile,
    planB,
    saveCurrentAsPlanB,
    clearPlanB,
    hasHydrated,
  } = useFinanceStore();

  const [planBNameInput, setPlanBNameInput] = useState('');
  const [showSavePlanBModal, setShowSavePlanBModal] = useState(false);

  const autoVolatility = useMemo(
    () => calculatePortfolioVolatility(assets),
    [assets]
  );

  const simulationInput = useMemo(
    () => ({
      family,
      assets,
      liabilities,
      children,
      lifeEvents,
      cashFlow,
      scenario,
    }),
    [family, assets, liabilities, children, lifeEvents, cashFlow, scenario]
  );

  const { projections, summary } = useMemo(
    () => runSimulation(simulationInput),
    [simulationInput]
  );

  const initialMC = useMemo(
    () => runMonteCarloSimulation(simulationInput, 1000, autoVolatility),
    [simulationInput, autoVolatility]
  );

  // 計畫 B 模擬結果 (若已建立)
  const planBProjections = useMemo(() => {
    if (!planB) return undefined;
    const planBInput = {
      family: planB.family,
      assets: planB.assets,
      liabilities: planB.liabilities,
      children: planB.children,
      lifeEvents: planB.lifeEvents,
      cashFlow: planB.cashFlow,
      scenario,
    };
    return runSimulation(planBInput).projections;
  }, [planB, scenario]);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">正在自本機載入財務模擬數據...</p>
        </div>
      </div>
    );
  }

  const isPensionDiscounted = (cashFlow.pensionReformDiscount ?? 1.0) < 1.0;
  const isSpendingSmileEnabled = cashFlow.enableSpendingSmile ?? true;

  const handleSavePlanB = () => {
    saveCurrentAsPlanB(planBNameInput.trim() || '計畫 B 對照組');
    setPlanBNameInput('');
    setShowSavePlanBModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Parameters Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              退休財務總覽儀表板
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {scenario === 'BASE' ? '基準情境' : scenario === 'BEAR' ? '悲觀情境' : '樂觀情境'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            以本機演算法逐年模擬至 {family.lifeExpectancy} 歲，即時運算資產消長與現金缺口
          </p>
        </div>

        {/* Quick Sliders (Instant reactive feedback < 100ms) */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">退休年齡:</span>
            <input
              type="range"
              min="50"
              max="75"
              value={family.retirementAge}
              onChange={(e) =>
                updateFamilyProfile({ retirementAge: parseInt(e.target.value) })
              }
              className="w-20 h-1.5 cursor-pointer"
            />
            <span className="font-mono text-emerald-400 font-bold w-10">
              {family.retirementAge} 歲
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">通膨率:</span>
            <input
              type="range"
              min="0.005"
              max="0.05"
              step="0.001"
              value={family.inflationRate}
              onChange={(e) =>
                updateFamilyProfile({ inflationRate: parseFloat(e.target.value) })
              }
              className="w-20 h-1.5 cursor-pointer"
            />
            <span className="font-mono text-amber-400 font-bold w-12">
              {(family.inflationRate * 100).toFixed(1)}%
            </span>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>詳細參數</span>
          </Link>
        </div>
      </div>

      {/* Advanced Feature Switches Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. 勞保改革打折開關 */}
          <button
            onClick={() =>
              updateCashFlowProfile({
                pensionReformDiscount: isPensionDiscounted ? 1.0 : 0.7,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              isPensionDiscounted
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="點擊切換是否模擬勞保年金縮水改革"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>
              勞保改革壓力測試:{' '}
              <strong className={isPensionDiscounted ? 'text-rose-400' : 'text-slate-300'}>
                {isPensionDiscounted ? '模擬打7折 (30%縮減)' : '全額發放 (無折扣)'}
              </strong>
            </span>
          </button>

          {/* 2. 退休支出微笑曲線開關 */}
          <button
            onClick={() =>
              updateCashFlowProfile({
                enableSpendingSmile: !isSpendingSmileEnabled,
              })
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              isSpendingSmileEnabled
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="點擊切換三階段微笑開支 (活躍期105% / 放緩期82% / 照護期95%)"
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span>
              退休三階段微笑開支:{' '}
              <strong className={isSpendingSmileEnabled ? 'text-amber-400' : 'text-slate-300'}>
                {isSpendingSmileEnabled ? '已啟用 (自然放緩)' : '固定平線支出'}
              </strong>
            </span>
          </button>
        </div>

        {/* 3. 計畫 A / B 雙軌對比開關 */}
        <div className="flex items-center gap-2">
          {!planB ? (
            <button
              onClick={() => setShowSavePlanBModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>複製當前為「計畫 B」對照組</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-sky-400 px-2.5 py-1 rounded-md bg-sky-500/15 border border-sky-500/30">
                <GitCompare className="w-3.5 h-3.5" />
                <span>對照中: {planB.name}</span>
              </span>
              <button
                onClick={clearPlanB}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="清除計畫 B 對照組"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Plan B Modal */}
      {showSavePlanBModal && (
        <div className="p-4 rounded-xl bg-slate-900/95 border border-sky-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-sky-400 flex items-center gap-1.5">
              <Copy className="w-4 h-4" />
              <span>將當前所有設定固化為「計畫 B 對照組」</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              儲存後，您可以自由改動年齡或生活費，圖表將同時疊加繪製兩條曲線進行直接比對！
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="例如: 60歲提早退休版"
              value={planBNameInput}
              onChange={(e) => setPlanBNameInput(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
            />
            <button
              onClick={handleSavePlanB}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold whitespace-nowrap"
            >
              儲存對照
            </button>
            <button
              onClick={() => setShowSavePlanBModal(false)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards (Including 4% SWR Rule & FIRE Ratio) */}
      <KPICards
        summary={summary}
        ruinProbability={initialMC.ruinProbability}
        currentAge={family.currentAge}
        retirementAge={family.retirementAge}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Net Worth Chart (With optional Plan B superimposed) */}
        <NetWorthChart
          projections={projections}
          retirementAge={family.retirementAge}
          ruinAge={summary.ruinAge}
          planBProjections={planBProjections}
          planBName={planB?.name}
        />

        {/* Cash Flow Chart */}
        <CashFlowChart
          projections={projections}
          retirementAge={family.retirementAge}
        />

        {/* Monte Carlo Simulation Chart (With Auto-calculated portfolio volatility) */}
        <MonteCarloChart
          simulationInput={simulationInput}
          retirementAge={family.retirementAge}
        />
      </div>

      {/* Life Milestones Timeline Preview */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              關鍵生命里程碑概覽
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              時間軸上已設定之子女升學階段、房貸清償年份與大額預備金支出
            </p>
          </div>
          <Link
            href="/milestones"
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            <span>管理里程碑</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Retirement Age */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-slate-200">{family.retirementAge} 歲 退休轉折</div>
              <div className="text-slate-400 mt-0.5">薪資終止 · 啟動月退年金</div>
            </div>
          </div>

          {/* Children stages */}
          {children.map((child) => (
            <div
              key={child.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">
                  {child.name} (現年 {child.currentAge} 歲)
                </div>
                <div className="text-slate-400 mt-0.5">
                  共有 {child.educationStages.length} 個教育階段規劃
                </div>
              </div>
            </div>
          ))}

          {/* Liabilities */}
          {liabilities.map((l) => {
            const payoffAge = family.currentAge + Math.ceil(l.remainingMonths / 12);
            return (
              <div
                key={l.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <Home className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-200">{payoffAge} 歲 房貸清償</div>
                  <div className="text-slate-400 mt-0.5">{l.name} 剩餘 {(l.remainingMonths / 12).toFixed(1)} 年</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
