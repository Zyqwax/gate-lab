import React, { useRef } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { TEMPLATES } from '../templates/circuits';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  TableProperties,
  Download,
  Upload,
  Undo2,
  Redo2,
  Trash2,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface ToolbarProps {
  onOpenTruthTable: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenTruthTable }) => {
  const {
    isRunning,
    togglePlay,
    step,
    resetSimulation,
    tickRateHz,
    setTickRate,
    loadTemplate,
    clearCircuit,
    exportJSON,
    importJSON,
    undo,
    redo,
    historyPast,
    historyFuture,
    stepCount,
  } = useCircuitStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gate-lab-circuit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between select-none z-20 backdrop-blur-md shadow-lg">
      {/* Left: Simulation Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs shadow-md transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-600/90 hover:bg-amber-500 text-white shadow-amber-600/30'
              : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
          title={isRunning ? 'Simülasyonu Duraklat' : 'Simülasyonu Başlat'}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>DURAKLAT</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>ÇALIŞTIR</span>
            </>
          )}
        </button>

        <button
          onClick={step}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
          title="Tek Adım İlerle (Step)"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>Adım</span>
        </button>

        <button
          onClick={resetSimulation}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
          title="Simülasyonu Sıfırla"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Sıfırla</span>
        </button>

        {/* Speed / Frequency Control */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-mono text-slate-400">Hız:</span>
          <select
            value={tickRateHz}
            onChange={(e) => setTickRate(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-md px-2 py-1 font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value={1}>1 Hz</option>
            <option value={2}>2 Hz</option>
            <option value={5}>5 Hz</option>
            <option value={10}>10 Hz</option>
            <option value={20}>20 Hz</option>
          </select>

          <span className="text-[10px] font-mono text-slate-500 pl-1">
            #{stepCount} tick
          </span>
        </div>
      </div>

      {/* Center: Built-in Templates */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-medium text-slate-300">Şablonlar:</span>
        <select
          defaultValue="full-adder"
          onChange={(e) => {
            if (e.target.value) {
              loadTemplate(e.target.value);
            }
          }}
          className="bg-slate-950 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Tools & Storage */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenTruthTable}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
          title="Doğruluk Tablosu Çıkarıcı"
        >
          <TableProperties className="w-3.5 h-3.5" />
          <span>Truth Table</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={undo}
          disabled={historyPast.length === 0}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Geri Al (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={redo}
          disabled={historyFuture.length === 0}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="İleri Al (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={handleExport}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          title="Devreyi JSON Olarak İndir"
        >
          <Download className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          title="JSON Devre Yükle"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (confirm('Devredeki tüm parçalar temizlensin mi?')) {
              clearCircuit();
            }
          }}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/60 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer ml-1"
          title="Tuvali Temizle"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
