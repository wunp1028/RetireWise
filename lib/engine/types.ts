// lib/engine/types.ts
// RetireWise 領域資料模型與型別定義

export type AssetClass = 'CASH' | 'EQUITY' | 'BOND' | 'REAL_ESTATE' | 'OTHER';

export interface FinancialAsset {
  id: string;
  name: string;                    // 資產名稱 (例如: "台股市值型ETF", "活存備轉金")
  category: AssetClass;
  currentValue: number;            // 當前現值 (NTD)
  expectedAnnualReturn: number;    // 預期年化報酬率 (例如: 0.065 = 6.5%)
  annualDividendYield: number;     // 預期年股息/殖利率 (例如: 0.03 = 3%)
  reinvestDividends: boolean;      // 退休前是否股利再投入 (true/false)
}

export interface Liability {
  id: string;
  name: string;                    // 負債名稱 (例如: "自用住宅房貸", "信貸")
  principalRemaining: number;      // 剩餘本金 (NTD)
  annualInterestRate: number;      // 年利率 (例如: 0.022 = 2.2%)
  remainingMonths: number;         // 剩餘期數 (月)
  monthlyPayment: number;          // 每月本息攤還金額 (NTD)
}

export interface ChildEducationStage {
  id: string;
  stageName: string;               // 階段名稱 (例如: "國小", "國中", "高中", "國內大學", "海外碩士")
  startAge: number;                // 該階段開始年齡 (如: 18)
  endAge: number;                  // 該階段結束年齡 (如: 22)
  annualCostToday: number;         // 當前物價水準下之年支出 (NTD)
}

export interface Child {
  id: string;
  name: string;                    // 子女姓名或暱稱
  currentAge: number;              // 當前年齡
  educationStages: ChildEducationStage[];
}

export interface LifeEvent {
  id: string;
  name: string;                    // 事件名稱 (例如: "換車", "房屋修繕", "父母長照金")
  occurAtAge: number;              // 發生時本人年齡
  amount: number;                  // 發生金額 (負值為支出，正值為額外收入)
  isAdjustedForInflation: boolean; // 是否依通膨複利調整至發生年度
}

export interface SpouseProfile {
  name?: string;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
}

export interface FamilyProfile {
  currentAge: number;              // 本人當前年齡 (例如: 40)
  retirementAge: number;           // 預計退休年齡 (例如: 65)
  lifeExpectancy: number;          // 預期壽命終點 (例如: 85)
  inflationRate: number;           // 預期常態通膨率 (例如: 0.02 = 2%)
  spouse?: SpouseProfile;
}

export interface CashFlowProfile {
  annualSalary: number;            // 當前家庭年度實質薪資總收入 (扣除稅費)
  salaryGrowthRate: number;        // 預期薪資年成長率 (例如: 0.02 = 2%)
  annualLivingExpenses: number;    // 當前年度家庭常態生活費 (不含房貸與子女教育)
  retirementLivingExpenseRatio: number; // 退休後生活開支替代率 (例如: 0.7 = 現有70%)
  pensionMonthlyAmount: number;    // 退休後每月固定領取之年金總額 (自退休年齡起算)
  pensionReformDiscount?: number;  // 台灣勞保改革打折 (例如: 0.7 = 打7折, 1.0 = 全額發放)
  enableSpendingSmile?: boolean;   // 是否啟用三階段退休支出微笑曲線 (活躍期/放緩期/照護期)
}

export type ScenarioType = 'BASE' | 'BEAR' | 'BULL';

export interface SimulationInput {
  family: FamilyProfile;
  assets: FinancialAsset[];
  liabilities: Liability[];
  children: Child[];
  lifeEvents: LifeEvent[];
  cashFlow: CashFlowProfile;
  scenario?: ScenarioType;
}

export interface YearlyProjection {
  yearIndex: number;               // 模擬年期索引 (0 = 當前年度)
  age: number;                     // 當年度本人年齡
  calendarYear: number;            // 西元歷年 (例如: 2026)
  beginningNetWorth: number;       // 期初淨資產
  salaryIncome: number;            // 當年度薪資收入
  pensionIncome: number;           // 當年度年金收入
  dividendCashflow: number;        // 當年度未再投入之被動現金流
  totalIncome: number;             // 當年總收入
  livingExpenses: number;          // 常態生活費 (通膨調整)
  childEducationExpenses: number;  // 子女教育費用 (通膨調整)
  liabilityPayments: number;       // 房貸/負債年攤還額
  milestoneExpenses: number;       // 重大事件淨收支 (正負)
  totalExpenses: number;           // 當年總支出
  netSavings: number;              // 年度淨現金流 (totalIncome - totalExpenses)
  blendedReturnRate: number;       // 當年有效年化報酬率
  investmentReturn: number;        // 當年度金融資產增值金額
  endingNetWorth: number;          // 期末淨資產
  endingFinancialAssets: number;   // 期末流動性金融資產
  isRuined: boolean;               // 淨資產是否已歸零或負債
  isRetired: boolean;              // 是否已退休
}

export interface MonteCarloYearPercentile {
  age: number;
  calendarYear: number;
  pr10: number; // 悲觀軌跡 (第 10 百分位)
  pr50: number; // 中位數軌跡 (第 50 百分位)
  pr90: number; // 樂觀軌跡 (第 90 百分位)
}

export interface MonteCarloSimulationResult {
  iterations: number;
  ruinProbability: number;         // 破產率 (0 ~ 100%)
  percentiles: MonteCarloYearPercentile[];
}

export interface SimulationSummary {
  peakNetWorth: number;
  peakNetWorthAge: number;
  ruinAge: number | null;          // 破產年份 (年齡)，若終身無虞則為 null
  retirementYearNetCashflow: number; // 退休首年年度現金流
  finalNetWorth: number;
  safeWithdrawalAmount: number;    // 4% 法則安全年提領金額 (退休時流動資產 * 4%)
  fireCoverageRatio: number;       // 4% 安全提領覆蓋率 (SafeWithdrawal / 退休首年生活開銷 * 100%)
  retirementLiquidAssets: number;  // 退休時流動資產總額
}

export interface PlanSnapshot {
  id: string;
  name: string;
  savedAt: string;
  family: FamilyProfile;
  assets: FinancialAsset[];
  liabilities: Liability[];
  children: Child[];
  lifeEvents: LifeEvent[];
  cashFlow: CashFlowProfile;
}
