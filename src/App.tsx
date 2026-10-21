import React, { useEffect, useState } from 'react';
import { Palette } from './editor/Palette';
import { Canvas } from './editor/Canvas';
import { Toolbar } from './editor/Toolbar';
import { Inspector } from './editor/Inspector';
import { TruthTableModal } from './panels/TruthTableModal';
import { useCircuitStore } from './store/circuitStore';

export const App: React.FC = () => {
  const [isTruthTableOpen, setIsTruthTableOpen] = useState(false);

  const isRunning = useCircuitStore((state) => state.isRunning);
  const tickRateHz = useCircuitStore((state) => state.tickRateHz);
  const step = useCircuitStore((state) => state.step);

  // Clock & simulation tick loop
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
      <Toolbar onOpenTruthTable={() => setIsTruthTableOpen(true)} />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Component Palette */}
        <Palette />

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
    </div>
  );
};

export default App;
