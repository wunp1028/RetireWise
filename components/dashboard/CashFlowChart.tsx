// components/dashboard/CashFlowChart.tsx
'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { YearlyProjection } from '@/lib/engine/types';
import { formatNTD } from '@/lib/engine/inflation';

interface CashFlowChartProps {
  projections: YearlyProjection[];
  retirementAge: number;
}

export default function CashFlowChart({ projections, retirementAge }: CashFlowChartProps) {
  const [viewMode, setViewMode] = useState<'stacked' | 'net'>('stacked');

  const formatYAxis = (val: number) => {
    if (Math.abs(val) >= 100000000) {
      return `${(val / 100000000).toFixed(1)}億`;
    }
    return `${(val / 10000).toFixed(0)}萬`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: YearlyProjection = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-xl text-xs space-y-2 shadow-xl border border-slate-700 min-w-[220px]">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1 font-semibold text-slate-200">
            <span>{data.age} 歲 ({data.calendarYear} 年)</span>
            <span className="text-[10px] text-slate-400">{data.isRetired ? '退休' : '在職'}</span>
          </div>

          <div className="space-y-1 text-[11px] font-mono">
            <div className="text-emerald-400 font-semibold flex justify-between">
              <span>總收入:</span>
              <span>{formatNTD(data.totalIncome)}</span>
            </div>
            <div className="pl-2 text-slate-400 flex justify-between">
              <span>• 工作薪資:</span>
              <span>{formatNTD(data.salaryIncome)}</span>
            </div>
            {data.pensionIncome > 0 && (
              <div className="pl-2 text-slate-400 flex justify-between">
                <span>• 退休年金:</span>
                <span>{formatNTD(data.pensionIncome)}</span>
              </div>
            )}
            {data.dividendCashflow > 0 && (
              <div className="pl-2 text-slate-400 flex justify-between">
                <span>• 被動股息:</span>
                <span>{formatNTD(data.dividendCashflow)}</span>
              </div>
            )}

            <div className="text-rose-400 font-semibold flex justify-between pt-1 border-t border-slate-800">
              <span>總支出:</span>
              <span>{formatNTD(data.totalExpenses)}</span>
            </div>
            <div className="pl-2 text-slate-400 flex justify-between">
              <span>• 常態生活費:</span>
              <span>{formatNTD(data.livingExpenses)}</span>
            </div>
            {data.childEducationExpenses > 0 && (
              <div className="pl-2 text-amber-300 flex justify-between">
                <span>• 子女教育費:</span>
                <span>{formatNTD(data.childEducationExpenses)}</span>
              </div>
            )}
            {data.liabilityPayments > 0 && (
              <div className="pl-2 text-slate-400 flex justify-between">
                <span>• 房貸本息:</span>
                <span>{formatNTD(data.liabilityPayments)}</span>
              </div>
            )}
            {data.milestoneExpenses !== 0 && (
              <div className="pl-2 text-indigo-300 flex justify-between">
                <span>• 里程碑專案:</span>
                <span>{formatNTD(data.milestoneExpenses)}</span>
              </div>
            )}

            <div className="flex justify-between pt-1.5 border-t border-slate-700 font-bold">
              <span>年度淨現金差額:</span>
              <span className={data.netSavings >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
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
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            年度現金流結構疊加圖 (Annual Cash Flow Breakdown)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            精準拆解家庭薪資、年金收入 vs 常態生活、階梯子女教育與房貸本息
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'stacked' ? 'net' : 'stacked')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {viewMode === 'stacked' ? '切換至淨儲蓄走勢' : '切換至各項開支拆解'}
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projections} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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

            {viewMode === 'stacked' ? (
              <>
                <Bar dataKey="totalIncome" name="年度總收入" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="livingExpenses" name="常態生活支出" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="childEducationExpenses" name="子女教育支出" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Bar dataKey="liabilityPayments" name="房貸負債還款" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={16} />
              </>
            ) : (
              <Bar
                dataKey="netSavings"
                name="年度淨儲蓄(盈餘/赤字)"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
