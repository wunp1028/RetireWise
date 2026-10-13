# 🌟 RetireWise (退休智囊)

> **退休資產與家庭現金流動態模擬平台**  
> 基於 Local-First 高隱私財務工程架構，支援子女教育金階梯支出、負債攤銷、勞保年金改革打折與蒙地卡羅千次壓力測試模擬。

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## ✨ 核心特色與亮點

1. 🔒 **Local-First 零洩漏隱私安全**
   - 所有家庭成員年齡、敏感資產數據與現金流皆存放於使用者瀏覽器的 `localStorage`。
   - 不設任何雲端資料庫與外部遙測追蹤，任何訪客開啟網站都是完全獨立隔離的環境。

2. 📈 **動態時間軸逐年複利與現金流模擬**
   - 拒絕粗糙的靜態除法公式，自「當前年齡」逐年演算至預期壽命。
   - 精確模擬資產增長、退休轉折點與終身資產消長。

3. 🎲 **蒙地卡羅千次壓力測試 (Monte Carlo Simulation)**
   - 內建 1,000 次隨機擾動路徑演算（Box-Muller 正態變換 + Mulberry32 確定性種子 PRNG）。
   - 提供 10% 悲觀、50% 中位數、90% 樂觀分位數走勢與破產機率評估。
   - 支援依資產配置自動推算投資組合年化波動度 ($\sigma$) 與手動壓力測試滑桿。

4. 🛡️ **台灣在地化退休制度與支出曲線**
   - **勞保改革打折壓力測試**：支援 100%、90%、80%、70% 打折試算。
   - **退休支出微笑曲線**：活耀期 (Go-Go, 105%)、平緩期 (Slow-Go, 82%)、照護期 (No-Go, 95%)。

5. 🔥 **4% 安全提領法則 (SWR) 與 FIRE 指標**
   - 即時計算退休首年安全提領金與 FIRE 財務自由覆蓋率。

6. ⚖️ **計畫 A / 計畫 B (Plan B) 雙軌快照同圖對比**
   - 一鍵將當前配置儲存為「計畫 B 快照」，調整參數時同圖即時疊加雙曲線對照。

7. 📱 **全裝置 RWD 完美響應式適配**
   - 完美適配手機（iPhone / Android）、平板與桌機。
   - 支援一鍵生成 A4 格式 PDF 財務健康報告。

---

## 🛠️ 技術棧 (Tech Stack)

- **框架**：[Next.js 16 (App Router)](https://nextjs.org/)
- **語言**：[TypeScript](https://www.typescriptlang.org/)
- **樣式**：[Tailwind CSS](https://tailwindcss.com/) + 深色毛玻璃美學 (Dark Glassmorphism)
- **狀態管理**：[Zustand](https://github.com/pmndrs/zustand) (with `persist` middleware)
- **圖表函式庫**：[Recharts](https://recharts.org/)
- **圖示庫**：[Lucide React](https://lucide.dev/)

---

## 🚀 本地開發 (Local Development)

```bash
# 1. 安裝依賴
npm install

# 2. 啟動本機開發伺服器
npm run dev

# 3. 於瀏覽器開啟
# http://localhost:3000
```

---

## ☁️ 部署到 Vercel (Deploy to Vercel)

本專案為零伺服器環境變數依賴之純客戶端計算架構，可直接一鍵推送到 Vercel：

1. **推送到 GitHub**：
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for RetireWise"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. **在 Vercel 導入專案**：
   - 登入 [Vercel](https://vercel.com/)
   - 點選 **"Add New..."** -> **"Project"**
   - 選擇剛剛建立的 GitHub 倉庫，點選 **"Deploy"**
   - 無需額外填寫任何環境變數，約 1 分鐘內即可自動部署上線！

---

## 📄 授權協議 (License)

MIT License © 2026 RetireWise Team
