// components/layout/Navbar.tsx
'use client';

import React from 'react';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { ScenarioType } from '@/lib/engine/types';
import { formatNTD } from '@/lib/engine/inflation';
import { Menu, Sparkles, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export default function Navbar({ onToggleMobileMenu }: NavbarProps) {
  const { family, assets, liabilities, scenario, setScenario, hasHydrated } = useFinanceStore();

  const totalAssets = assets.reduce((sum, a) => sum + Math.max(0, a.currentValue), 0);
  const totalLiab = liabilities.reduce((sum, l) => sum + Math.max(0, l.principalRemaining), 0);
  const netWorth = totalAssets - totalLiab;

  const scenarios: { id: ScenarioType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'BASE',
      label: '基準',
      desc: '基準正常經濟成長',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    },
    {
      id: 'BEAR',
      label: '悲觀',
      desc: '悲觀停滯性通膨 (報酬-2%, 通膨+1%)',
      icon: <TrendingDown className="w-3.5 h-3.5 text-rose-400" />,
      color: 'border-rose-500/40 text-rose-300 bg-rose-500/10',
    },
    {
      id: 'BULL',
      label: '樂觀',
      desc: '樂觀大牛市繁榮 (報酬+2%, 通膨-0.5%)',
      icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />,
      color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10',
    },
  ];

  return (
    <header className="h-16 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
          aria-label="打開選單"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
            <span className="text-slate-500">年齡目標:</span>
            <span className="font-semibold text-slate-200">
              {hasHydrated ? `${family.currentAge} 歲 → 退休 ${family.retirementAge} 歲` : '載入中...'}
            </span>
          </span>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
            <span className="text-slate-500">當前淨資產:</span>
            <span className="font-semibold text-emerald-400 font-mono">
              {hasHydrated ? formatNTD(netWorth, true) : '...'}
            </span>
          </span>
        </div>
      </div>

      {/* Scenario Switcher Buttons */}
      <div className="flex items-center gap-2">
        <span className="hidden md:inline text-xs text-slate-400 mr-1 font-medium">情境模擬:</span>
        <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          {scenarios.map((sc) => {
            const isSelected = scenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                title={sc.desc}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? `${sc.color} shadow-sm border`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {sc.icon}
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-500 pl-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>本機儲存</span>
        </div>
      </div>
    </header>
  );
}
