// app/guide/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  DollarSign,
  Activity,
  FileText,
  Lock,
  ChevronRight,
  Users,
  Coins,
  GraduationCap,
  Wallet,
  Settings,
  Scale,
  RefreshCw,
} from 'lucide-react';

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'sop' | 'metrics' | 'features' | 'glossary' | 'faq'>('sop');

  return (
    <div className="space-y-6 pb-12">
      {/* 頂部歡迎 Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-slate-800">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>新手必看 · 全站使用導覽與指標字典</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            RetireWise 新手快速上手指南與解讀手冊
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            歡迎來到 RetireWise！這是一套專為現代家庭財務長設計的動態退休試算系統。本頁面將帶您以 4 個簡單步驟完成家庭設定，並詳細為您拆解儀表板上每一個數字背後的意義與財務決策建議。
          </p>
        </div>

        {/* 快捷切換 Tab */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-800/80 mt-6 relative z-10">
          {[
            { id: 'sop', label: '🚀 新手設定 4 步驟 (SOP)', icon: Compass },
            { id: 'metrics', label: '📊 關鍵指標看盤解讀', icon: TrendingUp },
            { id: 'features', label: '🛠️ 核心功能操作詳解', icon: Sparkles },
            { id: 'glossary', label: '📖 財務名詞與公式辭典', icon: BookOpen },
            { id: 'faq', label: '❓ 常見問題 (FAQ)', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 背景光暈裝飾 */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 內容區塊 1: 新手設定 4 步驟 SOP */}
      {activeTab === 'sop' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>第一次進來該如何設定？照著走只需 3 分鐘</span>
            </h2>
            <span className="text-xs text-slate-400">標準作業流程 (SOP)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 relative group hover:border-emerald-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                  STEP 01
                </span>
                <Link
                  href="/profile"
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                >
                  <span>前往設定</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>家庭基本設定 (Profile)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                建立個人或夫妻兩人的年齡軸與目標：
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>填寫<strong>當前年齡</strong>（例如：38 歲）。</li>
                <li>設定預期的<strong>目標退休年齡</strong>（例如：60 歲）。</li>
                <li>設定<strong>預期壽命</strong>（建議預設 90 歲以留有長壽安全緩衝）。</li>
                <li>設定當前夫妻每月的<strong>工作稅後淨收入</strong>。</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 relative group hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                  STEP 02
                </span>
                <Link
                  href="/assets"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <span>前往設定</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Coins className="w-4 h-4 text-cyan-400" />
                <span>盤點資產與負債 (Assets & Debts)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                釐清您目前起跑點的真實淨資產（Net Worth）：
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>金融資產</strong>：活存、定存、0050/VT 股票 ETF、債券、基金等。</li>
                <li>輸入各項資產的<strong>預估年化報酬率</strong>與<strong>股利再投入機制</strong>。</li>
                <li><strong>房地產與自住房</strong>：登記現值與增值率。</li>
                <li><strong>負債管理</strong>：房貸剩餘本金、年利率與每月房貸本利攤銷額。</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 relative group hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold">
                  STEP 03
                </span>
                <Link
                  href="/milestones"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                >
                  <span>前往設定</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>教育金階梯與里程碑 (Milestones)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                人生的支出不是一條平線，設定階段性大筆開銷：
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>子女教育金</strong>：輸入孩子目前歲數，系統會精準推算國小、高中、大學各階段額外學雜費。</li>
                <li><strong>一次性里程碑</strong>：換車（每10年支出100萬）、長照醫療儲備金。</li>
                <li><strong>房產活化</strong>：可設定 65 歲「以房養老」或 70 歲「換小房套現」。</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 relative group hover:border-amber-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold">
                  STEP 04
                </span>
                <Link
                  href="/cashflow"
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                >
                  <span>前往設定</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>日常收支與退休年金 (Cashflow)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                校正生活開銷與退休後的被動現金流入：
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>填寫<strong>目前日常家庭月開銷</strong>與<strong>退休後預期基本生活費</strong>。</li>
                <li>輸入預估的<strong>勞保年金</strong>與<strong>勞退新制月退休金</strong>。</li>
                <li>啟用<strong>「勞保改革打折壓力測試」</strong>（例如設定 7 折或 8 折）。</li>
                <li>啟用<strong>「退休支出微笑曲線」</strong>（動態還原活力期與照護期開銷）。</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>設定完成後，點擊「總覽儀表板」，所有動態時間軸圖表與蒙地卡羅壓力測試即刻為您精算完成！</span>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 flex-shrink-0 transition-colors"
            >
              <span>查看儀表板</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 內容區塊 2: 關鍵指標看盤解讀 */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">
              儀表板上的數字該怎麼看？（關鍵指標看盤指南）
            </h2>
            <span className="text-xs text-slate-400">指標代表意義與判讀標準</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KPI 1: 預估資產峰值 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>預估資產峰值 (Peak Net Worth)</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono">
                  高資產頂點
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>定義：</strong>您一生中累積財富的最高峰水位與發生的年齡（通常發生在剛退休前後，即工作收入累積完畢、開始轉為純提領的前夕）。
              </p>
              <div className="p-3 rounded-xl bg-slate-900/90 text-xs space-y-1 text-slate-400">
                <div className="text-slate-200 font-semibold">💡 判讀建議：</div>
                <div>若峰值金額過低，代表累積期複利效能不足；若峰值過高（例如累積至上億但晚年留下過多），可思考是否適度放寬生前生活品質或提前退休。</div>
              </div>
            </div>

            {/* KPI 2: 資產存續狀態 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>資產存續狀態 (Longevity Status)</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                  長壽風險檢視
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>定義：</strong>依據您的收支與投資報酬率，資產能否一路安度晚年直到設定的壽命終點（如 90 歲）。
              </p>
              <div className="p-3 rounded-xl bg-slate-900/90 text-xs space-y-1 text-slate-400">
                <div className="text-slate-200 font-semibold">💡 判讀建議：</div>
                <div>
                  • 顯示 <span className="text-cyan-400 font-semibold">「安全存續至 90 歲+」</span>：恭喜，您的財務防火牆非常穩健！<br />
                  • 顯示 <span className="text-rose-400 font-semibold">「預估 78 歲資產耗盡」</span>：代表退休金提領速度大於資產滾存速度，需降低生活費或延後退休。
                </div>
              </div>
            </div>

            {/* KPI 3: 蒙地卡羅破產率 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>蒙地卡羅破產率 (Ruin Probability)</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono">
                  1,000次隨機擾動
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>定義：</strong>在電腦模擬的 1,000 種不同市場牛熊走勢中，退休金在壽命結束前提前歸零的比率。
              </p>
              <div className="p-3 rounded-xl bg-slate-900/90 text-xs space-y-1.5 text-slate-400">
                <div className="text-slate-200 font-semibold">💡 標準對照表：</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="text-emerald-400 font-semibold">&lt; 5%：極度安全（首選）</span>
                  <span className="text-cyan-400 font-semibold">5% ~ 15%：健康範圍</span>
                  <span className="text-amber-400 font-semibold">15% ~ 25%：需提高警覺</span>
                  <span className="text-rose-400 font-semibold">&gt; 25%：高風險（需調整）</span>
                </div>
              </div>
            </div>

            {/* KPI 4: 4% 安全提領額與 FIRE 達成率 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  <span>4% 安全提領額 (SWR) & FIRE 覆蓋率</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                  財務自由指標
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>定義：</strong>根據三一大學研究（Trinity Study），退休首年可自金融資產安全提領 4% 作為生活費，且高機率 30 年不破產。
              </p>
              <div className="p-3 rounded-xl bg-slate-900/90 text-xs space-y-1 text-slate-400">
                <div className="text-slate-200 font-semibold">💡 判讀建議：</div>
                <div>
                  • <strong>FIRE 覆蓋率 &ge; 100%</strong>：代表純靠資產 4% 提領就足以完全支付退休生活開銷，已達到「純財務自由」境界！<br />
                  • 若低於 100%，不足部分需依賴勞保勞退年金或主動收入補足。
                </div>
              </div>
            </div>

            {/* KPI 5: 宏觀情境三種切換 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>基準 (Base) / 悲觀 (Bear) / 樂觀 (Bull) 情境切換</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
                  宏觀景氣壓力測試
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <div className="font-bold text-emerald-400">1. 基準情境 (Base)</div>
                  <div className="text-slate-400">使用您自訂的預期報酬率與 2% 正常溫和通膨，代表基準經濟常態。</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                  <div className="font-bold text-rose-400">2. 悲觀情境 (Bear)</div>
                  <div className="text-slate-400">模擬停滯性通膨：投資報酬率全面<strong>扣除 2%</strong>，通膨率<strong>增加 1%</strong>（雙重夾擊）。</div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                  <div className="font-bold text-cyan-400">3. 樂觀情境 (Bull)</div>
                  <div className="text-slate-400">模擬大牛市繁榮：投資報酬率<strong>增加 2%</strong>，通膨溫和下降 0.5%。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 內容區塊 3: 核心功能操作詳解 */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">
              RetireWise 獨家強大功能操作詳解
            </h2>
            <span className="text-xs text-slate-400">決策工具指南</span>
          </div>

          <div className="space-y-3">
            {/* Feature 1 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-sky-400" />
                  <span>計畫 A / 計畫 B (Plan B) 雙軌同圖即時對比</span>
                </h3>
                <span className="text-xs text-sky-400 font-mono">決策神器</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                想知道「如果我早 3 年退休，資產會差多少？」或「如果我換屋買 2,500 萬房子，晚年會破產嗎？」<br />
                <strong>操作步驟：</strong>
              </p>
              <ol className="text-xs text-slate-400 space-y-1 list-decimal list-inside pl-1">
                <li>在首頁點選「儲存當前為計畫 B 快照」。</li>
                <li>此時系統會將現狀鎖定為天藍色虛線（計畫 B 基準線）。</li>
                <li>自由滑動退休年齡、增減房產或調降生活費，主圖表會同時畫出「綠色實線（目前調整）」與「天藍色虛線（原計畫）」，雙軌走勢一目了然！</li>
              </ol>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>退休支出「微笑曲線」(Spending Smile)</span>
                </h3>
                <span className="text-xs text-indigo-400 font-mono">真實支出模型</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                很多傳統試算器假設 60 歲到 90 歲每個月花費一模一樣，這與真實人性嚴重脫節。開啟「微笑曲線」後，系統會自動套用三階段生活費：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-emerald-400">1. Go-Go 活力期 (105%)</div>
                  <div className="text-slate-400">60 ~ 69 歲：剛退休體力好，旅遊、交友、圓夢支出較多。</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-slate-300">2. Slow-Go 平緩期 (82%)</div>
                  <div className="text-slate-400">70 ~ 79 歲：生活作息穩定，社交與長途旅行減少，開銷最低。</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-rose-400">3. No-Go 照護期 (95%)</div>
                  <div className="text-slate-400">80 歲以上：行動受限，但醫療、保健品、居家看護開銷上升。</div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>台灣勞保年金改革打折開關 (100% ~ 70%)</span>
                </h3>
                <span className="text-xs text-amber-400 font-mono">政策壓力測試</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                面對台灣少子化與勞保潛藏負債，若未來政府進行年金改革，您的退休計畫經得起考驗嗎？<br />
                在「收支與退休年金」頁面或首頁快速開關，可一鍵切換 <strong>全額 (100%)、9折 (90%)、8折 (80%)、7折 (70%)</strong>，即刻檢驗若勞保縮水，家庭資產是否依然能在 90 歲前維持安全存續。
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>A4 財務健檢報告匯出與列印</span>
                </h3>
                <span className="text-xs text-cyan-400 font-mono">離線報告</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                在首頁主圖表右上角，點選 <strong>「列印/PDF」</strong> 按鈕，系統會自動過濾非必要按鈕與側邊欄，直接調用瀏覽器列印對話框，將整年度的資產消長走勢、破產率與配置轉換為極具質感的 A4 PDF 報告，方便夫妻共同檢視或留檔備存。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 內容區塊 4: 財務名詞與公式辭典 */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">
              專有名詞與金融工程演算法辭典
            </h2>
            <span className="text-xs text-slate-400">學術理論與定義</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400 text-sm">蒙地卡羅模擬 (Monte Carlo Simulation)</div>
              <p className="text-slate-300 leading-relaxed">
                起源於曼哈頓計畫的一種機率演算法。在真實世界中，股市每年的報酬率並非固定的平均值，而是上下劇烈跳動的常態分佈。系統運用 1,000 次隨機擾動模擬各種景氣循環，精確捕捉在極端空頭下的存續機率。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-rose-400 text-sm">報酬順序風險 (Sequence of Returns Risk)</div>
              <p className="text-slate-300 leading-relaxed">
                退休理財中最危險的隱形殺手。即使長年平均報酬率相同，若「剛退休前 5 年」不幸遇上大崩盤且被迫賣股提領生活費，本金將永久受損而極早破產；反之若晚年才遇崩盤則安然無恙。這就是為什麼需要蒙地卡羅壓測的原因。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-cyan-400 text-sm">年化波動度 (σ, Volatility)</div>
              <p className="text-slate-300 leading-relaxed">
                衡量投資組合年度報酬率上下震盪劇烈程度的統計標準差。波動度越高，代表好年賺得極多、壞年跌得極深。本系統會依據您的現金 (1%)、債券 (7%)、房地產 (8%) 與股票 (20%) 自動推導理論年化波動率，並給予多資產分散風險折讓。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-indigo-400 text-sm">實質報酬率與通膨平減 (Fisher Equation)</div>
              <p className="text-slate-300 leading-relaxed">
                通膨會逐年侵蝕貨幣購買力。若名目投資報酬率為 6%，通膨率為 2%，實質報酬率為：(1 + 0.06) / (1 + 0.02) - 1 ≈ 3.92%。本系統在時間軸演算中，所有收支與資產均經由逐年通膨平減，保證呈現真實購買力。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-amber-400 text-sm">4% 安全提領法則 (Trinity Study)</div>
              <p className="text-slate-300 leading-relaxed">
                美國三一大學學者針對近百年歷史回測發表的著名法則。結論指出，退休者首年從股債配置組合中提取 4% 資金，往後每年按通膨率調整提領額，在 30 年內資產未耗盡的機率高達 95% 以上。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="font-bold text-purple-400 text-sm">Local-First (本機優先架構)</div>
              <p className="text-slate-300 leading-relaxed">
                一種現代前端軟體架構哲學。使用者的私密財務數據絕不傳送至遠端伺服器，直接讀寫瀏覽器儲存區。擁有「隱私零洩漏」、「斷網可離線使用」與「秒級即時響應」三大絕對優勢。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 內容區塊 5: 常見問題 FAQ */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">
              新手常見問題與使用疑難排解 (FAQ)
            </h2>
            <span className="text-xs text-slate-400">解答您的疑惑</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">Q</span>
                <span>我換了手機或電腦，我在網頁上輸入的數據還會在嗎？</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                因為本系統採取高隱私的 Local-First 本機儲存，資料只存在您當前設備的瀏覽器（`localStorage`）中。若您換了手機或清除瀏覽器快取，資料不會自動同步。<strong>建議您可在「本機資料管理」頁面點選「匯出備份 JSON」，將設定檔存下或傳送到另一台設備「匯入還原」！</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px]">Q</span>
                <span>如果我把網址分享給朋友，朋友會看到我的薪水跟資產嗎？</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                <strong>絕對不會！請放一百個心。</strong> 每個人點開該網址，讀取的都是該人自己手機內的儲存區。朋友第一次點開只會看到預設的示範家庭資料，絕不會看到您的任何個人隱私。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[11px]">Q</span>
                <span>如果我的蒙地卡羅模擬破產率超過 20%，我該怎麼辦？</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                請不要慌張，這代表目前的計畫對市場風險抵抗力偏弱。您可以透過三種手段顯著降低破產率：
                <br />1. <strong>延後退休 1~2 年</strong>：多累積 2 年工作現金流並減少 2 年純提領期，破產率通常直接減半。
                <br />2. <strong>微調退休生活費</strong>：稍微調降每月非必要娛樂支出。
                <br />3. <strong>提高股債分散度</strong>：若資產過度集中在單一個股，可轉配置至全市場分散型 ETF（如 0050 或 VT）。
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="font-bold text-slate-100 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">Q</span>
                <span>系統預設的「年化波動度」滑桿是多少？我需要去改動它嗎？</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">
                系統會在蒙地卡羅卡片上方自動為您推算目前配置的年化波動度（例如「配置推算: 14.8%」）。滑桿維持在推算值即可。若您想測試更極端的大海嘯壓力測試，可手動將滑桿往右拉到 25% 或 30%，觀察最嚴苛的極端情況。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 底部導覽回首頁按鈕 */}
      <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          準備好規劃您的家庭財務了嗎？隨時可回到儀表板開始操作。
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
        >
          <span>前往總覽儀表板開始規劃</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
