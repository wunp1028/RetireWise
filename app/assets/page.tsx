// app/assets/page.tsx
'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { FinancialAsset, AssetClass, Liability } from '@/lib/engine/types';
import { formatNTD, formatPercent } from '@/lib/engine/inflation';
import { calculateBlendedRates, calculatePortfolioVolatility } from '@/lib/engine/calculator';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Coins,
  Plus,
  Trash2,
  Building,
  TrendingUp,
  Percent,
  RefreshCw,
  Home,
  CreditCard,
  Check,
} from 'lucide-react';

const ASSET_COLORS: Record<AssetClass, string> = {
  EQUITY: '#10b981',     // 翠綠
  BOND: '#6366f1',       // 靛藍
  CASH: '#06b6d4',       // 青藍
  REAL_ESTATE: '#f59e0b',// 琥珀金
  OTHER: '#a855f7',      // 紫色
};

const ASSET_NAMES: Record<AssetClass, string> = {
  EQUITY: '權益類(股票/ETF)',
  BOND: '固定收益(債券)',
  CASH: '現金/緊急備用金',
  REAL_ESTATE: '自住/商用不動產',
  OTHER: '其他替代資產',
};

export default function AssetsPage() {
  const {
    assets,
    liabilities,
    addAsset,
    updateAsset,
    deleteAsset,
    addLiability,
    updateLiability,
    deleteLiability,
    hasHydrated,
  } = useFinanceStore();

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);

  // New Asset Form State
  const [newAsset, setNewAsset] = useState<Omit<FinancialAsset, 'id'>>({
    name: '',
    category: 'EQUITY',
    currentValue: 1000000,
    expectedAnnualReturn: 0.07,
    annualDividendYield: 0.02,
    reinvestDividends: true,
  });

  // New Liability Form State
  const [newLiability, setNewLiability] = useState<Omit<Liability, 'id'>>({
    name: '自用房貸',
    principalRemaining: 5000000,
    annualInterestRate: 0.022,
    remainingMonths: 240,
    monthlyPayment: 25700,
  });

  if (!hasHydrated) return null;

  const totalAssetValue = assets.reduce((sum, a) => sum + Math.max(0, a.currentValue), 0);
  const totalLiabilityValue = liabilities.reduce(
    (sum, l) => sum + Math.max(0, l.principalRemaining),
    0
  );
  const netWorth = totalAssetValue - totalLiabilityValue;

  const { blendedReturn, blendedDividendYield } = calculateBlendedRates(assets, 'BASE');
  const portfolioVolatility = calculatePortfolioVolatility(assets);

  // 圓餅圖數據
  const categoryTotals: Record<AssetClass, number> = {
    EQUITY: 0,
    BOND: 0,
    CASH: 0,
    REAL_ESTATE: 0,
    OTHER: 0,
  };
  assets.forEach((a) => {
    categoryTotals[a.category] = (categoryTotals[a.category] || 0) + Math.max(0, a.currentValue);
  });

  const pieData = Object.entries(categoryTotals)
    .filter(([_, val]) => val > 0)
    .map(([cat, val]) => ({
      name: ASSET_NAMES[cat as AssetClass] || cat,
      category: cat as AssetClass,
      value: val,
    }));

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name.trim()) return;
    addAsset(newAsset);
    setNewAsset({
      name: '',
      category: 'EQUITY',
      currentValue: 1000000,
      expectedAnnualReturn: 0.07,
      annualDividendYield: 0.02,
      reinvestDividends: true,
    });
    setShowAddAsset(false);
  };

  const handleCreateLiability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiability.name.trim()) return;
    addLiability(newLiability);
    setShowAddLiability(false);
  };

  // 月還款試算公式
  const calculateEstimatedMonthly = (principal: number, rate: number, months: number) => {
    if (months <= 0 || principal <= 0) return 0;
    if (rate <= 0) return Math.round(principal / months);
    const monthlyRate = rate / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Coins className="w-6 h-6 text-emerald-400" />
          資產與負債明細管理 (Balance Sheet)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          盤點現有金融流動資產、不動產、負債攤還期數與年化複合收益率
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4">
          <div className="text-xs text-slate-400">總資產現值</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {formatNTD(totalAssetValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-x-2">
            <span>加權年報: <strong className="text-emerald-400">{formatPercent(blendedReturn)}</strong></span>
            <span>·</span>
            <span>組合波動(σ): <strong className="text-amber-400 font-mono">{formatPercent(portfolioVolatility)}</strong></span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <div className="text-xs text-slate-400">總剩餘負債</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {formatNTD(totalLiabilityValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            共 {liabilities.length} 筆負債攤還項目
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <div className="text-xs text-slate-400">家庭當前淨資產</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {formatNTD(netWorth)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            資產負債比: {totalAssetValue > 0 ? ((totalLiabilityValue / totalAssetValue) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Asset Allocation Pie Chart & Assets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800/80 pb-2">
            資產配置比例 (Asset Allocation)
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ASSET_COLORS[entry.category]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatNTD(Number(value)), '金額']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
                  formatter={(val) => <span className="text-slate-300">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>加權投資組合年報酬率:</span>
              <span className="font-mono text-emerald-400 font-semibold">{formatPercent(blendedReturn)}</span>
            </div>
            <div className="flex justify-between">
              <span>動態推算年化波動度 (σ):</span>
              <span className="font-mono text-amber-400 font-semibold">{formatPercent(portfolioVolatility)}</span>
            </div>
            <div className="flex justify-between">
              <span>非再投入現金股息率:</span>
              <span className="font-mono text-teal-400 font-semibold">{formatPercent(blendedDividendYield)}</span>
            </div>
          </div>
        </div>

        {/* Assets Management Table */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                金融資產明細 ({assets.length})
              </h2>
              <p className="text-xs text-slate-400">可自訂各類資產之期望年報酬率與股利再投入機制</p>
            </div>
            <button
              onClick={() => setShowAddAsset(!showAddAsset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增資產</span>
            </button>
          </div>

          {/* Add Asset Form */}
          {showAddAsset && (
            <form onSubmit={handleCreateAsset} className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
              <div className="font-semibold text-xs text-emerald-400">新增資產項目</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">資產名稱</label>
                  <input
                    type="text"
                    required
                    placeholder="例如: 0050 ETF"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">資產類別</label>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as AssetClass })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="EQUITY">股票 / 權益類 ETF</option>
                    <option value="BOND">債券 / 固定收益</option>
                    <option value="CASH">現金 / 活存備轉金</option>
                    <option value="REAL_ESTATE">不動產 / 房地產</option>
                    <option value="OTHER">其他資產</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">目前現值 (NTD)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={newAsset.currentValue}
                    onChange={(e) => setNewAsset({ ...newAsset, currentValue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">預期年化報酬率 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={(newAsset.expectedAnnualReturn * 100).toFixed(1)}
                    onChange={(e) => setNewAsset({ ...newAsset, expectedAnnualReturn: (parseFloat(e.target.value) || 0) / 100 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">預估現金殖利率 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={(newAsset.annualDividendYield * 100).toFixed(1)}
                    onChange={(e) => setNewAsset({ ...newAsset, annualDividendYield: (parseFloat(e.target.value) || 0) / 100 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newAsset.reinvestDividends}
                      onChange={(e) => setNewAsset({ ...newAsset, reinvestDividends: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-500"
                    />
                    <span>股息自動滾入再投入</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAsset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  確認新增
                </button>
              </div>
            </form>
          )}

          {/* Asset List */}
          <div className="space-y-2.5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ASSET_COLORS[asset.category] }}
                  />
                  <div>
                    <div className="font-semibold text-slate-200">{asset.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ASSET_NAMES[asset.category]} · 年報: {formatPercent(asset.expectedAnnualReturn)} · 殖利率: {formatPercent(asset.annualDividendYield)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-100">
                      {formatNTD(asset.currentValue)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {asset.reinvestDividends ? '股利再投入' : '股利轉現金流'}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="刪除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Liabilities Management */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-400" />
              負債明細與本息攤還計算機 ({liabilities.length})
            </h2>
            <p className="text-xs text-slate-400">房貸、車貸與信貸月付金，將按期數於時間軸精準扣減</p>
          </div>
          <button
            onClick={() => setShowAddLiability(!showAddLiability)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增負債</span>
          </button>
        </div>

        {/* Add Liability Form */}
        {showAddLiability && (
          <form onSubmit={handleCreateLiability} className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 space-y-3">
            <div className="font-semibold text-xs text-rose-400">新增負債項目</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">負債名稱</label>
                <input
                  type="text"
                  required
                  placeholder="自用住宅房貸"
                  value={newLiability.name}
                  onChange={(e) => setNewLiability({ ...newLiability, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">剩餘本金 (NTD)</label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={newLiability.principalRemaining}
                  onChange={(e) => {
                    const principal = parseFloat(e.target.value) || 0;
                    const autoPayment = calculateEstimatedMonthly(
                      principal,
                      newLiability.annualInterestRate,
                      newLiability.remainingMonths
                    );
                    setNewLiability({ ...newLiability, principalRemaining: principal, monthlyPayment: autoPayment });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">年利率 (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={(newLiability.annualInterestRate * 100).toFixed(2)}
                  onChange={(e) => {
                    const rate = (parseFloat(e.target.value) || 0) / 100;
                    const autoPayment = calculateEstimatedMonthly(
                      newLiability.principalRemaining,
                      rate,
                      newLiability.remainingMonths
                    );
                    setNewLiability({ ...newLiability, annualInterestRate: rate, monthlyPayment: autoPayment });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">剩餘期數 (月)</label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={newLiability.remainingMonths}
                  onChange={(e) => {
                    const months = parseInt(e.target.value) || 1;
                    const autoPayment = calculateEstimatedMonthly(
                      newLiability.principalRemaining,
                      newLiability.annualInterestRate,
                      months
                    );
                    setNewLiability({ ...newLiability, remainingMonths: months, monthlyPayment: autoPayment });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                自動試算每月本息攤還: <span className="text-rose-400 font-mono font-bold">{formatNTD(newLiability.monthlyPayment)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLiability(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  確認新增
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Liabilities List */}
        <div className="space-y-2.5">
          {liabilities.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-4 text-center">
              目前無任何負債記錄，財務零負擔。
            </div>
          ) : (
            liabilities.map((liab) => (
              <div
                key={liab.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{liab.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    年利率: {formatPercent(liab.annualInterestRate, 2)} · 剩餘期數: {liab.remainingMonths} 個月 ({(liab.remainingMonths / 12).toFixed(1)} 年)
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-mono font-bold text-rose-400">
                      本金 {formatNTD(liab.principalRemaining)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      月攤還約 {formatNTD(liab.monthlyPayment)} /月
                    </div>
                  </div>

                  <button
                    onClick={() => deleteLiability(liab.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="刪除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
