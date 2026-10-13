// lib/engine/inflation.ts
// 通膨平減與數值格式化工具函式

/**
 * 依年數與通膨率計算複利未來值
 */
export function inflate(amount: number, rate: number, years: number): number {
  if (years <= 0 || rate === 0 || isNaN(amount)) return amount;
  return amount * Math.pow(1 + Math.max(-0.5, rate), years);
}

/**
 * 將未來金額折現回當前實質購買力
 */
export function deflate(amount: number, rate: number, years: number): number {
  if (years <= 0 || rate === 0 || isNaN(amount)) return amount;
  const denominator = Math.pow(1 + Math.max(-0.5, rate), years);
  return denominator !== 0 ? amount / denominator : amount;
}

/**
 * 新台幣金額格式化（提供一般與簡潔萬元/億元標記）
 */
export function formatNTD(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || !isFinite(amount)) return 'NT$ 0';
  
  const sign = amount < 0 ? '-' : '';
  const absVal = Math.abs(amount);

  if (compact) {
    if (absVal >= 100000000) {
      return `${sign}${(absVal / 100000000).toFixed(2)} 億`;
    }
    if (absVal >= 10000) {
      return `${sign}${(absVal / 10000).toFixed(0)} 萬`;
    }
    return `${sign}${Math.round(absVal).toLocaleString()} 元`;
  }

  return `${sign}NT$ ${Math.round(absVal).toLocaleString()}`;
}

/**
 * 百分比格式化 (例如: 0.025 -> 2.5%)
 */
export function formatPercent(rate: number, decimals: number = 1): string {
  if (isNaN(rate)) return '0%';
  return `${(rate * 100).toFixed(decimals)}%`;
}
