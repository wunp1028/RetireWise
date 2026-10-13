// app/settings/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Check,
  AlertTriangle,
  FileCode,
} from 'lucide-react';

export default function SettingsPage() {
  const { exportJSON, importJSON, resetToDefault, hasHydrated } = useFinanceStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!hasHydrated) return null;

  // 匯出 JSON
  const handleExport = () => {
    try {
      const jsonStr = exportJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.href = url;
      link.download = `retirewise_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: '已成功匯出完整財務模型備份檔案！' });
    } catch {
      setMessage({ type: 'error', text: '匯出備份檔案失敗，請稍後重試。' });
    }
  };

  // 匯入 JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importJSON(content);
      if (success) {
        setMessage({ type: 'success', text: '已成功匯入並還原財務模型！' });
      } else {
        setMessage({ type: 'error', text: '匯入失敗：JSON 格式無效或缺少必要欄位。' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 一鍵重置
  const handleReset = () => {
    resetToDefault();
    setShowResetConfirm(false);
    setMessage({ type: 'success', text: '已成功重置為台灣雙薪四口之家標準範例資料。' });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          本機資料備份與系統管理 (Local-First Data Management)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          管理您在本機瀏覽器中的完整家庭金融模型，提供單鍵備份、匯入復原與範本重置
        </p>
      </div>

      {/* Notification Banner */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. 資料備份與復原 */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            JSON 模型備份與匯入
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            您可以隨時將所有家庭成員、資產配置、負債明細、子女階段教育金與收支設定完整打包下載，便於跨裝置轉移或妥善封存。
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>匯出完整 JSON 備份</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>匯入還原 JSON 檔案</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* 2. 初始範本重置 */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            示範範本初始化
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            若您在試算過程調整過度混亂，可一鍵重置回預設「台灣雙薪四口之家標準範本」（包含 40 歲主要受薪者、兩名子女公私立學制、房貸與 ETF 資產配置）。
          </p>

          <div className="pt-2">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置為標準示範範本...</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <div className="text-xs text-rose-300 font-medium">
                  確定要重置嗎？現有自訂數值將被預設範本覆蓋。
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    確認重置
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Local-First 隱私架構說明卡片 */}
      <div className="glass-panel rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white">
            Local-First & 零外部遙測 (Zero Telemetry) 架構承諾
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          RetireWise 嚴格遵從本機優先（Local-First）原則設計：
        </p>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
          <li>所有家庭成員身分、薪資數據、敏感投資帳戶與負債資料，均僅存放於您當前瀏覽器的 LocalStorage 內部。</li>
          <li>本系統不設任何雲端資料庫、遠端後端 API 或追蹤像素（Telemetry Tracking）。</li>
          <li>離線環境或飛航模式下亦可完全順暢執行與動態演算。</li>
        </ul>
      </div>
    </div>
  );
}
