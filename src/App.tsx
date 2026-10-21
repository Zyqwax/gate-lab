import React, { useEffect, useState } from 'react';
import { Palette } from './editor/Palette';
import { Canvas } from './editor/Canvas';
import { Toolbar } from './editor/Toolbar';
import { Inspector } from './editor/Inspector';
import { TruthTableModal } from './panels/TruthTableModal';
import { WelcomeModal } from './panels/WelcomeModal';
import { useCircuitStore } from './store/circuitStore';
import { ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  const [isTruthTableOpen, setIsTruthTableOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true); // Open initially to select mode!
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isRunning = useCircuitStore((state) => state.isRunning);
  const tickRateHz = useCircuitStore((state) => state.tickRateHz);
  const step = useCircuitStore((state) => state.step);

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
    <div className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Application Toolbar */}
      <Toolbar
        onOpenTruthTable={() => setIsTruthTableOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Component Palette with Smooth Collapse */}
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden flex z-10 ${
            isSidebarOpen ? 'w-72' : 'w-0'
          }`}
        >
          <div className="w-72 h-full">
            <Palette />
          </div>
        </div>

        {/* Small floating pill to expand sidebar when closed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-2 top-4 z-20 px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 shadow-xl backdrop-blur-md text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
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

        {/* Right Element Inspector */}
        <Inspector />
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
