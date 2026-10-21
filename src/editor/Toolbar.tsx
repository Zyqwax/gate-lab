'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
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
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeft,
  LayoutGrid,
  Save,
  Check,
  ChevronLeft,
  Pencil,
} from 'lucide-react';

interface ToolbarProps {
  onOpenTruthTable: () => void;
  onOpenWelcome?: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onOpenTruthTable,
  onOpenWelcome,
  isSidebarOpen,
  onToggleSidebar,
}) => {
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
    currentProjectName,
    setProjectName,
    isSaved,
    saveCurrentProject,
  } = useCircuitStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentProjectName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempName(currentProjectName);
  }, [currentProjectName]);

  // Sync fullscreen state with document events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  };

  const handleSave = () => {
    saveCurrentProject();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProjectName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'gate-lab-circuit'}.json`;
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
        const ok = importJSON(content);
        if (!ok) {
          alert('Hata: Geçersiz devre JSON dosyası. Lütfen geçerli bir devre dosyası seçin.');
        } else {
          // Update project name from filename
          const cleanName = file.name.replace(/\.json$/i, '').replace(/[-_]/g, ' ');
          setProjectName(cleanName);
        }
      }
    };
    reader.onerror = () => {
      alert('Dosya okunurken bir hata oluştu.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setProjectName(tempName.trim());
    } else {
      setTempName(currentProjectName);
    }
    setIsEditingName(false);
  };

  return (
    <header className="h-14 bg-slate-900/90 border-b border-slate-800 px-3 flex items-center justify-between select-none z-20 backdrop-blur-md shadow-lg">
      {/* Left: Dashboard link, Sidebar toggle & Project Name */}
      <div className="flex items-center gap-2">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-colors"
          title="Dashboard'a Dön"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Projeler</span>
        </Link>

        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isSidebarOpen
              ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title={isSidebarOpen ? 'Parça Panelini Gizle' : 'Parça Panelini Göster'}
        >
          {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Project Title Editor */}
        <div className="flex items-center gap-1.5 max-w-[200px] md:max-w-[260px]">
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameSubmit();
                if (e.key === 'Escape') {
                  setTempName(currentProjectName);
                  setIsEditingName(false);
                }
              }}
              autoFocus
              className="bg-slate-950 border border-emerald-500 rounded px-2 py-0.5 text-xs text-white font-medium focus:outline-none w-full"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-1.5 text-left text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-colors group cursor-pointer truncate"
              title="İsmi değiştirmek için tıklayın"
            >
              <span className="truncate">{currentProjectName}</span>
              <Pencil className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          )}
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ml-1 ${
            justSaved || isSaved
              ? 'bg-slate-800/90 text-emerald-400 border border-emerald-800/60'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/30 animate-pulse'
          }`}
          title="Devreyi yerel depolamaya kaydet"
        >
          {justSaved || isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{justSaved ? 'Kaydedildi!' : 'Kayıtlı'}</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Kaydet</span>
            </>
          )}
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden lg:block" />

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer ${
            isRunning
              ? 'bg-amber-600/90 hover:bg-amber-500 text-white shadow-amber-600/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/20'
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
          <span className="hidden md:inline">Adım</span>
        </button>

        <button
          onClick={resetSimulation}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors cursor-pointer"
          title="Simülasyonu Sıfırla"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sıfırla</span>
        </button>
      </div>

      {/* Center: Quick Template Switcher & Frequency */}
      <div className="hidden xl:flex items-center gap-3">
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

        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-slate-300">Şablon Yükle:</span>
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                loadTemplate(e.target.value);
              }
            }}
            className="bg-slate-950 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="" disabled>Şablon Seçin...</option>
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Fullscreen, Truth Table, Storage & Undo */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onOpenTruthTable}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
          title="Doğruluk Tablosu Çıkarıcı"
        >
          <TableProperties className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Truth Table</span>
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
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/60 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer ml-0.5"
          title="Tuvali Temizle"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isFullscreen ? 'Tam Ekrandan Çık (Esc)' : 'Tam Ekrana Geç'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-emerald-400" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
