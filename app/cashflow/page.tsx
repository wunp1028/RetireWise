// app/cashflow/page.tsx
'use client';

import React from 'react';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { formatNTD, formatPercent, inflate } from '@/lib/engine/inflation';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Percent,
  Receipt,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function CashFlowPage() {
  const { cashFlow, family, liabilities, updateCashFlowProfile, hasHydrated } = useFinanceStore();

  if (!hasHydrated) return null;

  // 年金年度總額
  const annualPension = cashFlow.pensionMonthlyAmount * 12;
  // 房貸等固定負債年度攤還總額
  const annualLiabilities = liabilities.reduce(
    (sum, l) => sum + Math.min(12, l.remainingMonths) * l.monthlyPayment,
    0
  );

  // 當前在職每年純生活+房貸總常態支出 (不含子女)
  const currentTotalExpense = cashFlow.annualLivingExpenses + annualLiabilities;
  const currentAnnualSurplus = cashFlow.annualSalary - currentTotalExpense;

  // 退休後首年常態生活費 (當前物價基準)
  const postRetireLivingBase = cashFlow.annualLivingExpenses * cashFlow.retirementLivingExpenseRatio;
  const retirementCashGapBase = annualPension - postRetireLivingBase;

  // 經通膨調整後退休首年生活費
  const yearsToRetirement = Math.max(0, family.retirementAge - family.currentAge);
  const inflatedPostRetireLiving = inflate(postRetireLivingBase, family.inflationRate, yearsToRetirement);
  const inflatedCashGap = annualPension - inflatedPostRetireLiving;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-emerald-400" />
          收支與退休年金設定 (Cash Flow Profile)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          設定常態工作收入、生活支出基準、退休所得替代率與勞保勞退月領年金
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. 在職薪資收入 */}
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              在職階段薪資總收入 (稅後家庭實質所得)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-medium">當前家庭年度薪資 (NTD)</label>
                <input
                  type="number"
                  step="50000"
                  min="0"
                  value={cashFlow.annualSalary}
                  onChange={(e) =>
                    updateCashFlowProfile({ annualSalary: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  約合每月平均 {formatNTD(Math.round(cashFlow.annualSalary / 12))}
                </p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-medium">預期薪資年調幅 (%)</label>
                  <span className="font-mono text-emerald-400 font-bold">
                    {(cashFlow.salaryGrowthRate * 100).toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.08"
                  step="0.005"
                  value={cashFlow.salaryGrowthRate}
                  onChange={(e) =>
                    updateCashFlowProfile({ salaryGrowthRate: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 cursor-pointer mt-2"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0% (凍薪)</span>
                  <span>2.0% (常態)</span>
                  <span>8.0% (高成長)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 生活開銷與退休所得替代率 */}
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              常態生活支出與退休生活開銷替代率
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-medium">
                  當前家庭年度常態生活開銷 (不含房貸與子女教育)
                </label>
                <input
                  type="number"
                  step="20000"
                  min="0"
                  value={cashFlow.annualLivingExpenses}
                  onChange={(e) =>
                    updateCashFlowProfile({ annualLivingExpenses: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  約合每月生活開支 {formatNTD(Math.round(cashFlow.annualLivingExpenses / 12))}
                </p>
              </div>

              {/* 所得替代率滑桿 */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-medium">退休生活支出替代率</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">
                    {(cashFlow.retirementLivingExpenseRatio * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.2"
                  step="0.05"
                  value={cashFlow.retirementLivingExpenseRatio}
                  onChange={(e) =>
                    updateCashFlowProfile({
                      retirementLivingExpenseRatio: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>40% (極度簡樸)</span>
                  <span>70% (理財黃金比例)</span>
                  <span>100% (品質不變)</span>
                  <span>120% (環遊世界)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 退休月退年金 (勞保/勞退) */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              退休政府年金與雇主退休金 (勞保月領 + 勞退月領)
            </h2>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-medium">
                退休後夫妻合計固定月領年金總額 (NTD/月)
              </label>
              <input
                type="number"
                step="2000"
                min="0"
                value={cashFlow.pensionMonthlyAmount}
                onChange={(e) =>
                  updateCashFlowProfile({
                    pensionMonthlyAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
              />
              <p className="text-[11px] text-slate-500">
                年領相當於: <span className="text-cyan-400 font-mono font-semibold">{formatNTD(annualPension)} / 年</span>
                （自 {family.retirementAge} 歲開始領取至終身）
              </p>
            </div>

            {/* 勞保年金改革打折選擇器 */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">台灣勞保年金改革壓力折數</span>
                <span className="font-mono text-rose-400 font-semibold">
                  {((cashFlow.pensionReformDiscount ?? 1.0) * 100).toFixed(0)}% 發放
                  {(cashFlow.pensionReformDiscount ?? 1.0) < 1.0 ? ' (打折中)' : ' (全額)'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '全額 (100%)', val: 1.0 },
                  { label: '打9折 (90%)', val: 0.9 },
                  { label: '打8折 (80%)', val: 0.8 },
                  { label: '打7折 (70%)', val: 0.7 },
                ].map((item) => {
                  const isSelected = (cashFlow.pensionReformDiscount ?? 1.0) === item.val;
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => updateCashFlowProfile({ pensionReformDiscount: item.val })}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500">
                💡 模擬未來若勞保破產進行年金改革，月領實質所得被縮減時，對家庭資產庫的真實抗壓性。
              </p>
            </div>

            {/* 退休三階段微笑開支開關與說明 */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    退休三階段「微笑支出曲線」（David Blanchett 模型）
                  </div>
                  <div className="text-[11px] text-slate-400">
                    真實退休開銷並非一條死板平線，而是隨體力自然放緩
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={cashFlow.enableSpendingSmile ?? true}
                    onChange={(e) => updateCashFlowProfile({ enableSpendingSmile: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500"
                  />
                  <span>啟用</span>
                </label>
              </div>

              {(cashFlow.enableSpendingSmile ?? true) && (
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                    <div className="font-semibold text-amber-400">1. 活躍期 (前10年)</div>
                    <div className="text-slate-400 mt-0.5">開銷 105% (旅遊享樂)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                    <div className="font-semibold text-emerald-400">2. 放緩期 (10-20年)</div>
                    <div className="text-slate-400 mt-0.5">開銷 82% (活動少物慾降)</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                    <div className="font-semibold text-cyan-400">3. 照護期 (20年+)</div>
                    <div className="text-slate-400 mt-0.5">開銷 95% (醫療照護回升)</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Instant Comparison Summary */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-2">
              現金流結構檢驗
            </h3>

            {/* Current Working Phase */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                當前在職年度儲蓄力
              </div>
              <div className="space-y-1 text-slate-400 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>家庭總薪資:</span>
                  <span className="text-slate-200">{formatNTD(cashFlow.annualSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span>生活費 + 房貸:</span>
                  <span className="text-rose-400">-{formatNTD(currentTotalExpense)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-xs">
                  <span>年度可投資盈餘:</span>
                  <span className={currentAnnualSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {formatNTD(currentAnnualSurplus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Post-Retirement Phase */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                退休首年收支平衡 (通膨前)
              </div>
              <div className="space-y-1 text-slate-400 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>月退年金年度流入:</span>
                  <span className="text-slate-200">{formatNTD(annualPension)}</span>
                </div>
                <div className="flex justify-between">
                  <span>替代率生活支出:</span>
                  <span className="text-rose-400">-{formatNTD(postRetireLivingBase)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-xs">
                  <span>年金覆蓋缺口/盈餘:</span>
                  <span className={retirementCashGapBase >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {formatNTD(retirementCashGapBase)}
                  </span>
                </div>
              </div>
            </div>

            {/* Inflated Retirement Year */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              📌 距退休尚有 <span className="text-white font-bold">{yearsToRetirement} 年</span>。依 {formatPercent(family.inflationRate)} 通膨計算，退休首年生活開銷將實質擴大為 <span className="text-amber-400 font-mono font-semibold">{formatNTD(inflatedPostRetireLiving)}</span>。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
