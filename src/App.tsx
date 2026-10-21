'use client';

import React, { useEffect, useState } from 'react';
import { Palette } from './editor/Palette';
import { Canvas } from './editor/Canvas';
import { Toolbar } from './editor/Toolbar';
import { Inspector } from './editor/Inspector';
import { TruthTableModal } from './panels/TruthTableModal';
import { WelcomeModal } from './panels/WelcomeModal';
import { useCircuitStore } from './store/circuitStore';
import { ChevronRight, ChevronLeft, Sliders } from 'lucide-react';

export const App: React.FC = () => {
  const [isTruthTableOpen, setIsTruthTableOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  const isRunning = useCircuitStore((state) => state.isRunning);
  const tickRateHz = useCircuitStore((state) => state.tickRateHz);
  const step = useCircuitStore((state) => state.step);
  const selectedComponentId = useCircuitStore((state) => state.selectedComponentId);

  // Auto-open Inspector when a component is clicked/selected if it was closed
  useEffect(() => {
    if (selectedComponentId) {
      setIsInspectorOpen(true);
    }
  }, [selectedComponentId]);

  // Clock & simulation tick loop (only runs if isRunning is true)
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = Math.round(1000 / tickRateHz);
    const interval = setInterval(() => {
      step();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isRunning, tickRateHz, step]);

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans"
    >
      {/* Top Application Toolbar */}
      <Toolbar
        onOpenTruthTable={() => setIsTruthTableOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
      />

      {/* Main Workspace Body */}
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
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-2 top-3 z-20 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            title="Parça Panelini Aç"
          >
            <span>Parçalar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Center Interactive Circuit Canvas */}
        <main className="flex-1 h-full relative overflow-hidden bg-slate-950">
          <Canvas />
        </main>

        {/* Small floating pill to expand right inspector when closed */}
        {!isInspectorOpen && (
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="absolute right-2 top-3 z-20 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 shadow-xl backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Özellikler Panelini Aç"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Özellikler</span>
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
            <Inspector onClose={() => setIsInspectorOpen(false)} />
          </div>
        </div>
      </div>

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
