// lib/store/initialData.ts
// 台灣雙薪家庭標準範本初始資料

import {
  FamilyProfile,
  FinancialAsset,
  Liability,
  Child,
  LifeEvent,
  CashFlowProfile,
} from '../engine/types';

export const initialFamilyProfile: FamilyProfile = {
  currentAge: 40,
  retirementAge: 65,
  lifeExpectancy: 85,
  inflationRate: 0.02, // 2.0%
  spouse: {
    name: '配偶',
    currentAge: 38,
    retirementAge: 65,
    lifeExpectancy: 88,
  },
};

export const initialAssets: FinancialAsset[] = [
  {
    id: 'asset-1',
    name: '活存與緊急備用金',
    category: 'CASH',
    currentValue: 1500000,
    expectedAnnualReturn: 0.015,
    annualDividendYield: 0.015,
    reinvestDividends: false,
  },
  {
    id: 'asset-2',
    name: '台股市值型 ETF (0050/006208)',
    category: 'EQUITY',
    currentValue: 6000000,
    expectedAnnualReturn: 0.075,
    annualDividendYield: 0.03,
    reinvestDividends: true,
  },
  {
    id: 'asset-3',
    name: '全球市場指數 ETF (VT/VTI)',
    category: 'EQUITY',
    currentValue: 4500000,
    expectedAnnualReturn: 0.08,
    annualDividendYield: 0.02,
    reinvestDividends: true,
  },
  {
    id: 'asset-4',
    name: '美國公債 ETF (BOND)',
    category: 'BOND',
    currentValue: 2000000,
    expectedAnnualReturn: 0.038,
    annualDividendYield: 0.038,
    reinvestDividends: true,
  },
  {
    id: 'asset-5',
    name: '自住不動產淨現值',
    category: 'REAL_ESTATE',
    currentValue: 18000000,
    expectedAnnualReturn: 0.02,
    annualDividendYield: 0.0,
    reinvestDividends: false,
  },
];

export const initialLiabilities: Liability[] = [
  {
    id: 'liab-1',
    name: '自用住宅房屋貸款',
    principalRemaining: 8000000,
    annualInterestRate: 0.022,
    remainingMonths: 240, // 20 年
    monthlyPayment: 41200,
  },
];

export const initialChildren: Child[] = [
  {
    id: 'child-1',
    name: '大寶',
    currentAge: 10,
    educationStages: [
      { id: 'c1-s1', stageName: '國小階段', startAge: 7, endAge: 12, annualCostToday: 180000 },
      { id: 'c1-s2', stageName: '國中階段', startAge: 13, endAge: 15, annualCostToday: 220000 },
      { id: 'c1-s3', stageName: '高中階段', startAge: 16, endAge: 18, annualCostToday: 260000 },
      { id: 'c1-s4', stageName: '國內大學階段', startAge: 19, endAge: 22, annualCostToday: 350000 },
    ],
  },
  {
    id: 'child-2',
    name: '二寶',
    currentAge: 7,
    educationStages: [
      { id: 'c2-s1', stageName: '國小階段', startAge: 7, endAge: 12, annualCostToday: 180000 },
      { id: 'c2-s2', stageName: '國中階段', startAge: 13, endAge: 15, annualCostToday: 220000 },
      { id: 'c2-s3', stageName: '高中階段', startAge: 16, endAge: 18, annualCostToday: 260000 },
      { id: 'c2-s4', stageName: '國內大學階段', startAge: 19, endAge: 22, annualCostToday: 350000 },
      { id: 'c2-s5', stageName: '海外碩士深造', startAge: 23, endAge: 24, annualCostToday: 1600000 },
    ],
  },
];

export const initialLifeEvents: LifeEvent[] = [
  {
    id: 'event-1',
    name: '家庭休旅車置換',
    occurAtAge: 48,
    amount: -1200000,
    isAdjustedForInflation: true,
  },
  {
    id: 'event-2',
    name: '住宅管線翻修裝潢',
    occurAtAge: 55,
    amount: -800000,
    isAdjustedForInflation: true,
  },
  {
    id: 'event-3',
    name: '長輩醫療照護儲備金',
    occurAtAge: 60,
    amount: -1000000,
    isAdjustedForInflation: true,
  },
  {
    id: 'event-4',
    name: '長輩傳承或部分資產處分',
    occurAtAge: 68,
    amount: 3000000,
    isAdjustedForInflation: false,
  },
];

export const initialCashFlow: CashFlowProfile = {
  annualSalary: 2200000, // 雙薪合計 220 萬
  salaryGrowthRate: 0.02, // 年調幅 2%
  annualLivingExpenses: 960000, // 年生活費 96 萬 (月均 8 萬)
  retirementLivingExpenseRatio: 0.75, // 退休生活費替代率 75%
  pensionMonthlyAmount: 48000, // 夫妻合計勞保勞退月領 4.8 萬
  pensionReformDiscount: 1.0, // 預設 100% 全額發放
  enableSpendingSmile: true, // 預設啟用三階段退休支出微笑曲線
};
