// lib/store/useFinanceStore.ts
// Zustand 財務資料狀態庫與 LocalStorage 本機持久化

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  FamilyProfile,
  SpouseProfile,
  FinancialAsset,
  Liability,
  Child,
  ChildEducationStage,
  LifeEvent,
  CashFlowProfile,
  ScenarioType,
  PlanSnapshot,
} from '../engine/types';
import {
  initialFamilyProfile,
  initialAssets,
  initialLiabilities,
  initialChildren,
  initialLifeEvents,
  initialCashFlow,
} from './initialData';

export interface FinanceState {
  family: FamilyProfile;
  assets: FinancialAsset[];
  liabilities: Liability[];
  children: Child[];
  lifeEvents: LifeEvent[];
  cashFlow: CashFlowProfile;
  scenario: ScenarioType;
  hasHydrated: boolean;

  // Actions
  setHasHydrated: (state: boolean) => void;
  setScenario: (scenario: ScenarioType) => void;
  updateFamilyProfile: (profile: Partial<FamilyProfile>) => void;
  updateSpouseProfile: (spouse: Partial<SpouseProfile> | undefined) => void;

  // Assets CRUD
  addAsset: (asset: Omit<FinancialAsset, 'id'>) => void;
  updateAsset: (id: string, asset: Partial<FinancialAsset>) => void;
  deleteAsset: (id: string) => void;

