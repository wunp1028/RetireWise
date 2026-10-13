// app/profile/page.tsx
'use client';

import React from 'react';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { Users, Calendar, Percent, Heart, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { family, updateFamilyProfile, updateSpouseProfile, hasHydrated } = useFinanceStore();

  if (!hasHydrated) return null;

  const currentYear = 2026;
  const yearsToRetirement = Math.max(0, family.retirementAge - family.currentAge);
  const yearsInRetirement = Math.max(0, family.lifeExpectancy - family.retirementAge);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-400" />
          家庭成員年齡與總體經濟參數
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          設定本人與配偶的關鍵生命週期時間軸、預估壽命與長期通貨膨脹率
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. 本人基本時間軸 */}
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              本人生命週期規劃 (主要經濟支柱)
            </h2>

            {/* 當前年齡 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">本人當前年齡</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {family.currentAge} 歲 (西元 {currentYear} 年)
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={family.currentAge}
                onChange={(e) => updateFamilyProfile({ currentAge: parseInt(e.target.value) })}
                className="w-full h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>20 歲</span>
                <span>45 歲</span>
                <span>70 歲</span>
              </div>
            </div>

            {/* 預計退休年齡 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">預計退休年齡</span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {family.retirementAge} 歲 (西元 {currentYear + yearsToRetirement} 年)
                </span>
              </div>
              <input
                type="range"
                min={Math.max(40, family.currentAge)}
                max="75"
                value={family.retirementAge}
                onChange={(e) => updateFamilyProfile({ retirementAge: parseInt(e.target.value) })}
                className="w-full h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{family.currentAge} 歲 (當前)</span>
                <span>65 歲 (法定標準)</span>
                <span>75 歲</span>
              </div>
            </div>

            {/* 預期壽命終點 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">預期壽命終點</span>
                <span className="font-mono text-cyan-400 font-bold text-sm">
                  {family.lifeExpectancy} 歲 (模擬結束年份)
                </span>
              </div>
              <input
                type="range"
                min={Math.max(70, family.retirementAge + 5)}
                max="100"
                value={family.lifeExpectancy}
                onChange={(e) => updateFamilyProfile({ lifeExpectancy: parseInt(e.target.value) })}
                className="w-full h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>70 歲</span>
                <span>85 歲 (台灣平均壽命)</span>
                <span>100 歲</span>
              </div>
            </div>
          </div>

          {/* 2. 配偶參數 (選填) */}
          <div className="glass-panel rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                配偶協同規劃 (雙薪合夥)
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={!!family.spouse}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateSpouseProfile({
                        currentAge: Math.max(20, family.currentAge - 2),
                        retirementAge: family.retirementAge,
                        lifeExpectancy: 88,
                      });
                    } else {
                      updateSpouseProfile(undefined);
                    }
                  }}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>啟用配偶時間軸</span>
              </label>
            </div>

            {family.spouse ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">配偶當前年齡</span>
                    <span className="font-mono text-rose-400 font-bold">
                      {family.spouse.currentAge} 歲
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="70"
                    value={family.spouse.currentAge}
                    onChange={(e) =>
                      updateSpouseProfile({ currentAge: parseInt(e.target.value) })
                    }
                    className="w-full h-2 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">配偶退休年齡</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {family.spouse.retirementAge} 歲
                    </span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="75"
                    value={family.spouse.retirementAge}
                    onChange={(e) =>
                      updateSpouseProfile({ retirementAge: parseInt(e.target.value) })
                    }
                    className="w-full h-2 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">配偶預期壽命</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {family.spouse.lifeExpectancy} 歲
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="100"
                    value={family.spouse.lifeExpectancy}
                    onChange={(e) =>
                      updateSpouseProfile({ lifeExpectancy: parseInt(e.target.value) })
                    }
                    className="w-full h-2 cursor-pointer"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                目前為單人財務模擬模型。勾選上方核取方塊可開啟配偶雙人協同時間軸。
              </p>
            )}
          </div>

          {/* 3. 總體通膨率設定 */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-2">
              <Percent className="w-4 h-4 text-amber-400" />
              長期預期通貨膨脹率 (常態生活費年增率)
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">預期年通膨率</span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  {(family.inflationRate * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.001"
                value={family.inflationRate}
                onChange={(e) =>
                  updateFamilyProfile({ inflationRate: parseFloat(e.target.value) })
                }
                className="w-full h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0.5% (極低通膨)</span>
                <span>2.0% (央行長期目標)</span>
                <span>5.0% (高通膨壓力)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              💡 系統將使用此比率每年對家庭生活開支、子女教育費用與重大事件進行複利通膨調整。
            </p>
          </div>
        </div>

        {/* Right Col: Timeline Summary Card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              時間軸統計指標
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400">在職累積年數 (距退休)</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {yearsToRetirement} 年
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  自 {family.currentAge} 歲工作至 {family.retirementAge} 歲
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400">退休後存續年數</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-1">
                  {yearsInRetirement} 年
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  自 {family.retirementAge} 歲生活至 {family.lifeExpectancy} 歲
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400">全模擬總時間長度</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                  {family.lifeExpectancy - family.currentAge + 1} 個年度
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  西元 {currentYear} 年 ～ {currentYear + (family.lifeExpectancy - family.currentAge)} 年
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
