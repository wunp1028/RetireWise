// components/layout/AppShell.tsx
'use client';

import React, { useState, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { useFinanceStore } from '@/lib/store/useFinanceStore';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const setHasHydrated = useFinanceStore((state) => state.setHasHydrated);

  useEffect(() => {
    // 確保客戶端載入後正確標記水合狀態
    setHasHydrated(true);
  }, [setHasHydrated]);

  return (
    <div className="flex h-screen w-full bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full">
        <AppSidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex flex-col w-64 max-w-[80vw] h-full shadow-2xl">
            <AppSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#090d16] via-[#0b101c] to-[#090d16]">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
