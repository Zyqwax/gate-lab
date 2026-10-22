'use client';

import React, { useEffect, useState } from 'react';
import { Palette } from './editor/Palette';
import { Canvas } from './editor/Canvas';
import { Toolbar } from './editor/Toolbar';
import { Inspector } from './editor/Inspector';
import { LogicAnalyzer } from './editor/LogicAnalyzer';
import { TruthTableModal } from './panels/TruthTableModal';
import { WelcomeModal } from './panels/WelcomeModal';
import { useCircuitStore } from './store/circuitStore';
import { useTranslation } from './i18n';
import { ChevronRight, ChevronLeft, Sliders } from 'lucide-react';
import { ReactFlowProvider } from '@xyflow/react';

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [isTruthTableOpen, setIsTruthTableOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  // Read persisted UI preferences from circuit store
  const isSidebarOpen = useCircuitStore((state) => state.isSidebarOpen);
  const toggleSidebar = useCircuitStore((state) => state.toggleSidebar);
  const setSidebarOpen = useCircuitStore((state) => state.setSidebarOpen);

  const isInspectorOpen = useCircuitStore((state) => state.isInspectorOpen);
  const toggleInspector = useCircuitStore((state) => state.toggleInspector);
  const setInspectorOpen = useCircuitStore((state) => state.setInspectorOpen);

  const isRunning = useCircuitStore((state) => state.isRunning);

  // Clock & simulation tick loop (runs at high resolution ~66Hz, each clock advances by its own Hz)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      useCircuitStore.getState().tickSimulation(performance.now());
    }, 15);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Periodic Auto-Save: Automatically saves project to localStorage every 7 seconds when unsaved changes exist
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const state = useCircuitStore.getState();
      if (!state.isSaved) {
        state.saveCurrentProject();
      }
    }, 7000);

    const handleBeforeUnload = () => {
      const state = useCircuitStore.getState();
      if (!state.isSaved) {
        state.saveCurrentProject();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(autoSaveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans"
    >
      {/* Top Application Toolbar */}
      <Toolbar
        onOpenTruthTable={() => setIsTruthTableOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={toggleInspector}
      />

      {/* Main Workspace Body with Shared ReactFlow Context */}
      <ReactFlowProvider>
        <div className="flex flex-1 overflow-hidden relative">
        {/* Left Component Palette with Smooth Collapse */}
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden flex z-10 ${
            isSidebarOpen ? 'w-56' : 'w-0'
          }`}
        >
          <div className="w-56 h-full">
            <Palette />
          </div>
        </div>

        {/* Small floating pill to expand left sidebar when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-2 top-3 z-20 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            title={t("showSidebar")}
          >
            <span>{t("openPalettePill")}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Center Interactive Circuit Canvas & Bottom Logic Analyzer */}
        <main className="flex-1 h-full relative overflow-hidden bg-slate-950 flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <Canvas />
          </div>
          <LogicAnalyzer />
        </main>

        {/* Small floating pill to expand right inspector when closed */}
        {!isInspectorOpen && (
          <button
            onClick={() => setInspectorOpen(true)}
            className="absolute right-2 top-3 z-20 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title={t("openInspector")}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t("openInspectorPill")}</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Right Element Inspector with Smooth Collapse */}
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden flex z-10 ${
            isInspectorOpen ? 'w-72' : 'w-0'
          }`}
        >
          <div className="w-72 h-full">
            <Inspector onClose={() => setInspectorOpen(false)} />
          </div>
        </div>
      </div>
    </ReactFlowProvider>

      {/* Modals */}
      <TruthTableModal
        isOpen={isTruthTableOpen}
        onClose={() => setIsTruthTableOpen(false)}
      />

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
      />
    </div>
  );
};

export default App;
