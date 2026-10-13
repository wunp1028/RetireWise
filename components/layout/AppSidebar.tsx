// components/layout/AppSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Coins,
  GraduationCap,
  Wallet,
  Settings,
  ShieldCheck,
  TrendingUp,
  Compass,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: '總覽儀表板',
    href: '/',
    icon: LayoutDashboard,
    badge: '即時試算',
  },
  {
    label: '新手指南與解讀',
    href: '/guide',
    icon: Compass,
    badge: '必看',
  },
  {
    label: '家庭基本設定',
    href: '/profile',
    icon: Users,
  },
  {
    label: '資產與負債管理',
    href: '/assets',
    icon: Coins,
  },
  {
    label: '教育與里程碑',
    href: '/milestones',
    icon: GraduationCap,
  },
  {
    label: '收支與退休年金',
    href: '/cashflow',
    icon: Wallet,
  },
  {
    label: '本機資料管理',
    href: '/settings',
    icon: Settings,
  },
];

interface AppSidebarProps {
  onCloseMobile?: () => void;
}

export default function AppSidebar({ onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950/90 border-r border-slate-800/80 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <TrendingUp className="w-6 h-6 text-slate-950 font-bold stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-white tracking-tight">RetireWise</span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">退休智囊 · 財務模擬</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          核心導航
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Local-First Privacy Callout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="rounded-xl p-3 bg-slate-900/90 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-slate-200">Local-First 隱私</div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              所有資產數據均存放於本機瀏覽器，零雲端外流。
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