  // Liabilities CRUD
  addLiability: (liability: Omit<Liability, 'id'>) => void;
  updateLiability: (id: string, liability: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;

  // Children CRUD
  addChild: (child: Omit<Child, 'id'>) => void;
  updateChild: (id: string, child: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  addChildStage: (childId: string, stage: Omit<ChildEducationStage, 'id'>) => void;
  deleteChildStage: (childId: string, stageId: string) => void;

  // LifeEvents CRUD
  addLifeEvent: (event: Omit<LifeEvent, 'id'>) => void;
  updateLifeEvent: (id: string, event: Partial<LifeEvent>) => void;
  deleteLifeEvent: (id: string) => void;

  // CashFlow
  updateCashFlowProfile: (cashFlow: Partial<CashFlowProfile>) => void;

  // Plan Comparison (Plan A vs Plan B)
  planB: PlanSnapshot | null;
  saveCurrentAsPlanB: (name?: string) => void;
  clearPlanB: () => void;
  applyPlanBToCurrent: () => void;

  // Management
  resetToDefault: () => void;
  importJSON: (jsonData: string) => boolean;
  exportJSON: () => string;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      family: initialFamilyProfile,
      assets: initialAssets,
      liabilities: initialLiabilities,
      children: initialChildren,
      lifeEvents: initialLifeEvents,
      cashFlow: initialCashFlow,
      scenario: 'BASE',
      hasHydrated: false,

      setHasHydrated: (val) => set({ hasHydrated: val }),
      setScenario: (scenario) => set({ scenario }),

      updateFamilyProfile: (partial) =>
        set((state) => ({
          family: { ...state.family, ...partial },
        })),

      updateSpouseProfile: (spousePartial) =>
        set((state) => ({
          family: {
            ...state.family,
            spouse: spousePartial
              ? { ...(state.family.spouse || { currentAge: 38, retirementAge: 65, lifeExpectancy: 85 }), ...spousePartial }
              : undefined,
          },
        })),

      addAsset: (assetData) =>
        set((state) => ({
          assets: [
            ...state.assets,
            { ...assetData, id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      updateAsset: (id, partial) =>
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, ...partial } : a)),
        })),

      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
        })),

      addLiability: (liabilityData) =>
        set((state) => ({
          liabilities: [
            ...state.liabilities,
            { ...liabilityData, id: `liab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      updateLiability: (id, partial) =>
        set((state) => ({
          liabilities: state.liabilities.map((l) => (l.id === id ? { ...l, ...partial } : l)),
        })),

      deleteLiability: (id) =>
        set((state) => ({
          liabilities: state.liabilities.filter((l) => l.id !== id),
        })),

      addChild: (childData) =>
        set((state) => ({
          children: [
            ...state.children,
            { ...childData, id: `child-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      updateChild: (id, partial) =>
        set((state) => ({
          children: state.children.map((c) => (c.id === id ? { ...c, ...partial } : c)),
        })),

      deleteChild: (id) =>
        set((state) => ({
          children: state.children.filter((c) => c.id !== id),
        })),

      addChildStage: (childId, stageData) =>
        set((state) => ({
          children: state.children.map((c) => {
            if (c.id !== childId) return c;
            const newStage: ChildEducationStage = {
              ...stageData,
              id: `stage-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            };
            return {
              ...c,
              educationStages: [...c.educationStages, newStage],
            };
          }),
        })),

      deleteChildStage: (childId, stageId) =>
        set((state) => ({
          children: state.children.map((c) => {
            if (c.id !== childId) return c;
            return {
              ...c,
              educationStages: c.educationStages.filter((s) => s.id !== stageId),
            };
          }),
        })),

      addLifeEvent: (eventData) =>
        set((state) => ({
          lifeEvents: [
            ...state.lifeEvents,
            { ...eventData, id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      updateLifeEvent: (id, partial) =>
        set((state) => ({
          lifeEvents: state.lifeEvents.map((e) => (e.id === id ? { ...e, ...partial } : e)),
        })),

      deleteLifeEvent: (id) =>
        set((state) => ({
          lifeEvents: state.lifeEvents.filter((e) => e.id !== id),
        })),

      updateCashFlowProfile: (partial) =>
        set((state) => ({
          cashFlow: { ...state.cashFlow, ...partial },
        })),

      planB: null,

      saveCurrentAsPlanB: (name = '計畫 B 對照組') => {
        const state = get();
        set({
          planB: {
            id: `planb-${Date.now()}`,
            name,
            savedAt: '2026-10-13',
            family: JSON.parse(JSON.stringify(state.family)),
            assets: JSON.parse(JSON.stringify(state.assets)),
            liabilities: JSON.parse(JSON.stringify(state.liabilities)),
            children: JSON.parse(JSON.stringify(state.children)),
            lifeEvents: JSON.parse(JSON.stringify(state.lifeEvents)),
            cashFlow: JSON.parse(JSON.stringify(state.cashFlow)),
          },
        });
      },

      clearPlanB: () => set({ planB: null }),

      applyPlanBToCurrent: () => {
        const plan = get().planB;
        if (!plan) return;
        set({
          family: JSON.parse(JSON.stringify(plan.family)),
          assets: JSON.parse(JSON.stringify(plan.assets)),
          liabilities: JSON.parse(JSON.stringify(plan.liabilities)),
          children: JSON.parse(JSON.stringify(plan.children)),
          lifeEvents: JSON.parse(JSON.stringify(plan.lifeEvents)),
          cashFlow: JSON.parse(JSON.stringify(plan.cashFlow)),
        });
      },

      resetToDefault: () =>
        set({
          family: initialFamilyProfile,
          assets: initialAssets,
          liabilities: initialLiabilities,
          children: initialChildren,
          lifeEvents: initialLifeEvents,
          cashFlow: initialCashFlow,
          scenario: 'BASE',
          planB: null,
        }),

      importJSON: (rawJson: string) => {
        try {
          const parsed = JSON.parse(rawJson);
          if (!parsed.family || !parsed.assets || !parsed.cashFlow) {
            return false;
          }
          set({
            family: parsed.family,
            assets: parsed.assets || [],
            liabilities: parsed.liabilities || [],
            children: parsed.children || [],
            lifeEvents: parsed.lifeEvents || [],
            cashFlow: parsed.cashFlow,
            scenario: parsed.scenario || 'BASE',
          });
          return true;
        } catch {
          return false;
        }
      },

      exportJSON: () => {
        const state = get();
        const exportData = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          family: state.family,
          assets: state.assets,
          liabilities: state.liabilities,
          children: state.children,
          lifeEvents: state.lifeEvents,
          cashFlow: state.cashFlow,
          scenario: state.scenario,
        };
        return JSON.stringify(exportData, null, 2);
      },
    }),
    {
      name: 'retirewise-finance-state',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as any))),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
