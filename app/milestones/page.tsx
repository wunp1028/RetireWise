// app/milestones/page.tsx
'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { Child, LifeEvent, ChildEducationStage } from '@/lib/engine/types';
import { formatNTD } from '@/lib/engine/inflation';
import {
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const PRESETS: Record<string, { label: string; stages: Omit<ChildEducationStage, 'id'>[] }> = {
  PUBLIC: {
    label: '標準公立體系 (幼兒園至大學)',
    stages: [
      { stageName: '國小階段', startAge: 7, endAge: 12, annualCostToday: 120000 },
      { stageName: '國中階段', startAge: 13, endAge: 15, annualCostToday: 180000 },
      { stageName: '公立高中', startAge: 16, endAge: 18, annualCostToday: 200000 },
      { stageName: '公立大學', startAge: 19, endAge: 22, annualCostToday: 280000 },
    ],
  },
  PRIVATE: {
    label: '私立/雙語體系 (私中至私立大學)',
    stages: [
      { stageName: '雙語國小', startAge: 7, endAge: 12, annualCostToday: 300000 },
      { stageName: '私立國中', startAge: 13, endAge: 15, annualCostToday: 380000 },
      { stageName: '私立高中', startAge: 16, endAge: 18, annualCostToday: 450000 },
      { stageName: '私立大學', startAge: 19, endAge: 22, annualCostToday: 550000 },
    ],
  },
  OVERSEAS: {
    label: '海內外菁英 (國內求學 + 海外研究所)',
    stages: [
      { stageName: '國小階段', startAge: 7, endAge: 12, annualCostToday: 180000 },
      { stageName: '國中階段', startAge: 13, endAge: 15, annualCostToday: 220000 },
      { stageName: '高中階段', startAge: 16, endAge: 18, annualCostToday: 260000 },
      { stageName: '國內大學', startAge: 19, endAge: 22, annualCostToday: 350000 },
      { stageName: '美加英澳留學碩士', startAge: 23, endAge: 24, annualCostToday: 1800000 },
    ],
  },
};

export default function MilestonesPage() {
  const {
    children,
    lifeEvents,
    family,
    addChild,
    deleteChild,
    addChildStage,
    deleteChildStage,
    addLifeEvent,
    deleteLifeEvent,
    hasHydrated,
  } = useFinanceStore();

  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(6);
  const [selectedPreset, setSelectedPreset] = useState<'PUBLIC' | 'PRIVATE' | 'OVERSEAS'>('PUBLIC');

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<LifeEvent, 'id'>>({
    name: '購車或換車計畫',
    occurAtAge: family.currentAge + 5,
    amount: -1000000,
    isAdjustedForInflation: true,
  });

  if (!hasHydrated) return null;

  const handleCreateChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const presetStages = PRESETS[selectedPreset].stages.map((st, idx) => ({
      ...st,
      id: `stage-init-${Date.now()}-${idx}`,
    }));

    addChild({
      name: newChildName,
      currentAge: newChildAge,
      educationStages: presetStages,
    });

    setNewChildName('');
    setShowAddChild(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name.trim()) return;
    addLifeEvent(newEvent);
    setShowAddEvent(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-emerald-400" />
          子女教育規劃與生命重大事件
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          支援多子女階段式教育經費疊加，以及換車、修繕、醫療準備等重大資金節點
        </p>
      </div>

      {/* Children Education Section */}
      <div className="glass-panel rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              子女階梯式教育基金規劃 ({children.length} 位)
            </h2>
            <p className="text-xs text-slate-400">
              各階段費用會於子女達對應年齡時精準納入當年度現金流支出，並計入通膨放大
            </p>
          </div>
          <button
            onClick={() => setShowAddChild(!showAddChild)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增子女</span>
          </button>
        </div>

        {/* Add Child Modal / Inline */}
        {showAddChild && (
          <form onSubmit={handleCreateChild} className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40 space-y-3">
            <div className="font-semibold text-xs text-indigo-400">新增子女與套用學制範本</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">子女暱稱</label>
                <input
                  type="text"
                  required
                  placeholder="大寶 / 二寶"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">目前年齡 (歲)</label>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">套用預設學制範本</label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="PUBLIC">{PRESETS.PUBLIC.label}</option>
                  <option value="PRIVATE">{PRESETS.PRIVATE.label}</option>
                  <option value="OVERSEAS">{PRESETS.OVERSEAS.label}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddChild(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                確認新增
              </button>
            </div>
          </form>
        )}

        {/* Children List */}
        <div className="space-y-4">
          {children.length === 0 ? (
            <div className="text-xs text-slate-500 italic p-4 text-center">
              目前未設定任何子女教育支出。
            </div>
          ) : (
            children.map((child) => {
              const totalEstCost = child.educationStages.reduce(
                (sum, s) => sum + s.annualCostToday * (s.endAge - s.startAge + 1),
                0
              );

              return (
                <div key={child.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {child.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-200">
                          {child.name} <span className="text-xs font-normal text-slate-400">({child.currentAge} 歲)</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          總教育金現值估算: <span className="text-indigo-400 font-mono font-medium">{formatNTD(totalEstCost)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteChild(child.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="刪除子女"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stages List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    {child.educationStages.map((stage) => {
                      const isPast = child.currentAge > stage.endAge;
                      const isCurrent = child.currentAge >= stage.startAge && child.currentAge <= stage.endAge;

                      return (
                        <div
                          key={stage.id}
                          className={`p-2.5 rounded-lg border ${
                            isCurrent
                              ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200'
                              : isPast
                              ? 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                              : 'bg-slate-950/80 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center font-medium">
                            <span>{stage.stageName}</span>
                            <span className="text-[10px] font-mono">
                              {stage.startAge}-{stage.endAge}歲
                            </span>
                          </div>
                          <div className="mt-1 font-mono font-bold text-slate-200">
                            {formatNTD(stage.annualCostToday)} <span className="text-[10px] font-normal text-slate-400">/年</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {isPast ? '已度過' : isCurrent ? '進行中' : `距今 ${stage.startAge - child.currentAge} 年`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Major Life Events Section */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              重大生命里程碑事件 ({lifeEvents.length} 項)
            </h2>
            <p className="text-xs text-slate-400">
              設定特定年齡發生之購車、換屋裝潢、父母長照準備金或單筆遺產繼承
            </p>
          </div>
          <button
            onClick={() => setShowAddEvent(!showAddEvent)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增里程碑</span>
          </button>
        </div>

        {/* Add Event Form */}
        {showAddEvent && (
          <form onSubmit={handleCreateEvent} className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span className="font-semibold text-xs text-amber-400">新增重大生命里程碑事件</span>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-500">快速範本:</span>
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      name: '換小房(Downsizing)套現回流',
                      occurAtAge: 68,
                      amount: 5000000,
                      isAdjustedForInflation: false,
                    })
                  }
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 transition-colors"
                >
                  🏡 換小房套現 (+500萬)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      name: '以房養老逆向抵押融通',
                      occurAtAge: 70,
                      amount: 3000000,
                      isAdjustedForInflation: false,
                    })
                  }
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                >
                  🏦 以房養老 (+300萬)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent({
                      name: '家庭休旅車置換',
                      occurAtAge: Math.min(family.lifeExpectancy, family.currentAge + 6),
                      amount: -1200000,
                      isAdjustedForInflation: true,
                    })
                  }
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
                >
                  🚗 換新車 (-120萬)
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">事件名稱</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 換休旅車"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">本人發生年齡 (歲)</label>
                <input
                  type="number"
                  min={family.currentAge}
                  max={family.lifeExpectancy}
                  value={newEvent.occurAtAge}
                  onChange={(e) => setNewEvent({ ...newEvent, occurAtAge: parseInt(e.target.value) || family.currentAge })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">金額 NTD (負為支出，正為收入)</label>
                <input
                  type="number"
                  step="50000"
                  value={newEvent.amount}
                  onChange={(e) => setNewEvent({ ...newEvent, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newEvent.isAdjustedForInflation}
                    onChange={(e) => setNewEvent({ ...newEvent, isAdjustedForInflation: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500"
                  />
                  <span>隨通膨指數調整金額</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddEvent(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
              >
                確認新增
              </button>
            </div>
          </form>
        )}

        {/* Events List */}
        <div className="space-y-2.5">
          {lifeEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-mono font-bold text-xs">
                  {ev.occurAtAge} 歲
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{ev.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    距今 {ev.occurAtAge - family.currentAge} 年 · {ev.isAdjustedForInflation ? '計入通膨放大' : '固定現值'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <div className="text-right">
                  <div
                    className={`font-mono font-bold ${
                      ev.amount >= 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {ev.amount >= 0 ? `+${formatNTD(ev.amount)}` : formatNTD(ev.amount)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {ev.amount >= 0 ? '單筆資金流入' : '專案單筆支出'}
                  </div>
                </div>

                <button
                  onClick={() => deleteLifeEvent(ev.id)}
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
  );
}
