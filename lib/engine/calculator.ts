// lib/engine/calculator.ts
// RetireWise 核心複利迭代計算機與年度現金流聚合引擎 (純函數)

import {
  FamilyProfile,
  FinancialAsset,
  Liability,
  Child,
  LifeEvent,
  CashFlowProfile,
  ScenarioType,
  YearlyProjection,
  SimulationSummary,
  SimulationInput,
} from './types';
import { inflate } from './inflation';

export type { SimulationInput };

/**
 * 依據不同情境調整年化報酬率與通膨率
 */
function getScenarioAdjustments(scenario: ScenarioType = 'BASE') {
  switch (scenario) {
    case 'BEAR': // 悲觀情境：報酬率 -2%，通膨 +1%
      return { returnDelta: -0.02, inflationDelta: 0.01 };
    case 'BULL': // 樂觀情境：報酬率 +2%，通膨 -0.5%
      return { returnDelta: 0.02, inflationDelta: -0.005 };
    case 'BASE':
    default:
      return { returnDelta: 0, inflationDelta: 0 };
  }
}

/**
 * 計算資產加權複合年化報酬率與現金股息殖利率
 */
export function calculateBlendedRates(
  assets: FinancialAsset[],
  scenario: ScenarioType = 'BASE'
): { blendedReturn: number; blendedDividendYield: number; totalAssetValue: number } {
  const { returnDelta } = getScenarioAdjustments(scenario);
  const totalAssetValue = assets.reduce((sum, a) => sum + Math.max(0, a.currentValue), 0);

  if (totalAssetValue <= 0) {
    return { blendedReturn: 0.03 + returnDelta, blendedDividendYield: 0, totalAssetValue: 0 };
  }

  let weightedReturnSum = 0;
  let weightedDividendSum = 0;

  for (const asset of assets) {
    const weight = Math.max(0, asset.currentValue) / totalAssetValue;
    const adjustedReturn = Math.max(-0.2, asset.expectedAnnualReturn + returnDelta);
    weightedReturnSum += weight * adjustedReturn;

    // 若股利不自動再投入，記錄為現金殖利率
    if (!asset.reinvestDividends) {
      weightedDividendSum += weight * Math.max(0, asset.annualDividendYield);
    }
  }

  return {
    blendedReturn: weightedReturnSum,
    blendedDividendYield: weightedDividendSum,
    totalAssetValue,
  };
}

/**
 * 依據資產類別加權動態推算投資組合年化波動度 (σ)
 * 納入股票、債券、現金真實歷史波幅與股債負相關配置平滑效果 (Diversification Benefit)
 */
export function calculatePortfolioVolatility(assets: FinancialAsset[]): number {
  const totalAssetValue = assets.reduce((sum, a) => sum + Math.max(0, a.currentValue), 0);
  if (totalAssetValue <= 0) return 0.14;

  const volMap: Record<string, number> = {
    EQUITY: 0.16,      // 股市/股票ETF歷史年化波動度約 16%
    BOND: 0.07,        // 投資級公債年化波動度約 7%
    CASH: 0.01,        // 現金/定存幾乎零波動約 1%
    REAL_ESTATE: 0.06, // 不動產實物波動度約 6%
    OTHER: 0.15,       // 其他替代資產約 15%
  };

  let weightedVol = 0;
  let stockRatio = 0;
  let bondRatio = 0;

  for (const asset of assets) {
    const weight = Math.max(0, asset.currentValue) / totalAssetValue;
    const v = volMap[asset.category] ?? 0.14;
    weightedVol += weight * v;

    if (asset.category === 'EQUITY') stockRatio += weight;
    if (asset.category === 'BOND') bondRatio += weight;
  }

  // 股債多元配置折減 (分散風險效應，最多平滑降低 2% 波動)
  let diversificationDiscount = 0;
  if (stockRatio > 0.1 && bondRatio > 0.1) {
    diversificationDiscount = Math.min(0.02, Math.min(stockRatio, bondRatio) * 0.06);
  }

  return Number(Math.max(0.03, Math.min(0.25, weightedVol - diversificationDiscount)).toFixed(4));
}

/**
 * 試算單一負債在特定年度的總還款金額與剩餘本金更新
 */
