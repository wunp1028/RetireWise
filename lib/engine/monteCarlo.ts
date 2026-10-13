// lib/engine/monteCarlo.ts
// 蒙地卡羅 1,000 次亂數壓力測試模擬引擎

import {
  SimulationInput,
  MonteCarloSimulationResult,
  MonteCarloYearPercentile,
} from './types';
import { calculateBlendedRates } from './calculator';
import { inflate } from './inflation';

/**
 * Mulberry32 演算法：高品質 32-bit 確定性偽隨機數產生器
 * 杜絕 Next.js prerender 時對 Math.random() 的非穩定性報錯，且支援重現種子
 */
function createPRNG(seed: number = 42) {
  let s = (seed + 0x6d2b79f5) >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t >>> 0) / 4294967296);
  };
}

/**
 * Box-Muller 演算法：將均勻分佈轉換為標準常態分佈 N(0, 1)
 */
function sampleStandardNormal(prng: () => number): number {
  let u1 = 0;
  let u2 = 0;
  while (u1 === 0) u1 = prng();
  while (u2 === 0) u2 = prng();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

/**
 * 取得特定百分位數 (0 ~ 100)
 */
function getPercentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const index = Math.floor((p / 100) * (sortedValues.length - 1));
  return sortedValues[index];
}

/**
 * 執行 1,000 次蒙地卡羅模擬
 * 採用加權基準報酬率搭配標準差 14% 的隨機正態波動
 */
export function runMonteCarloSimulation(
  input: SimulationInput,
  iterations: number = 1000,
  volatility: number = 0.14,
  seed: number = 42
): MonteCarloSimulationResult {
  const prng = createPRNG(seed);
  const { family, assets, liabilities, children, lifeEvents, cashFlow } = input;
  const simulationYears = Math.max(1, family.lifeExpectancy - family.currentAge + 1);
  const currentCalendarYear = 2026;

  const { blendedReturn, blendedDividendYield } = calculateBlendedRates(assets, 'BASE');
  const initialTotalAssets = assets.reduce((sum: number, a) => sum + Math.max(0, a.currentValue), 0);
  const initialTotalLiabilities = liabilities.reduce((sum: number, l) => sum + Math.max(0, l.principalRemaining), 0);
  const initialNetWorth = initialTotalAssets - initialTotalLiabilities;

  // 預先計算每一年的固定收支淨差額 (除以投資報酬外的現金流)
  const baseNetCashFlowPerYear: number[] = [];
  for (let y = 0; y < simulationYears; y++) {
    const age = family.currentAge + y;
    const isRetired = age >= family.retirementAge;

    const salary = !isRetired
      ? cashFlow.annualSalary * Math.pow(1 + Math.max(0, cashFlow.salaryGrowthRate), y)
      : 0;
    const pensionDiscount = cashFlow.pensionReformDiscount ?? 1.0;
    const pension = isRetired ? cashFlow.pensionMonthlyAmount * 12 * pensionDiscount : 0;

    let smileFactor = 1.0;
    if (isRetired && cashFlow.enableSpendingSmile) {
      const yearsRetired = age - family.retirementAge;
      if (yearsRetired < 10) {
        smileFactor = 1.05; // 活躍期
      } else if (yearsRetired < 20) {
        smileFactor = 0.82; // 放緩期
      } else {
        smileFactor = 0.95; // 照護期
      }
    }

    const livingCostBase = isRetired
      ? cashFlow.annualLivingExpenses * Math.max(0.2, cashFlow.retirementLivingExpenseRatio) * smileFactor
      : cashFlow.annualLivingExpenses;
    const living = inflate(livingCostBase, family.inflationRate, y);

    let childCosts = 0;
    for (const child of children) {
      const childAge = child.currentAge + y;
      for (const stage of child.educationStages) {
        if (childAge >= stage.startAge && childAge <= stage.endAge) {
          childCosts += inflate(stage.annualCostToday, family.inflationRate, y);
        }
      }
    }

    let liabilityPay = 0;
    for (const l of liabilities) {
      const remainingMonths = Math.max(0, l.remainingMonths - y * 12);
      if (remainingMonths > 0) {
        liabilityPay += Math.min(12, remainingMonths) * l.monthlyPayment;
      }
    }

    let milestone = 0;
    for (const ev of lifeEvents) {
      if (ev.occurAtAge === age) {
        milestone += ev.isAdjustedForInflation
          ? inflate(ev.amount, family.inflationRate, y)
          : ev.amount;
      }
    }

    const net = (salary + pension) - (living + childCosts + liabilityPay) + milestone;
    baseNetCashFlowPerYear.push(net);
  }

  // 矩陣儲存所有軌跡在各年份的淨資產: yearTrajectories[yearIndex] = number[]
  const yearTrajectories: number[][] = Array.from({ length: simulationYears }, () => []);
  let failedRuns = 0;

  for (let run = 0; run < iterations; run++) {
    let runNetWorth = initialNetWorth;
    let runLiquidAssets = Math.max(0, initialTotalAssets);
    let runFailed = false;

    for (let y = 0; y < simulationYears; y++) {
      // 隨機抽樣當年度報酬率
      const normalSample = sampleStandardNormal(prng);
      const randomizedReturn = blendedReturn + normalSample * volatility;

      let returnIncome = 0;
      if (runNetWorth > 0 && runLiquidAssets > 0) {
        returnIncome = runLiquidAssets * Math.max(-0.8, randomizedReturn - blendedDividendYield);
      }

      const yearNetCash = baseNetCashFlowPerYear[y];
      const ending = runNetWorth + returnIncome + yearNetCash;

      if (ending <= 0) {
        runFailed = true;
      }

      runLiquidAssets = Math.max(0, runLiquidAssets + returnIncome + yearNetCash);
      runNetWorth = ending;
      yearTrajectories[y].push(ending);
    }

    if (runFailed) {
      failedRuns++;
    }
  }

  // 計算每一年份的分位數
  const percentiles: MonteCarloYearPercentile[] = [];
  for (let y = 0; y < simulationYears; y++) {
    const sorted = [...yearTrajectories[y]].sort((a, b) => a - b);
    percentiles.push({
      age: family.currentAge + y,
      calendarYear: currentCalendarYear + y,
      pr10: Math.round(getPercentile(sorted, 10)),
      pr50: Math.round(getPercentile(sorted, 50)),
      pr90: Math.round(getPercentile(sorted, 90)),
    });
  }

  const ruinProbability = Number(((failedRuns / iterations) * 100).toFixed(1));

  return {
    iterations,
    ruinProbability,
    percentiles,
  };
}