function calculateAnnualLiabilityPayment(
  liability: Liability,
  yearElapsed: number
): { annualPayment: number; remainingPrincipal: number } {
  const monthsAlreadyPaid = yearElapsed * 12;
  const remainingMonthsAtStartOfYear = Math.max(0, liability.remainingMonths - monthsAlreadyPaid);

  if (remainingMonthsAtStartOfYear <= 0) {
    return { annualPayment: 0, remainingPrincipal: 0 };
  }

  const monthsToPayThisYear = Math.min(12, remainingMonthsAtStartOfYear);
  const annualPayment = monthsToPayThisYear * liability.monthlyPayment;
  
  // 剩餘本金近似攤提計算
  const monthsLeftAfterYear = Math.max(0, remainingMonthsAtStartOfYear - monthsToPayThisYear);
  const fractionLeft = liability.remainingMonths > 0 ? monthsLeftAfterYear / liability.remainingMonths : 0;
  const remainingPrincipal = liability.principalRemaining * fractionLeft;

  return { annualPayment, remainingPrincipal };
}

/**
 * 執行全週期逐年現金流與淨資產模擬試算
 */
export function runSimulation(input: SimulationInput): {
  projections: YearlyProjection[];
  summary: SimulationSummary;
} {
  const { family, assets, liabilities, children, lifeEvents, cashFlow, scenario = 'BASE' } = input;
  const { inflationDelta } = getScenarioAdjustments(scenario);

  const effectiveInflationRate = Math.max(0, family.inflationRate + inflationDelta);
  const currentCalendarYear = 2026;
  const simulationYears = Math.max(1, family.lifeExpectancy - family.currentAge + 1);

  // 初始淨資產 = 總資產 - 總負債
  const initialTotalAssets = assets.reduce((sum, a) => sum + Math.max(0, a.currentValue), 0);
  const initialTotalLiabilities = liabilities.reduce((sum, l) => sum + Math.max(0, l.principalRemaining), 0);
  let currentNetWorth = initialTotalAssets - initialTotalLiabilities;
  let currentFinancialAssets = Math.max(0, initialTotalAssets);

  const projections: YearlyProjection[] = [];
  let peakNetWorth = currentNetWorth;
  let peakNetWorthAge = family.currentAge;
  let ruinAge: number | null = null;
  let retirementYearNetCashflow = 0;
  let retirementLiquidAssets = Math.max(0, initialTotalAssets);
  let retirementFirstYearLiving = 0;

  for (let yearIndex = 0; yearIndex < simulationYears; yearIndex++) {
    const age = family.currentAge + yearIndex;
    const calendarYear = currentCalendarYear + yearIndex;
    const isRetired = age >= family.retirementAge;
    const beginningNetWorth = currentNetWorth;

    // 1. 收入試算
    let salaryIncome = 0;
    if (!isRetired) {
      salaryIncome = cashFlow.annualSalary * Math.pow(1 + Math.max(0, cashFlow.salaryGrowthRate), yearIndex);
    }

    let pensionIncome = 0;
    const pensionDiscount = cashFlow.pensionReformDiscount ?? 1.0;
    if (isRetired) {
      pensionIncome = cashFlow.pensionMonthlyAmount * 12 * pensionDiscount;
    }

    // 2. 支出試算
    // 2.1 常態生活費 (支援三階段微笑支出曲線：活躍期 105% / 放緩期 82% / 照護期 95%)
    let smileFactor = 1.0;
    if (isRetired && cashFlow.enableSpendingSmile) {
      const yearsRetired = age - family.retirementAge;
      if (yearsRetired < 10) {
        smileFactor = 1.05; // 活躍期 (Go-Go Years): 旅遊社交多
      } else if (yearsRetired < 20) {
        smileFactor = 0.82; // 放緩期 (Slow-Go Years): 外出少、物慾自然下降
      } else {
        smileFactor = 0.95; // 照護期 (No-Go Years): 增加常態健康護理儲備
      }
    }

    const livingCostBase = isRetired
      ? cashFlow.annualLivingExpenses * Math.max(0.2, cashFlow.retirementLivingExpenseRatio) * smileFactor
      : cashFlow.annualLivingExpenses;
    const livingExpenses = inflate(livingCostBase, effectiveInflationRate, yearIndex);

    // 2.2 子女教育費用
    let childEducationExpenses = 0;
    for (const child of children) {
      const childAge = child.currentAge + yearIndex;
      for (const stage of child.educationStages) {
        if (childAge >= stage.startAge && childAge <= stage.endAge) {
          childEducationExpenses += inflate(stage.annualCostToday, effectiveInflationRate, yearIndex);
        }
      }
    }

    // 2.3 負債年還款金額
    let liabilityPayments = 0;
    for (const liability of liabilities) {
      const { annualPayment } = calculateAnnualLiabilityPayment(liability, yearIndex);
      liabilityPayments += annualPayment;
    }

    // 2.4 重大事件收支
    let milestoneExpenses = 0;
    for (const event of lifeEvents) {
      if (event.occurAtAge === age) {
        const rawAmount = event.isAdjustedForInflation
          ? inflate(event.amount, effectiveInflationRate, yearIndex)
          : event.amount;
        // event.amount 負值為支出，正值為額外收入
        milestoneExpenses += rawAmount;
      }
    }

    // 3. 被動現金流 (未再投入之股利)
    const { blendedReturn, blendedDividendYield } = calculateBlendedRates(assets, scenario);
    let dividendCashflow = 0;
    if (currentFinancialAssets > 0 && blendedDividendYield > 0) {
      dividendCashflow = currentFinancialAssets * blendedDividendYield;
    }

    const totalIncome = salaryIncome + pensionIncome + dividendCashflow + (milestoneExpenses > 0 ? milestoneExpenses : 0);
    const regularExpense = livingExpenses + childEducationExpenses + liabilityPayments;
    const milestoneNegativeExpense = milestoneExpenses < 0 ? Math.abs(milestoneExpenses) : 0;
    const totalExpenses = regularExpense + milestoneNegativeExpense;

    const netSavings = totalIncome - totalExpenses;

    // 4. 投資報酬與資產滾存
    let investmentReturn = 0;
    const isCurrentlyRuined = currentNetWorth <= 0;

    if (!isCurrentlyRuined && currentFinancialAssets > 0) {
      // 淨成長率扣除已發放之現金股利
      const effectiveCapitalGrowthRate = Math.max(-0.9, blendedReturn - blendedDividendYield);
      investmentReturn = currentFinancialAssets * effectiveCapitalGrowthRate;
    } else {
      // 破產保護：資產歸零後投資報酬凍結為 0，赤字不計複利滾倒扣
      investmentReturn = 0;
    }

    // 更新期末淨資產
    const endingNetWorth = beginningNetWorth + investmentReturn + netSavings;
    const hasRuined = endingNetWorth <= 0;

    if (hasRuined && ruinAge === null) {
      ruinAge = age;
    }

    // 更新流動性金融資產 (不可小於 0)
    currentFinancialAssets = Math.max(0, currentFinancialAssets + investmentReturn + netSavings);
    currentNetWorth = endingNetWorth;

    // 記錄高峰值
    if (endingNetWorth > peakNetWorth) {
      peakNetWorth = endingNetWorth;
      peakNetWorthAge = age;
    }

    // 記錄退休首年淨現金流與流動資產
    if (age === family.retirementAge) {
      retirementYearNetCashflow = netSavings;
      retirementLiquidAssets = currentFinancialAssets;
      retirementFirstYearLiving = livingExpenses;
    }

    projections.push({
      yearIndex,
      age,
      calendarYear,
      beginningNetWorth: Math.round(beginningNetWorth),
      salaryIncome: Math.round(salaryIncome),
      pensionIncome: Math.round(pensionIncome),
      dividendCashflow: Math.round(dividendCashflow),
      totalIncome: Math.round(totalIncome),
      livingExpenses: Math.round(livingExpenses),
      childEducationExpenses: Math.round(childEducationExpenses),
      liabilityPayments: Math.round(liabilityPayments),
      milestoneExpenses: Math.round(milestoneExpenses),
      totalExpenses: Math.round(totalExpenses),
      netSavings: Math.round(netSavings),
      blendedReturnRate: Number(blendedReturn.toFixed(4)),
      investmentReturn: Math.round(investmentReturn),
      endingNetWorth: Math.round(endingNetWorth),
      endingFinancialAssets: Math.round(currentFinancialAssets),
      isRuined: hasRuined,
      isRetired,
    });
  }

  const safeWithdrawalAmount = Math.round(retirementLiquidAssets * 0.04);
  const fireCoverageRatio = retirementFirstYearLiving > 0
    ? Number(((safeWithdrawalAmount / retirementFirstYearLiving) * 100).toFixed(1))
    : 100;

  return {
    projections,
    summary: {
      peakNetWorth: Math.round(peakNetWorth),
      peakNetWorthAge,
      ruinAge,
      retirementYearNetCashflow: Math.round(retirementYearNetCashflow),
      finalNetWorth: Math.round(currentNetWorth),
      safeWithdrawalAmount,
      fireCoverageRatio,
      retirementLiquidAssets: Math.round(retirementLiquidAssets),
    },
  };
}
